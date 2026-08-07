const express = require("express");
const router = express.Router();
const path = require("path");
const multer = require("multer");

const { readData, writeData } = require("../utils/database");


// ==========================
// Multer Configuration
// ==========================

const storage = multer.diskStorage({

    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, "../public/images"));
    },

    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    }

});

const upload = multer({
    storage: storage
});


// ==========================
// Admin Dashboard
// ==========================

router.get("/admin/dashboard", (req, res) => {
    res.sendFile(
        path.join(__dirname, "../views/admin/dashboard.html")
    );
});


// ==========================
// Add Food Page
// ==========================

router.get("/admin/add-food", (req, res) => {
    res.sendFile(
        path.join(__dirname, "../views/admin/add-food.html")
    );
});


// ==========================
// Save Food
// ==========================

router.post(
    "/admin/add-food",
    upload.single("image"),
    (req, res) => {
        console.log(req.body);
        console.log(req.file);
        try {

            const { name, price, category } = req.body;

            let dishes = readData("dishes.json");

            const newDish = {

                id: Date.now(),

                name: name,

                price: Number(price),

                category: category,

                image: req.file
                    ? "/images/" + req.file.filename
                    : ""

            };

            dishes.push(newDish);

            writeData("dishes.json", dishes);

            res.redirect("/admin/dashboard");

        } catch (error) {

            console.log(error);

            res.status(500).send("Error while adding food.");

        }

    }
);


// ==========================
// View Orders
// ==========================

router.get("/admin/view-orders", (req, res) => {
    res.sendFile(
        path.join(__dirname, "../views/admin/view-orders.html")
    );
});


// ==========================
// Edit Food Page
// ==========================

router.get("/admin/edit-food/:id", (req, res) => {

    const id = Number(req.params.id);

    const dishes = readData("dishes.json");

    const dish = dishes.find(d => d.id === id);

    if (!dish) {
        return res.send("Dish not found");
    }

    res.sendFile(
        path.join(__dirname, "../views/admin/edit-food.html")
    );

});

// ==========================
// Manage Food Page
// ==========================

router.get("/admin/manage-food", (req, res) => {
    res.sendFile(
        path.join(__dirname, "../views/admin/manage-food.html")
    );
});

// ==========================
// Delete Food
// ==========================

router.delete("/admin/delete-food/:id", (req, res) => {

    const id = Number(req.params.id);

    let dishes = readData("dishes.json");

    dishes = dishes.filter(dish => dish.id !== id);

    writeData("dishes.json", dishes);

    res.json({
        success: true
    });

});

// ==========================
// Get Single Dish
// ==========================

router.get("/api/dish/:id", (req, res) => {

    const id = Number(req.params.id);

    const dishes = readData("dishes.json");

    const dish = dishes.find(d => d.id === id);

    if (!dish) {
        return res.status(404).json({
            message: "Dish not found"
        });
    }

    res.json(dish);

});

// ==========================
// Update Food
// ==========================

router.post("/admin/update-food/:id", (req, res) => {

    const id = Number(req.params.id);

    let dishes = readData("dishes.json");

    const index = dishes.findIndex(d => d.id === id);

    if (index === -1) {
        return res.send("Dish not found");
    }

    dishes[index].name = req.body.name;
    dishes[index].price = Number(req.body.price);
    dishes[index].category = req.body.category;

    writeData("dishes.json", dishes);

    res.redirect("/admin/manage-food");

});
module.exports = router;