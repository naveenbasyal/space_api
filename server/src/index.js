const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, { cors: { origin: "*" }});
const userRoutes = require('../routes/user')
const bodyParser = require('body-parser')
const socket = require('socket.io');
//const socket = require("socket.io-client")("http://localhost:4000");
var player = require('play-sound')(opts = {})
const formatMessage = require('../utils/formatMessage');
const path = require('path');

app.use(bodyParser.json())
app.use(
    bodyParser.urlencoded({
        extended: true
    })
);

// app.use('/', userRoutes);

app.get('/', (req, res) => {
    //remove .. when deploying and add when on localhost
    const clientPath = path.resolve('../../client/src/index.html');
    console.log(clientPath);
    res.sendFile(clientPath)
})

/*
delete this when everything's fine shifted this line at 40

socket.on("connect_error", (err) => {
    console.log(err.message);
});
*/

//socket.io listening for connections events
io.on("connection", (socket) => {

    //if any error occurs on connection
    socket.on("connect_error", (err) => {
        console.log(err.message);
    });

    const userId = socket.id;
    console.log('userID: ' + userId);

    socket.broadcast.emit('message', formatMessage('newUser', 'a new user has joined the chat'));
    
    socket.on('disconnect', () => {
        io.emit('message', formatMessage('human', 'a user left the chatroom'));
    });
    
    //catching the chatMessage coming from client input
    socket.on('sendChatMessage', (message) => {
        console.log("received from client: " + message);
        
        //sending chatMessage back to client after receiving on server
        io.emit('message', formatMessage('chatbot', message));

        //playing notification sound
        player.play('../audio/hnm.mp3', (err) => {
            if(err) {
                throw err;
            }
        });
    });
})

server.listen(process.env.PORT || 4000, () => {
    console.log(`Server's up & running on http://localhost:4000/`)
})