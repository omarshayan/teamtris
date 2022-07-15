
import { Console } from 'console'
import { hostname } from 'os'
import Peer from 'simple-peer'
import wrtc from 'wrtc'

import Message from "./messenger"
import Game2P from "./game2p"

import Manip_DOM from "./2p_dom"
import gamePreviewRenderer from '../gamePreviewRenderer'

export default class P2P {

    game: Game2P
    isHost: boolean
    wssUrl: string
    onConnect: (game: Game2P) => void

    constructor(isHost: boolean, game: Game2P,  onConnect: (game: Game2P) => void) {
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
            this.Host(game, onConnect)
        }
    
        if(!isHost){
            console.log('connectcode: ', connectCode)
            if(!connectCode) {
                console.error('guest is missing connect code')
            }
            this.Guest(game, onConnect, connectCode!)
    
        }
    }


    public async Host(game: Game2P, onConnect: (game: Game2P) => void): Peer {
        
        console.log(import.meta.env) 
        console.log(import.meta.env.VITE_WEBSOCKET_SERVER_URL) 
        var socket = await this.connect2socket()

        var host_peer = new Peer({initiator: true})
    
        function InitiateP2P(host_peer: Peer){
            console.log("Initiating P2P")
            console.log(host_peer)

            host_peer.on('signal', (data: string | undefined) => {
                console.log('signalling!')
                const P2Pdata = new Message("host", "p2p data", data)
                console.log("sending hostdata to server: ")
                socket.send(JSON.stringify(P2Pdata))
            })
    
            host_peer.on('connect', () => {
                console.log("connected")
                host_peer.send("hey whats up guest dude, guess we're connected huh")
                game.providePeer(host_peer)
                onConnect(game)
            })
    
            socket.onmessage = async function( event) {
                let msgblob = event.data
                const msgstring = await(new Response(msgblob)).text()
                const message = JSON.parse(msgstring)
                console.log('message from server: ')
                console.log(message)
                if(message.metadata == "remote p2p data"){
                    console.log("got remote p2p data!")
    
                    host_peer.signal(message.content)
                }
            }
    
        }
        socket.onopen = function (event) {
            console.log('socket opened from host!')
            // let message = {
            //     sender: "null",
            //     role: "host",
            //     content: "hello"
            // }
            let message = new Message("host", "hello")
            socket.send(JSON.stringify(message))
        }
    
        socket.onmessage = async function( event) {
            let msgblob = event.data
            const msgstring = await(new Response(msgblob)).text()
            const message = JSON.parse(msgstring)
            console.log('message from server: ')
            console.log(message)
    
    
    
            if(message.metadata == "new lobby"){
                let lobby = JSON.parse(message.content)
                let lobby_code_el = document.getElementById("lobby code")
                console.log('lobby code ' ,lobby.code)
                console.log( lobby.code )
    
            }
    
            if(message.metadata == "lobby ready"){
                let player_list_el = document.getElementById("player list")
                console.log("LOBBY READY TO START!")
                console.log( "A player has joined the lobbert. \nInitiating P2P...")
    
                InitiateP2P(host_peer)
            }
        }
    
        return host_peer
    }
    
     async Guest(game: Game2P, onConnect: (game: Game2P) => void, connectCode: string): Peer {
    
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
                let guest_peer = await new Peer({wrtc: wrtc})
    
                guest_peer.signal(message.content)
                guest_peer.on('signal', (data: string | undefined) => {
                    const P2Pdata = new Message("guest", "p2p data", data)
                    console.log("sending guestdata to server: ")
                    socket.send(JSON.stringify(P2Pdata));
    
    
                })
                guest_peer.on('data', (data: any) => {
                    game.providePeer(guest_peer)
                    onConnect(game)
    
                })
    
            }
    
        }
    
    
    
    }
    
}

