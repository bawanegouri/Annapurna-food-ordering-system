const express = require("express");
const router = express.Router();
const path = require("path");

const {
    readData,
    writeData
} = require("../utils/database");


// ======================================================
// HELPER — GET CURRENT CUSTOMER
// ======================================================

function getCustomer(req) {

    if (!req.session.user) {
        return null;
    }

    const user = req.session.user;

    return {
        name: user.name || "Customer",
        email: user.email
            ? user.email.toLowerCase()
            : null
    };
}


// ======================================================
// CUSTOMER PAGES
// ======================================================


// Customer Dashboard
router.get("/customer/dashboard", (req, res) => {

    if (!req.session.user) {
        return res.redirect("/login");
    }

    res.sendFile(
        path.join(
            __dirname,
            "../views/customer/dashboard.html"
        )
    );

});


// Customer Menu
router.get("/customer/menu", (req, res) => {

    res.sendFile(
        path.join(
            __dirname,
            "../views/customer/menu.html"
        )
    );

});


// Customer Cart
router.get("/customer/cart", (req, res) => {

    res.sendFile(
        path.join(
            __dirname,
            "../views/customer/cart.html"
        )
    );

});


// Customer Checkout
router.get("/customer/checkout", (req, res) => {

    if (!req.session.user) {
        return res.redirect("/login");
    }

    res.sendFile(
        path.join(
            __dirname,
            "../views/customer/checkout.html"
        )
    );

});


// Customer Success Page
router.get("/customer/success", (req, res) => {

    if (!req.session.user) {
        return res.redirect("/login");
    }

    res.sendFile(
        path.join(
            __dirname,
            "../views/customer/success.html"
        )
    );

});


// Customer Orders Page
router.get("/customer/orders", (req, res) => {

    if (!req.session.user) {
        return res.redirect("/login");
    }

    res.sendFile(
        path.join(
            __dirname,
            "../views/customer/orders.html"
        )
    );

});


// ======================================================
// CART API
// ======================================================


// Add food to cart
router.post("/cart/add", (req, res) => {

    try {

        const { dishId } = req.body;

        let cart = readData("cart.json");
        let dishes = readData("dishes.json");


        const dish = dishes.find(
            d => d.id == dishId
        );


        if (!dish) {

            return res.status(404).json({

                success: false,

                message: "Dish not found."

            });

        }


        cart.push(dish);

        writeData(
            "cart.json",
            cart
        );


        res.json({

            success: true,

            message:
                "Dish added to cart successfully!"

        });


    } catch (error) {

        console.error(
            "Add cart error:",
            error
        );


        res.status(500).json({

            success: false,

            message:
                "Unable to add item to cart."

        });

    }

});


// ======================================================
// GET CART
// ======================================================

router.get("/cart", (req, res) => {

    try {

        const cart =
            readData("cart.json");

        res.json(cart);

    } catch (error) {

        console.error(
            "Cart error:",
            error
        );

        res.status(500).json({

            success: false,

            message:
                "Unable to load cart."

        });

    }

});


// ======================================================
// REMOVE ITEM FROM CART
// ======================================================

router.post("/cart/remove", (req, res) => {

    try {

        const { dishId } = req.body;

        let cart =
            readData("cart.json");


        const index =
            cart.findIndex(
                item => item.id == dishId
            );


        if (index !== -1) {

            cart.splice(
                index,
                1
            );

        }


        writeData(
            "cart.json",
            cart
        );


        res.json({

            success: true,

            message:
                "Item removed from cart."

        });


    } catch (error) {

        console.error(
            "Remove cart error:",
            error
        );


        res.status(500).json({

            success: false,

            message:
                "Unable to remove item."

        });

    }

});


// ======================================================
// PLACE ORDER
// ======================================================

