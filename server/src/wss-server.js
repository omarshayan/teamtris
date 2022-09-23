
app.get('/api/v1/lobbies', (req, res) => {
    res.send(lobby_list)
})

app.get('/api/v1/lobbies/:code', (req, res) => {
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
                return lob.players.map((player) => player.socketId).includes(socket.id)
            })

            //find remote users' id

            let remote_players = lobby.players.filter(function(player){return player.socketId != socket.id})


            wss.clients.forEach(function each(client) {
                if(remote_players.find(function(player){return player.socketId == client.id})){
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
                let hostId = message.content
                lobby.players.push(new Player(hostId, socket.id))
                lobby_list.push(lobby)


                console.log('created lobby. current lobby list: ')
                console.log(lobby_list)
                let new_lobby_msg = new Message("lobby info", JSON.stringify(lobby))
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
                        if(lobby.players.find(function(player){return player.socketId == client.id})){
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
                let lobbycode = message.content.connectCode
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
                    //if a lobby with that code exists...

                    //add the guest to it
                    lobby.players.push(new Player(message.content.id, socket.id))

                    console.log("lobby players: "  + lobby.players)
                    //then message everyone in the lobby that a guest has connected!
                    wss.clients.forEach(function each(client) {
                        console.log("trying to message player with id " + client.id)
                        if(lobby.players.find(function(player){return player.socketId == client.id})){
                            if (client.readyState === WebSocket.OPEN) {
                                // client.send(data);
                                console.log("msging user with id " +  client.id + " in lobby " + lobby.code )
                                console.log("making a message:" )
                                let lobby_ready = new Message("lobby ready", lobby)
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

        //find sender's lobby
        let lobby = lobby_list.find(function(lob){
            console.log("checking a lobby with code " + lob.code)
            return lob.players.map((player) => player.socketId).includes(socket.id)
        })

        // remove sender from lobby
        lobby.players = lobby.players.filter((player) => player.socketId != socket.id)

        console.log("socket closed because " + reason.toString())

        //then message everyone in the lobby that a guest has connected!
        wss.clients.forEach(function each(client) {
            console.log("trying to message player with id " + client.id)
            if(lobby.players.find(function(player){return player.socketId == client.id})){
                if (client.readyState === WebSocket.OPEN) {
                    // client.send(data);
                    console.log("msging user with id " +  client.id + " in lobby " + lobby.code )
                    console.log("making a message:" )
                    let lobby_ready = new Message("lobby info", lobby)
                    client.send(JSON.stringify(lobby_ready))
                }
            }



        });

    })
})


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


    function Lobby(code, hostsockid){
        this.code = code
        this.hostsockid = hostsockid
        this.players = []
        this.gameReady = false
    }

    let lobby = new Lobby(generateLobbyCode(lobby_list), hostsockid)
    return lobby
}
