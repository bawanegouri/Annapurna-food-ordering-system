const express = require("express");
const path = require("path");
const session = require("express-session");

// Route Files
const authRoutes = require("./routes/auth");
const customerRoutes = require("./routes/customer");
const menuRoutes = require("./routes/menu");
const adminRoutes = require("./routes/admin");

const app = express();
const PORT = 3000;


// =========================
// Middleware
// =========================

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
    session({
        secret: "annapurna_secret_key",
        resave: false,
        saveUninitialized: false
    })
);


// =========================
// Static Files
// =========================

app.use(express.static(path.join(__dirname, "public")));


// =========================
// Home Page
// =========================

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "index.html"));
});


// =========================
// Routes
// =========================

app.use(authRoutes);
app.use(customerRoutes);
app.use(menuRoutes);
app.use(adminRoutes);


// =========================
// 404 Page
// =========================

app.use((req, res) => {
    res.status(404).send("404 - Page Not Found");
});


// =========================
// Error Handler
// =========================

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send("Internal Server Error");
});


// =========================
// Start Server
// =========================

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});