const app = require("./app");
const http = require("http");
const config = require("./");
const setupSocket = require("./socket");
const connectDB = require("./database");

const server = http.createServer(app);

const io = setupSocket(server);


server.listen(config.PORT, () => {
  console.log(`Server is running on PORT ${config.PORT}`);
});

connectDB().then(() => {
  console.log("Database connected and seed check done.");
});
