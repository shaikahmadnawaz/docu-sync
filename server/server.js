import express from "express";
import mongoose from "mongoose";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

// Create an Express application
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  pingTimeout: 60000,
  cors: {
    origin: "*",
  },
});

app.use(cors());

// Socket.io setup for real-time synchronization
io.on("connection", (socket) => {
  console.log("User connected");

  // Handle real-time events here
  // For example, you can emit and listen for 'text-edit' events

  socket.on("text-edit", (data) => {
    // Broadcast the edited text to all connected clients
    io.emit("text-edited", data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

// Start the Express server
const port = process.env.PORT || 5000;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
