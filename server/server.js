const express = require("express");
const cors = require("cors");
const fs = require("fs");
const { parse } = require("path");

// Create an express app
const app = express();
const port = 3000;

const corsOptions = {
  origin: "http://localhost:4200",
  optionSuccessStatus: 204,
  methods: "GET, POST",
};

app.use(cors(corsOptions));

app.get("/clothes", (req, res) => {
  const page = parseInt(req.query.page) || 0;
  const perPage = parseInt(req.query.perPage) || 10;

  fs.readFile("db.json", "utf8", (err, data) => {
    if (err) {
      res.status(500).send("Internal server error");
      return;
    }

    const jsonData = JSON.parse(data);

    const start = page * perPage;
    const end = start + perPage;

    const result = jsonData.items.slice(start, end);

    res.status(200).json({
      items: result,
      total: jsonData.items.length,
      page,
      perPage,
      totalPages: Math.ceil(jsonData.items.length / perPage),
    });
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
