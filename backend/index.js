const express = require("express");
const dotEnv = require("dotenv");

const app = express();
dotEnv.config();

app.get("/", (req, res) => {
  res.send("Hello");
});

const PORT = process.env.PORT;

app.listen(PORT, () => console.log(`App is running on port - ${PORT}`));
