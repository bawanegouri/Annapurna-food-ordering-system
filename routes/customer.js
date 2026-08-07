const express = require("express");
const router = express.Router();
const path = require("path");
const { readData, writeData } = require("../utils/database");

// =========================
// Customer Pages
// =========================

router.get("/customer/dashboard", (req, res) => {

    if (!req.session.user) {
        return res.redirect("/login");
    }

    res.sendFile(
        path.join(__dirname, "../views/customer/dashboard.html")
    );

});

router.get("/customer/menu", (req, res) => {
    res.sendFile(
        path.join(__dirname, "../views/customer/menu.html")
    );
});

router.get("/customer/cart", (req, res) => {
    res.sendFile(
        path.join(__dirname, "../views/customer/cart.html")
    );
});

router.get("/customer/checkout", (req, res) => {
    res.sendFile(
        path.join(__dirname, "../views/customer/checkout.html")
    );
});


// =========================
// Cart APIs
// =========================

router.post("/cart/add", (req, res) => {

    const { dishId } = req.body;

    let cart = readData("cart.json");
    let dishes = readData("dishes.json");

    const dish = dishes.find(d => d.id == dishId);

    if (!dish) {
        return res.status(404).json({
            message: "Dish not found"
        });
    }

    cart.push(dish);

    writeData("cart.json", cart);

    res.json({
        message: "Dish added to cart successfully!"
    });

});

router.get("/cart", (req, res) => {

    const cart = readData("cart.json");

    res.json(cart);

});
// =========================
// Remove Item from Cart
// =========================

router.post("/cart/remove", (req, res) => {

    const { dishId } = req.body;

    let cart = readData("cart.json");

    const index = cart.findIndex(item => item.id == dishId);

    if (index !== -1) {
        cart.splice(index, 1);
    }

    writeData("cart.json", cart);

    res.json({
        success: true
    });

});
// =========================
// Place Order
// =========================

router.post("/place-order", (req, res) => {

    const { name, phone, address } = req.body;

    const cart = readData("cart.json");
    const orders = readData("orders.json");

    let total = 0;

    cart.forEach(item => {
        total += item.price;
    });

const order = {
    id: Date.now(),
    name,
    phone,
    address,
    items: cart,
    total,
    status: "Placed",
    createdAt: Date.now()
};

    orders.push(order);

    writeData("orders.json", orders);

    writeData("cart.json", []);

    res.redirect("/customer/success");

});

// =========================
// Orders API
// =========================

router.get("/orders", (req, res) => {

    const orders = readData("orders.json");

    const now = Date.now();

    orders.forEach(order => {

        const seconds = (now - order.createdAt) / 1000;

        if (seconds >= 20) {

            order.status = "Delivered";

        }

        else if (seconds >= 10) {

            order.status = "Preparing";

        }

        else {

            order.status = "Placed";

        }

    });

    writeData("orders.json", orders);

    res.json(orders);

});
router.get("/customer/success", (req, res) => {
    res.sendFile(
        path.join(__dirname, "../views/customer/success.html")
    );
});
router.get("/customer/orders", (req, res) => {
    res.sendFile(
        path.join(__dirname, "../views/customer/orders.html")
    );
});

module.exports = router;