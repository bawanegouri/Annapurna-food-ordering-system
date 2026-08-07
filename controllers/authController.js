const { readData, writeData } = require("../utils/database");
const { v4: uuidv4 } = require("uuid");

// Register Function
function register(req, res) {

    const { name, email, password } = req.body;

    const users = readData("users.json");

    const existingUser = users.find(user => user.email === email);

    if (existingUser) {
        return res.send("Email already exists.");
    }

    const newUser = {
        id: uuidv4(),
        name,
        email,
        password,
        role: "customer"
    };

    users.push(newUser);

    writeData("users.json", users);

    res.redirect("/login");
}

// Login Function
function login(req, res) {

    const { email, password } = req.body;

    const users = readData("users.json");

    const user = users.find(
        u => u.email === email && u.password === password
    );

    if (!user) {
        return res.send("Invalid Email or Password");
    }

    req.session.user = user;

    res.redirect("/customer/dashboard");
}

// Export Functions
module.exports = {
    register,
    login
};