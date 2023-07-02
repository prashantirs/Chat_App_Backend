const http = require('http');
const express = require('express');
const cors = require('cors');
const socketIo = require('socket.io');

const port = process.env.PORT || 4500;
const app = express();
app.use(cors());

const server = http.createServer(app);
const io = socketIo(server);
const users = [{}]

io.on('connection', (socket ) => {
    console.log('New client connected');
    
    //time
    const dateString = socket.handshake.time;
    const date = new Date(dateString);
    const options = { hour: '2-digit', minute: '2-digit', hour12: true };
    const time = date.toLocaleTimeString([], options);

    socket.on('joined',({name})=>{
        users[socket.id] = name;
        // socket.emit('welcome',{message:`${name} Welcome to the chat at ${time}`});
        socket.emit('welcome',{user: "Welcome",text:`${name} Welcome! to the chat`,id:socket.id});
        // socket.broadcast.emit('newUser',{message:`${name} joined the chat at ${time}`});
        socket.broadcast.emit('newUser',{user: 'Admin',text:`${name} joined the chat`,id:socket.id});
    })

    socket.on('disconnect', () => {
        console.log(`${users[socket.id]} left`);
        // socket.broadcast.emit('userLeft',{message:`${users[socket.id]} left the chat at ${time}`});
        socket.broadcast.emit('userLeft',{user: "Admin",text:`${users[socket.id]} left the chat`,id:socket.id});
        
    });

    socket.on('message',({text , id})=>{
        io.emit('sendMessage',{user: users[id],text,id});
    })
});

app.get('/', (req, res) => {
    res.send('Hello World!');
});

server.listen(port, () => {
    console.log(`Server is running on  http://localhost:${port}`);
});