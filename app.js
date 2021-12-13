const express = require('express');
const socket = require('socket.io');

const app = express();  // init and server ready
app.use(express.static("public"));

let port = process.env.PORT || 5000;
let server = app.listen(port, function() {
    console.log('asd');
});

let io = socket(server); 

io.on("connection",(socketInstance)=>{
    console.log("Made socket connection");

    //recieved data
    socketInstance.on("beginPath",(data)=>{
        // transfer to other computers
        io.sockets.emit("beginPath",data);  // sent as it is
    })
    socketInstance.on("drawStroke",(data)=>{
        io.sockets.emit("drawStroke",data);  // sent as it is
    })
    socketInstance.on("redoUndo",(data)=>{
        io.sockets.emit("redoUndo",data); // sent as it is
    })
})