require('dotenv').config()
require('./database/conection')

const PORT = process.env.PORT || 5566

const express = require('express')
const session = require('express-session')
const app = express()
const cors = require('cors')
const http = require('http').Server(app)
const bodyParser = require('body-parser')
const flash = require('express-flash')
const path = require('path')

const User = require('./models/userModel')
const Chat = require('./models/chatModel')

const userController = require('./controller/userController')
const chatController = require('./controller/chatController')

app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {maxAge: 3600000}
}))

app.use(flash())

app.use(express.static('public'))
app.use('/src', express.static(__dirname + 'public/src'))
app.set('views', path.join(__dirname + '/views'))
app.set('view engine', 'ejs')

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

app.use(cors())

app.use("/", userController)
app.use("/", chatController)

app.get('/home', (req, res) => {
    res.render('home')
})

const io = require('socket.io')(http)

io.on('connection', async (socket)=>{
    console.log("New Connection")

    var userId = socket.handshake.auth.token

    await User.findByIdAndUpdate({ _id: userId }, {$set: { is_online: '1' }})
    socket.broadcast.emit('getOnlineUser', {user_id: userId})

    socket.on('disconnect', async () => {
        console.log("User Disconected")
        await User.findByIdAndUpdate({ _id: userId }, {$set: { is_online: '0' }})
        socket.broadcast.emit('getOfflineUser', {user_id: userId})
    })

    socket.on('newChat', function(data){
        socket.broadcast.emit('loadNewChat', data)
    })

    socket.on('existsChat', async function(data){
        var chat = await Chat.find({ $or: [
            {send_id: data.send_id, receive_id: data.receive_id},
            {send_id: data.receive_id, receive_id: data.send_id}
        ]})

        socket.emit('oldChat', {chat: chat})
    })

    /* socket.on('notification', function(data){
        console.log(data)
    }) */

})


http.listen(PORT, () => {
    console.log('Server is Running: ' + PORT)
})