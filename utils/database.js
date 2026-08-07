const fs = require("fs");
const path = require("path");

function readData(fileName) {
    const filePath = path.join(__dirname, "..", "database", fileName);

    if (!fs.existsSync(filePath)) {
        return [];
    }

    const data = fs.readFileSync(filePath, "utf-8");

    return data ? JSON.parse(data) : [];
}

function writeData(fileName, data) {
    const filePath = path.join(__dirname, "..", "database", fileName);

    fs.writeFileSync(filePath, JSON.stringify(data, null, 4));
}

module.exports = {
    readData,
    writeData
};