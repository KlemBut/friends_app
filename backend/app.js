const express = require('express');
const app = express();
const cors = require('cors');
const http = require('http').createServer(app);
const mongoose = require('mongoose');
const session = require('express-session');
const socketIo = require('socket.io'); 
const io = socketIo(http, {cors: {origin: "http://localhost:3000"}})
require("dotenv").config()

mongoose.connect(process.env.DB_CONNECTION)
.then (res => {
    console.log("connected")
}).catch(e => {
    console.log(e)
});

http.listen(4001)
app.set("socketio", io)
let users = []
io.on("connect", (socket) => {
    socket.on ('disconnect', () => {
        users = users.filter(x => x.id !== socket.id)
    })
    socket.on ("addUser", (user) => {
        const thisUser = {
            id: socket.id,
            name: user
        }
        users.push(thisUser)
    })

    socket.on("like", (likeData) => {
        const{likingUser, likedUser} = likeData
        console.log(likingUser, likedUser)
        const recepient = users.find(x => x.name === likedUser)
        if (!recepient) return 
        const message = `${likingUser} has liked your profile`
        io.to(recepient.id).emit('notification', message)
    })

})

app.use(
    session({
        secret: process.env.SESSION_KEY,
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false}
    })
);

app.use(cors({
    origin: true,
    credentials: true,
    methods: "GET, HEAD, PUT, PATCH, POST, DELETE"
}));

app.use(express.json())

const router = require("./router/mainRouter")
app.use("/", router)