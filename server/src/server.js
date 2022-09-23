
const usersRoute = require('./route/user')
const scoresRoute= require('./route/score')

const express = require("express")
const WebSocket = require('ws')
const cors = require('cors')

const uuid = require('uuid')

class Message {
    constructor(metadata, content) {
        this.sender = "server"
        this.metadata = metadata
        this.content = content

    }
}


function Player(id, socketId){
    this.id = id
    this.socketId = socketId
}




let lobby_list = []

const app = express()
const wsport = process.env.WSPORT || 1234

const port = process.env.PORT || 1235


const wss = new WebSocket.Server({ server: app.listen(wsport)})

var cors_config = {
    origin: "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST"],
    allowedHeaders: ["Authorization", "Content-Type"],
    maxAge: 86400,
    optionsSucessStatus: 200
}

app.use(cors(cors_config))
app.use( '/static', express.static('public'))
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.use('/api/v1', usersRoute)
app.use('/api/v1', scoresRoute)
app.get('/', (req, res) => {
    res.send('welcome to the server bitch')
})

module.exports = app
