const express = require("express");
const app = express();

const http = require("http").Server(app);


//socket para comunicar paginas
const io = require("socket.io")(http);

//rutas
app.use(require("./routes/soproject.routes"));

app.use(express.static(__dirname + "/public"));

io.on("connection", (socket) => {
    socket.on("stream", (image) => {
        //emision de imagenes
        socket.broadcast.emit("stream", image);
    })
});

module.exports = http;
