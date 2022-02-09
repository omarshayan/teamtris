const express = require("express")
const WebSocket = require('ws')
const cors = require('cors')

const uuid = require('uuid')

function Message(metadata, content){
    this.sender = "server"
    this.metadata = metadata
    this.content = content
    
}


let lobby_list = []

const app = express()
const wsport = process.env.PORT || 4000
const port = process.env.PORT || 3000


const wss = new WebSocket.Server({ server: app.listen(wsport)})

var cors_config = {
    origin: "http://localhost:1234",
    optionsSucessStatus: 200
}

app.use(cors(cors_config))
app.use( '/static', express.static('public'))

app.get('/', (req, res) => {
    res.send('welcome to the server bitch')
})



app.get('/api/lobbies', (req, res) => {
    res.send(lobby_list)
})

app.get('/api/lobbies/:code', (req, res) => {
    const lob = lobby_list.find(lob => lob.code == req.params.code);
    if (!lob) res.status(404).send(`lobby with code ${ req.params.code } does not exist`) //404

    res.send(lob)
})

app.listen(port, () => {
    console.log(`running on port ${port}`)
})





wss.on('connection', (socket) => {
    socket.id = uuid.v4();
    console.log('socket connected with id : ' + socket.id)


    //connection is up, let's add a simple simple event
    socket.on('message', (data) => {
        console.log("got a message from a client")
        let message = JSON.parse(data)



        if(message.metadata == "p2p data"){
            console.log("got p2p data")

            //find sender's lobby
            let lobby = lobby_list.find(function(lob){
                console.log("checking a lobby with code " + lob.code)
                return lob.players.includes(socket.id)
            })

            //find remote users' id

            let remote_players = lobby.players.filter(function(playerid){return playerid != socket.id})


            wss.clients.forEach(function each(client) {
                if(remote_players.find(function(playerid){return playerid == client.id})){
                    if (client.readyState === WebSocket.OPEN) {
                        // client.send(data);
                        console.log("msging user with id " +  client.id + " in lobby " + lobby.code )
                        console.log("sending p2p data onwards!" )
                        let remote_p2p_data = new Message("remote p2p data", message.content)
                        client.send(JSON.stringify(remote_p2p_data))
                    }
                }
            });

        }
        else if(message.role === "host"){//handle messages from host

            if(message.metadata == "hello"){
                console.log("message from host")
                let lobby = createLobby(lobby_list, socket.id)
                lobby.players.push(socket.id)
                lobby_list.push(lobby)
    
    
                console.log('created lobby. current lobby list: ')
                console.log(lobby_list)
                let new_lobby_msg = new Message("new lobby", JSON.stringify(lobby))
                socket.send(JSON.stringify(new_lobby_msg))

            }

            if(message.metadata == "start game"){
                
                //find host's lobby
                let lobby = lobby_list.find(function(lob){
                    console.log("checking a lobby with code " + lob.code)
                    return lob.hostsockid == socket.id
                })


                if(lobby){
                    console.log("host requesting gamestart")
                    wss.clients.forEach(function each(client) {
                        console.log("trying to message player with id " + client.id)
                        if(lobby.players.find(function(playerid){return playerid == client.id})){
                            if (client.readyState === WebSocket.OPEN) {
                                // client.send(data);
                                console.log("msging user with id " +  client.id + " in lobby " + lobby.code )
                                console.log("making a message:" )
                                let game_start = new Message("game start", undefined)
                                client.send(JSON.stringify(game_start))
                            }
                        }

        
                    });
                }
            }


        }
        else if(message.role === "guest"){//handle messages from guest
            console.log("message from guest")
            //find lobby to connect to !
            console.log(message)


            if(message.metadata == "add me to lobby"){
                let lobbycode = message.content
                console.log("guest trying to connect to room with code " + lobbycode)
                let lobby = null
                console.log("looking for lobby with code" + lobbycode)
                // lobby = lobby_list.find(lob => {lob.code == lobbycode})
                lobby = lobby_list.find(function(lob){
                    console.log("checking a lobby with code " + lob.code)
                    return lob.code == lobbycode
                })

                console.log("lobbies found:")
                console.log(lobby)

                if(lobby){
                    console.log("this works")
                    //if a lobby with that code exists...

                    //add the guest to it
                    lobby.players.push(socket.id)

                    console.log("lobby players: "  + lobby.players)
                    //then message everyone in the lobby that a guest has connected!
                    wss.clients.forEach(function each(client) {
                        console.log("trying to message player with id " + client.id)
                        if(lobby.players.find(function(playerid){return playerid == client.id})){
                            if (client.readyState === WebSocket.OPEN) {
                                // client.send(data);
                                console.log("msging user with id " +  client.id + " in lobby " + lobby.code )
                                console.log("making a message:" )
                                let lobby_ready = new Message("lobby ready", undefined)
                                client.send(JSON.stringify(lobby_ready))
                            }
                        }

        
                    });

                }
            }


        }

        //handle receipt of p2p data
        //send it to all other users in that lobby


        // wss.clients.forEach(function each(client) {
        //     if (client.readyState === WebSocket.OPEN) {
        //       client.send(data);
        //       lobby_list.push('blah')
        //     }

        // });
    })
    
    socket.on('close', (reason) => {
        console.log("socket closed because " + reason.toString())
        for(let i = 0; i < lobby_list.length; i++){
            console.log(lobby_list[i].hostsockid)
            if(socket.id == lobby_list[i].hostsockid){
                console.log("host closed lobby with code: " + lobby_list[i].code)
                lobby_list.splice(i--, 1);
                console.log('updated lobby list: ')
                console.log(lobby_list)
                
            }
        }
    })

});

wss.on('listening', (socket) => {
    console.log('listener activated)')
})



function createLobby(lobby_list, hostsockid){
    function generateLobbyCode(lobby_list){
        const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
        let codelen = 4
        let code = ""
        let codeTaken = false
        for(let i = 0; i < codelen; i++){
            code = code + alphabet.charAt(Math.trunc(Math.random()*alphabet.length))
        }
        lobby_list.forEach(lob => 
            {if(lob.code === code){
                codeTaken = true;
            }
        })

        if(!codeTaken){
            return code;
        }
        else if(codeTaken){
            return generateLobbyCode(lobbylist)
        }
    }

    
    function Player(id, peersignal){
        this.id = id
        this.peersignal = peersignal
    }

    function Lobby(code, hostsockid){
        this.code = code
        this.hostsockid = hostsockid
        this.players = []
        this.players.push(hostsockid)
        this.gameReady = false
    }

    let lobby = new Lobby(generateLobbyCode(lobby_list), hostsockid)
    return lobby
}
