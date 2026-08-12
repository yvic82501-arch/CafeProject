const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const venueRoutes = require("./routes/venueRoutes");
const authRoutes = require("./routes/authRoutes");
const queueRoutes = require("./routes/queueRoutes");
const analyticRoutes = require("./routes/analyticRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

const app = express();

app.use(cors());

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({
    message: "Cafe Is Running...",
  });
});

app.use("/api/venue", venueRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/queue", queueRoutes);
app.use("/api/stat", analyticRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
