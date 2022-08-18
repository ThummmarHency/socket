const express = require("express");
const app = express();
const server = require("http").createServer(app);
const PORT = 5000;

const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

let users = [];
let rooms = [];

io.on("connection", (socket) => {  
  console.log(`User connected: ${socket}`);
  socket.emit("me", socket.id);
  users.push(socket.id);

  socket.broadcast.emit("updateUsers", users);

  socket.on("disconnect", () => {
    console.log(`User ${socket.id} disconnected.`);
    users = users.filter((user) => user !== socket.id);
    console.log(users);
    socket.broadcast.emit("updateUsers", users);
    socket.disconnect();
  });

  socket.emit("getAllUsers", users);
  console.log(users);

  // Rooms
  socket.on("create_room", (props) => {
    const room = {
      id: props,
      name: props,
      capacity: 10,
      usersJoined: [socket.id],
      chat: [],
    };
    socket.join(room);
    socket.emit("get_room", room);
    console.log("Room created: " + room.id);
    rooms.push(room);

    socket.broadcast.emit("updateRooms", rooms);
  });

  socket.on("join_room", (room) => {
    socket.join(room.id);
    console.log(`user ${socket.id} joined room: ${room.id}`);
  });
  socket.emit("getAllRooms", rooms);

  socket.broadcast.emit("updateRooms", rooms);

  socket.on("message", (payload) => {
    rooms.map((room) => {
      if (room.id === payload.room) {
        singleChat = { message: payload.message, writer: payload.socketId };
        room.chat.push(singleChat);
        payload.chat = room.chat;
      }
    });

    io.to(payload.room).emit("chat", payload);
  });
});

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

//run : node server.js