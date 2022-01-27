const express = require("express");
const dotenv = require("dotenv");
dotenv.config({path: "../.env"});
// const database = require("../database/database");

const session = require("express-session");
const app = express();
const http = require("http").Server(app);

//socket para comunicar paginas
const io = require("socket.io")(http);

//encode URL
app.use(express.urlencoded({extended: false}));
// app.use(express.urlencoded());
app.use(express.json());

app.set('view engine', 'ejs');
app.set("views", __dirname + "\\public/");

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

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
