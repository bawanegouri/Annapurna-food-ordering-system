const express = require("express");
const router = express.Router();
const path = require("path");
const multer = require("multer");

const { readData, writeData } = require("../utils/database");

// =====================================================
// MULTER CONFIGURATION
// =====================================================

const storage = multer.diskStorage({

    destination: function (req, file, cb) {

        cb(
            null,
            path.join(__dirname, "../public/images")
        );

    },

    filename: function (req, file, cb) {

        cb(
            null,
            Date.now() + "-" + file.originalname
        );

    }

});

const upload = multer({
    storage: storage
});


// =====================================================
// ADMIN DASHBOARD
// =====================================================

router.get("/admin/dashboard", (req, res) => {

    res.sendFile(
        path.join(
            __dirname,
            "../views/admin/dashboard.html"
        )
    );

});


// =====================================================
// ADD FOOD PAGE
// =====================================================

router.get("/admin/add-food", (req, res) => {

    res.sendFile(
        path.join(
            __dirname,
            "../views/admin/add-food.html"
        )
    );

});


// =====================================================
// SAVE NEW FOOD
// =====================================================

router.post(
    "/admin/add-food",
    upload.single("image"),
    (req, res) => {

        console.log("FORM DATA:", req.body);
        console.log("IMAGE:", req.file);

        try {

            const {
                name,
                price,
                category,
                type,
                originalPrice,
                discount,
                offer
            } = req.body;


            let dishes = readData("dishes.json");


            const newDish = {

                id: Date.now(),

                name:
                    name
                        ? name.trim()
                        : "",

                price:
                    Number(price) || 0,

                category:
                    category || "Other",

                // Regular food or combo
                type:
                    type || "food",

                // Original price for combo
                originalPrice:
                    originalPrice
                        ? Number(originalPrice)
                        : 0,

                // Discount
                discount:
                    discount
                        ? Number(discount)
                        : 0,

                // Special offer
                offer:
                    offer
                        ? offer.trim()
                        : "",

                // Uploaded image
                image:
                    req.file
                        ? "/images/" + req.file.filename
                        : ""

            };


            dishes.push(newDish);


            writeData(
                "dishes.json",
                dishes
            );


            console.log(
                "New dish saved:",
                newDish
            );


            res.redirect(
                "/admin/dashboard"
            );


        } catch (error) {

            console.error(
                "Error while adding food:",
                error
            );

            res.status(500).send(
                "Error while adding food."
            );

        }

    }
);


// =====================================================
// VIEW ORDERS PAGE
// =====================================================

router.get("/admin/view-orders", (req, res) => {

    res.sendFile(
        path.join(
            __dirname,
            "../views/admin/view-orders.html"
        )
    );

});


// =====================================================
// ADMIN ORDERS API
// =====================================================

router.get("/admin/orders", (req, res) => {

    try {

        const orders = readData("orders.json");


        /*
         * Convert the order data into a clean format
         * for the admin page.
         *
         * Your customer order uses:
         *
         * customerName
         * phone
         * deliveryAddress
         * total
         * status
         * items
         */

        const formattedOrders = orders.map(order => {

            return {

                id:
                    order.id || Date.now(),

                customerName:
                    order.customerName ||
                    order.name ||
                    "Unknown Customer",

                phone:
                    order.phone ||
                    "Not provided",

                address:
                    order.deliveryAddress ||
                    order.address ||
                    "Not provided",

                total:
                    Number(order.total) || 0,

                status:
                    order.status ||
                    "Placed",

                items:
                    Array.isArray(order.items)
                        ? order.items
                        : []

            };

        });


        res.json(formattedOrders);


    } catch (error) {

        console.error(
            "Error loading admin orders:",
            error
        );

        res.status(500).json({

            message:
                "Unable to load orders"

        });

    }

});


// =====================================================
// EDIT FOOD PAGE
// =====================================================

router.get(
    "/admin/edit-food/:id",
    (req, res) => {

        const id =
            Number(req.params.id);


        const dishes =
            readData("dishes.json");


        const dish =
            dishes.find(
                d => d.id === id
            );


        if (!dish) {

            return res.status(404).send(
                "Dish not found"
            );

        }


        res.sendFile(
            path.join(
                __dirname,
                "../views/admin/edit-food.html"
            )
        );

    }
);


// =====================================================
// MANAGE FOOD PAGE
// =====================================================

router.get(
    "/admin/manage-food",
    (req, res) => {

        res.sendFile(
            path.join(
                __dirname,
                "../views/admin/manage-food.html"
            )
        );

    }
);


// =====================================================
// DELETE FOOD
// =====================================================

router.delete(
    "/admin/delete-food/:id",
    (req, res) => {

        try {

            const id =
                Number(req.params.id);


            let dishes =
                readData("dishes.json");


            const oldLength =
                dishes.length;


            dishes =
                dishes.filter(
                    dish =>
                        dish.id !== id
                );


            if (dishes.length === oldLength) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Dish not found"

                });

            }


            writeData(
                "dishes.json",
                dishes
            );


            res.json({

                success: true,

                message:
                    "Dish deleted successfully"

            });


        } catch (error) {

            console.error(
                "Delete food error:",
                error
            );


            res.status(500).json({

                success: false,

                message:
                    "Unable to delete dish"

            });

        }

    }
);


// =====================================================
// GET SINGLE DISH
// =====================================================

router.get(
    "/api/dish/:id",
    (req, res) => {

        const id =
            Number(req.params.id);


        const dishes =
            readData("dishes.json");


        const dish =
            dishes.find(
                d => d.id === id
            );


        if (!dish) {

            return res.status(404).json({

                message:
                    "Dish not found"

            });

        }


        res.json(dish);

    }
);


// =====================================================
// UPDATE FOOD
// =====================================================

router.post(
    "/admin/update-food/:id",
    (req, res) => {

        try {

            const id =
                Number(req.params.id);


            let dishes =
                readData("dishes.json");


            const index =
                dishes.findIndex(
                    d => d.id === id
                );


            if (index === -1) {

                return res.status(404).send(
                    "Dish not found"
                );

            }


            // Basic information

            dishes[index].name =
                req.body.name
                    ? req.body.name.trim()
                    : dishes[index].name;


            dishes[index].price =
                Number(req.body.price) ||
                0;


            dishes[index].category =
                req.body.category ||
                dishes[index].category;


            // Combo information

            dishes[index].type =
                req.body.type ||
                dishes[index].type ||
                "food";


            dishes[index].originalPrice =
                req.body.originalPrice
                    ? Number(req.body.originalPrice)
                    : 0;


            dishes[index].discount =
                req.body.discount
                    ? Number(req.body.discount)
                    : 0;


            dishes[index].offer =
                req.body.offer
                    ? req.body.offer.trim()
                    : "";


            writeData(
                "dishes.json",
                dishes
            );


            console.log(
                "Dish updated:",
                dishes[index]
            );


            res.redirect(
                "/admin/manage-food"
            );


        } catch (error) {

            console.error(
                "Update food error:",
                error
            );


            res.status(500).send(
                "Error while updating food."
            );

        }

    }
);


// =====================================================
// EXPORT ROUTER
// =====================================================

module.exports = router;