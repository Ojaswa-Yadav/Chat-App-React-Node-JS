// Import required modules
const express = require("express"); // Importing Express framework
const app = express(); // Creating an Express application
const http = require("http"); // Importing HTTP module to create HTTP server
const cors = require("cors"); // Importing CORS (Cross-Origin Resource Sharing) module
const { Server } = require("socket.io"); // Importing Socket.IO
app.use(cors()); // Enabling CORS for all routes

// Creating an HTTP server with the Express application
const server = http.createServer(app);

// Setting up Socket.IO with the server and configuring CORS
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // Allowing access from this origin
    methods: ["GET", "POST"], // Allowing these HTTP methods
  },
});

// Event listener for new socket connections
io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`); // Logs when a user connects

  // Event listener for joining a room
  socket.on("join_room", (data) => {
    socket.join(data); // User joins the specified room
    console.log(`User with ID: ${socket.id} joined room: ${data}`); // Logs the room joining event
  });

  // Event listener for sending a message
  socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_message", data); // Sends the message to all users in the specified room except the sender
  });

  // Event listener for a socket disconnection
  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id); // Logs when a user disconnects
  });
});

// Server listening on port 3001
server.listen(3001, () => {
  console.log("SERVER RUNNING"); // Logs when the server starts running
});
