const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

// CORS để cho InfinityFree connect
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

let deviceState = {
  light: "OFF",
  onlineUsers: 0,
};
app.get("/test", (req, res) => {
  res.send("OK TEST");
});
app.get("/", (req, res) => {
  res.send("Server is running");
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  deviceState.onlineUsers++;

  socket.emit("init", deviceState);
  io.emit("update-users", deviceState.onlineUsers);

  socket.on("toggle-light", () => {
    deviceState.light = deviceState.light === "OFF" ? "ON" : "OFF";
    io.emit("update-ui", deviceState.light);
  });

  socket.on("disconnect", () => {
    deviceState.onlineUsers--;
    io.emit("update-users", deviceState.onlineUsers);
  });
});

const PORT = process.env.PORT || 3000;
console.log("🔥 SERVER FILE LOADED");

server.listen(PORT, () => {
  console.log("✅ Running on port", PORT);
});
server.listen(PORT, () => {
  console.log("Running on port", PORT);
});
