const express = require("express");
const socketio = require("socket.io");
const http = require("http");

const app = express();
const router = require("./router");

const server = http.createServer(app);
const io = socketio(server);

//connect and disconnect.
io.on('connection', (socket) => {
    console.log("We have a new connection!!");
    socket.on("join", ({name, room}, callback) => {
        console.log({name, room});

        const error = false

        // callback function for error handling
        if(error){
            callback({error: "error"});
        }
        
    })
    socket.on('disconnect',() => {
        console.log("User has left!!")
    })
});

app.use(router);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server started on ${PORT}`)
});