router.post("/place-order", (req, res) => {

    try {

        // ------------------------------------------------
        // CUSTOMER MUST BE LOGGED IN
        // ------------------------------------------------

        if (!req.session.user) {

            return res.status(401).json({

                success: false,

                message:
                    "Please login before placing an order."

            });

        }


        const customer =
            getCustomer(req);


        // ------------------------------------------------
        // GET CHECKOUT INFORMATION
        // ------------------------------------------------

        const {

            name,
            phone,
            email,

            house,
            area,
            landmark,
            city,
            state,
            pincode,

            paymentMethod

        } = req.body;


        // ------------------------------------------------
        // BASIC VALIDATION
        // ------------------------------------------------

        if (
            !name ||
            !phone ||
            !email
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Please complete your personal details."

            });

        }


        // ------------------------------------------------
        // PHONE VALIDATION
        // ------------------------------------------------

        if (
            !/^\d{10}$/.test(
                phone.trim()
            )
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Phone number must contain exactly 10 digits."

            });

        }


        // ------------------------------------------------
        // EMAIL VALIDATION
        // Only .com allowed
        // ------------------------------------------------

        if (
            !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.com$/
                .test(email.trim())
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Please enter a valid .com email address."

            });

        }


        // ------------------------------------------------
        // ADDRESS VALIDATION
        // ------------------------------------------------

        if (
            !house ||
            !area ||
            !city ||
            !state ||
            !pincode
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Please complete your delivery address."

            });

        }


        // ------------------------------------------------
        // PIN CODE VALIDATION
        // ------------------------------------------------

        if (
            !/^[1-9][0-9]{5}$/
                .test(pincode.trim())
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Please enter a valid 6-digit PIN code."

            });

        }


        // ------------------------------------------------
        // READ CART AND ORDERS
        // ------------------------------------------------

        const cart =
            readData("cart.json");

        const orders =
            readData("orders.json");


        // ------------------------------------------------
        // CHECK CART
        // ------------------------------------------------

        if (
            !cart ||
            cart.length === 0
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Your cart is empty."

            });

        }


        // =================================================
        // CALCULATE FOOD TOTAL
        // =================================================

        let foodTotal = 0;


        cart.forEach(item => {

            foodTotal +=
                Number(item.price) || 0;

        });


        // =================================================
        // DELIVERY CHARGE
        // =================================================

        const deliveryCharge =
            cart.length > 0
                ? 40
                : 0;


        // =================================================
        // DISCOUNT
        // =================================================

        const discount = 0;


        // =================================================
        // FINAL TOTAL
        // =================================================

        const total =
            foodTotal +
            deliveryCharge -
            discount;


        // =================================================
        // CREATE DELIVERY ADDRESS
        // =================================================

        const deliveryAddress = {

            house:
                house.trim(),

            area:
                area.trim(),

            landmark:
                landmark
                    ? landmark.trim()
                    : "",

            city:
                city.trim(),

            state:
                state.trim(),

            pincode:
                pincode.trim()

        };


        // =================================================
        // CREATE CUSTOMER ID
        // =================================================

        const customerId =
            customer.email ||
            customer.name;


        // =================================================
        // CREATE ORDER
        // =================================================

        const order = {

            // Order ID
            id:
                Date.now(),


            // ---------------------------------------------
            // Customer Information
            // ---------------------------------------------

            customerName:
                name.trim(),

            customerEmail:
                email
                    .trim()
                    .toLowerCase(),

            phone:
                phone.trim(),


            // IMPORTANT:
            // Used to identify order owner

            customerId:
                customerId,


            // ---------------------------------------------
            // Delivery Information
            // ---------------------------------------------

            deliveryAddress:
                deliveryAddress,


            // ---------------------------------------------
            // Payment Information
            // ---------------------------------------------

            paymentMethod:
                paymentMethod ||
                "Cash on Delivery",

            paymentStatus:
                "Pending",


            // ---------------------------------------------
            // Ordered Food
            // ---------------------------------------------

            items:
                cart,


            // ---------------------------------------------
            // Pricing
            // ---------------------------------------------

            foodTotal:
                foodTotal,

            deliveryCharge:
                deliveryCharge,

            discount:
                discount,

            total:
                total,


            // ---------------------------------------------
            // Order Status
            // ---------------------------------------------

            status:
                "Placed",

            createdAt:
                Date.now()

        };


        // =================================================
        // SAVE ORDER
        // =================================================

        orders.push(order);


        writeData(
            "orders.json",
            orders
        );


        // =================================================
        // EMPTY CART
        // =================================================

        writeData(
            "cart.json",
            []
        );


        // =================================================
        // CONSOLE
        // =================================================

        console.log(
            "New order created:",
            order
        );


        // =================================================
        // RESPONSE
        // =================================================

        res.json({

            success: true,

            message:
                "Order placed successfully!",

            orderId:
                order.id

        });


    } catch (error) {

        console.error(
            "Place order error:",
            error
        );


        res.status(500).json({

            success: false,

            message:
                "Unable to place order."

        });

    }

});


// ======================================================
// CUSTOMER ORDERS API
// ======================================================
//
// IMPORTANT:
// This route returns ONLY the logged-in customer's orders.
// It does NOT return everybody's orders.
//
// Admin will have a separate route.
// ======================================================

router.get("/orders", (req, res) => {

    try {

        // ------------------------------------------------
        // LOGIN CHECK
        // ------------------------------------------------

        if (!req.session.user) {

            return res.status(401).json({

                success: false,

                message:
                    "Please login first."

            });

        }


        // ------------------------------------------------
        // GET CURRENT CUSTOMER
        // ------------------------------------------------

        const customer =
            getCustomer(req);


        const customerId =
            customer.email ||
            customer.name;


        // ------------------------------------------------
        // READ ALL ORDERS
        // ------------------------------------------------

        const allOrders =
            readData("orders.json");


        // ------------------------------------------------
        // FILTER CUSTOMER ORDERS
        // ------------------------------------------------

        const customerOrders =
            allOrders.filter(order => {

                return (
                    order.customerId ===
                    customerId
                );

            });


        // ------------------------------------------------
        // UPDATE STATUS
        // ------------------------------------------------

        const now =
            Date.now();


        customerOrders.forEach(order => {

            const seconds =
                (
                    now -
                    order.createdAt
                ) / 1000;


            if (seconds >= 30) {

                order.status =
                    "Delivered";

            }

            else if (seconds >= 20) {

                order.status =
                    "Preparing";

            }

            else {

                order.status =
                    "Placed";

            }

        });


        // ------------------------------------------------
        // SAVE UPDATED STATUS
        // ------------------------------------------------

        writeData(
            "orders.json",
            allOrders
        );


        // ------------------------------------------------
        // RETURN ONLY CUSTOMER ORDERS
        // ------------------------------------------------

        res.json(
            customerOrders
        );


    } catch (error) {

        console.error(
            "Orders error:",
            error
        );


        res.status(500).json({

            success: false,

            message:
                "Unable to load orders."

        });

    }

});


// ======================================================
// EXPORT ROUTER
// ======================================================
router.get("/api/current-user", (req, res) => {

    if (!req.session.user) {
        return res.status(401).json({
            success: false,
            message: "Not logged in"
        });
    }

    res.json({
        success: true,
        name:
            req.session.user.name ||
            req.session.user.email ||
            "Customer"
    });

});
module.exports = router;