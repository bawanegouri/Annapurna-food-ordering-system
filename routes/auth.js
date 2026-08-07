const express = require("express");
const router = express.Router();
const path = require("path");

const authController = require("../controllers/authController");

// =========================
// Login Page
// =========================

router.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, "../views/login.html"));
});

// =========================
// Register Page
// =========================

router.get("/register", (req, res) => {
    res.sendFile(path.join(__dirname, "../views/register.html"));
});

// =========================
// Login
// =========================

router.post("/login", authController.login);

// =========================
// Register
// =========================

router.post("/register", authController.register);

// =========================
// Logout
// =========================

router.get("/logout", (req, res) => {

    req.session.destroy(() => {

        res.redirect("/");

    });

});
module.exports = router;