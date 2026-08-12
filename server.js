require("dotenv").config();

const app = require("./src/app");
const connectDB = require("./src/config/db");

const { setServers } = require("node:dns/promises");
setServers(["8.8.8.8", "1.1.1.1"]);

const PORT = process.env.PORT;

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
  });
};

startServer();
