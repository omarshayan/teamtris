
import { Console } from 'console'
import { hostname } from 'os'
import SimplePeer from 'simple-peer'
import wrtc from 'wrtc'

import Message from "./messenger"
import Game2P from "./game2p"

import { GameState } from '@/store/game'

export default class P2P {

    game: Game2P
    isHost: boolean
    peer: SimplePeer.Instance
    socket: WebSocket
    wssUrl: string
    onConnect: (game: Game2P) => void

    constructor(isHost: boolean, game: Game2P, onConnect: (game: Game2P) => void) {
        this.game = game
        this.isHost = isHost
        this.onConnect = onConnect
        this.wssUrl = import.meta.env.VITE_WEBSOCKET_SERVER_URL
    }

    private connect2socket(): WebSocket {
        console.log(this.wssUrl)
        console.log(typeof this.wssUrl)
        var socket = new WebSocket(this.wssUrl)
        socket.addEventListener("error", e => {
            console.log("encountered error: /n", e)
            setTimeout(() => this.connect2socket())
        })
        return socket
    }
        
    public async setup(isHost: boolean, game: Game2P, onConnect: (game: Game2P) => void, connectCode?: string){
    
        //chat
    
        if(isHost){

            await this.Host(game, onConnect)
        }
    
        if(!isHost){
            let peer = new SimplePeer({wrtc: wrtc, trickle: false})
            this.peer = peer
            console.log('connectcode: ', connectCode)
            if(!connectCode) {
                console.error('guest is missing connect code')
            }
            await this.Guest(peer, game, onConnect, connectCode!)
    
        }
    }

    public handleSocketMessage = async (event) => {

        let msgblob = event.data
        const msgstring = await(new Response(msgblob)).text()
        const message = JSON.parse(msgstring)
        console.log('message from server: ')
        console.log(message)



        if(message.metadata == "new lobby"){
            let lobby = JSON.parse(message.content)
            console.log('lobby code ' ,lobby.code)
            console.log( lobby.code )

        }

        if(message.metadata == "lobby ready"){
            let peer = new SimplePeer({initiator: true, trickle: false, wrtc: wrtc})
            this.peer = peer
            console.log("LOBBY READY TO START!")
            console.log( "A player has joined the lobbert. \nInitiating P2P...")
    
            console.log(this.peer)
            this.peer.on('signal', (data: string | undefined) => {
                console.log('signalling!')
                const P2Pdata = new Message("host", "p2p data", data)
                console.log("sending hostdata to server: ")
                this.socket.send(JSON.stringify(P2Pdata))
            })
        }

        if(message.metadata == 'remote p2p data'){
            let msgblob = event.data
            const msgstring = await(new Response(msgblob)).text()
            const message = JSON.parse(msgstring)
            console.log('message from server: ')
            console.log(message)
            console.log('peer: ', this.peer)
            this.peer.signal(message.content)
            console.log('signalled ...')
            this.peer.on('connect', () => {
                console.log("connected")
                this.peer.send("hey whats up guest dude, guess we're connected huh")
                this.game.providePeer(this.peer)
                this.onConnect(this.game)
            })
        }

    }

    public async initiateP2P(game: Game2P): Promise<void>{
        console.log("LOBBY READY TO START!")
        console.log( "A player has joined the lobbert. \nInitiating P2P...")

        console.log(this.peer)
        this.peer.on('signal', (data: string | undefined) => {
            console.log('signalling!')
            const P2Pdata = new Message("host", "p2p data", data)
            console.log("sending hostdata to server: ")
            this.socket.send(JSON.stringify(P2Pdata))
        })

    }
    public async Host(game: Game2P, onConnect: (game: Game2P) => void): Promise<void> {
        
        console.log(import.meta.env) 
        console.log(import.meta.env.VITE_WEBSOCKET_SERVER_URL) 
        this.socket = this.connect2socket()



            
        this.socket.onopen = (event) => {
            console.log('socket opened from host!')
            // let message = {
            //     sender: "null",
            //     role: "host",
            //     content: "hello"
            // }
            let message = new Message("host", "hello")
            this.socket.send(JSON.stringify(message))
        }
    
        this.socket.onmessage = this.handleSocketMessage
    }
    
     async Guest(peer: SimplePeer.Instance, game: Game2P, onConnect: (game: Game2P) => void, connectCode: string): Promise<void> {
    
        var socket = await this.connect2socket()
    

        socket.onopen = function (event) {
            console.log('socket opened from guest!')
            // let message = {
            //     sender: "null",
            //     role: "guest",
            //     content: "add me to the lobby",
            //     code: connect_code
            // }
    
            let message = new Message("guest", "add me to lobby", connectCode)
            socket.send(JSON.stringify(message))
        }
    
        socket.onmessage = async function( event) {
    

            let msgblob = event.data
            const msgstring = await(new Response(msgblob)).text()
            const message = JSON.parse(msgstring)
            console.log('message from server: ')
            console.log(message)
    
            if(message.metadata == "lobby ready"){
                console.log("LOBBY READY TO START!")
            }
    
            if(message.metadata == "game start"){
                console.log(" starting game...")
            }
    
            if(message.metadata == "remote p2p data"){
                console.log("got remote p2p data!")
                console.log(message.content)
                peer.signal(message.content)
                peer.on('signal', (data: string | undefined) => {
                    const P2Pdata = new Message("guest", "p2p data", data)
                    console.log("sending guestdata to server: ")
                    socket.send(JSON.stringify(P2Pdata));
    
    
                })
                peer.on('data', (data: any) => {
                    game.providePeer(peer)
                    onConnect(game)
    
                })
    
            }
    
        }
    
    }
    
}

