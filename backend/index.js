const express = require("express");
const dotEnv = require("dotenv");
const connectDb = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const { errorHandler, notFound } = require("./middleware/errorMiddleware");

const app = express();
app.use(express.json());

dotEnv.config();
connectDb();

app.get("/", (req, res) => {
  res.send("Hello");
});

app.use("/api/user", userRoutes);

// Error Handling
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT;

app.listen(PORT, () => console.log(`App is running on port - ${PORT}`));
