const express = require("express");

const app = express();

const PORT = 5000;

app.get("/api/weather", (req, res) => {
    res.json({
        city: "Cairo",
        temperature: 30,
        condition: "Sunny"
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});