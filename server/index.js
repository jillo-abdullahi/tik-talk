const express = require("express");
const socketio = require("socket.io");
const http = require("http");

const { addUser, removeUser, getUser, getUsersInRoom, users } = require("./users");

const app = express();
const router = require("./router");
const { connect } = require("./router");

const server = http.createServer(app);
const io = socketio(server);

//connect and disconnect.
io.on("connection", (socket) => {
  console.log("We have a new connection!!");
  socket.on("join", ({ name, room }, callback) => {
    console.log({ name, room });

    const { error, user } = addUser({ id: socket.id, name, room });
    
    // callback function for error handling
    if (error) {
      return callback(error);
    }

    //emit admin joining message
    socket.emit("message", {
      user: "admin",
      text: `Welcome to ${user.room}, ${user.name}!`,
    });

    socket.broadcast.to(user.room).emit("message", {
      user: "admin",
      text: `${user.name} has joined the chat!.`,
    });

    //join room
    socket.join(user.room);

    callback();
  });

  socket.on("sendMessage", (message, callback) => {
    const user = getUser(socket.id);

    io.to(user.room).emit("message", { user: user.name, text: message });

    callback();
  });
  socket.on("disconnect", () => {
    console.log("User has left!!");
  });
});

app.use(router);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server started on ${PORT}`);
});
