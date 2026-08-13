const { readData, writeData } = require("../utils/database");
const { v4: uuidv4 } = require("uuid");

// =========================
// Register
// =========================

function register(req, res) {

    try {

        let { name, email, password } = req.body;

        name = name ? name.trim() : "";
        email = email ? email.trim().toLowerCase() : "";
        password = password ? password.trim() : "";

        if (!name || !email || !password) {
            return res.status(400).send("All fields are required.");
        }

        const users = readData("users.json");

        const existingUser = users.find(
            user => user.email &&
                    user.email.trim().toLowerCase() === email
        );

        if (existingUser) {
            return res.send("Email already exists.");
        }

        const newUser = {
            id: uuidv4(),
            name: name,
            email: email,
            password: password,
            role: "customer"
        };

        users.push(newUser);

        writeData("users.json", users);

        console.log("New user registered:", {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email
        });

        res.redirect("/login");

    } catch (error) {

        console.error("REGISTER ERROR:", error);

        res.status(500).send(
            "Registration failed. Please try again."
        );
    }
}


// =========================
// Login
// =========================

function login(req, res) {

    try {

        let { email, password } = req.body;

        email = email ? email.trim().toLowerCase() : "";
        password = password ? password.trim() : "";

        console.log("LOGIN ATTEMPT:", email);

        if (!email || !password) {
            return res.status(400).send(
                "Email and password are required."
            );
        }

        const users = readData("users.json");

        console.log(
            "USERS LOADED:",
            users.length
        );

        const user = users.find(
            u =>
                u.email &&
                u.email.trim().toLowerCase() === email &&
                u.password === password
        );

        if (!user) {

            console.log(
                "LOGIN FAILED FOR:",
                email
            );

            return res.send(
                "Invalid Email or Password"
            );
        }

        // Store user in session
req.session.user = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role
};

req.session.save((error) => {

    if (error) {
        console.error("SESSION SAVE ERROR:", error);

        return res.status(500).send(
            "Unable to create login session."
        );
    }

    res.redirect("/customer/dashboard");
});

    } catch (error) {

        console.error(
            "LOGIN ERROR:",
            error
        );

        res.status(500).send(
            "Login failed. Please try again."
        );
    }
}


// =========================
// Export
// =========================

module.exports = {
    register,
    login
};