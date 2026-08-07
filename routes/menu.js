const express = require("express");
const router = express.Router();

const { readData } = require("../utils/database");

router.get("/api/menu", (req, res) => {

    const dishes = readData("dishes.json");

    res.json(dishes);

});

module.exports = router;