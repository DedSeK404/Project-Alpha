const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

require("dotenv").config({ path: "./config/.env" });
const PORT = process.env.PORT || 6000;

app.use(cors());

const connectToDB = require("./config/DataBase");
app.use(express.json());
connectToDB();

// Define routes
app.use("/auth", require("./routes/authRoutes"));
app.use("/stage", require("./routes/stageRoutes"));
app.use("/account", require("./routes/accountRoutes"));
app.use("/rapport", require("./routes/rapportRoutes"));
app.use("/notification", require("./routes/notificationRoutes"));

// Socket.IO connection logic
io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });

  // Event listener for "sendNotification" event
  socket.on("sendNotification", (notificationData) => {
    // Emit a new event to the client with the notification data
    io.emit("newNotification", notificationData);
  });
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
