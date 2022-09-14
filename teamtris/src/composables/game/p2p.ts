
import { Console } from 'console'
import { hostname } from 'os'
import SimplePeer, {SignalData} from 'simple-peer'

import Message from "./messenger"
import Game2P from "./game2p"

import { Ref } from 'vue'
import { GameState } from '@/store/game'
import { Store } from 'vuex'
import { useStore, State }  from '@/store/store'

// TODO: renmae this to websocketConnection (which is repsonsible for setting up P2P)
export default class P2P {

    game: Game2P
    isHost: boolean
    peer: SimplePeer.Instance | null
    socket: WebSocket | null
    wssUrl: string
    onConnect: (game: Game2P) => void
    connectCode: Ref<string | undefined>
    store: Store<State>

    constructor(isHost: boolean, game: Game2P, onConnect: (game: Game2P) => void, connectCode: Ref<string | undefined>) {
        this.game = game
        this.isHost = isHost
        this.onConnect = onConnect
        this.wssUrl = import.meta.env.VITE_WEBSOCKET_SERVER_URL
        this.peer = null
        this.socket = null
        this.connectCode = connectCode
        this.store = useStore()
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
            let peer = new SimplePeer({trickle: false})
            this.peer = peer
            
            console.log('connectcode: ', connectCode)
            if(!connectCode) {
                console.error('guest is missing connect code')
            }
            await this.Guest(peer, game, onConnect, connectCode!)
    
        }
    }

    public handleSocketMessage = async (event: any) => {

        let msgblob = event.data
        const msgstring = await(new Response(msgblob)).text()
        const message = JSON.parse(msgstring)
        console.log('message from server: ')
        console.log(message)



        if (message.metadata == "lobby info"){
            let lobby = JSON.parse(message.content)
            console.log('lobby code ' ,lobby.code)
            console.log( lobby.code )
            this.connectCode!.value = lobby.code
            console.log("this connectcode value ", this.connectCode!.value)
        }

        if (message.metadata == "lobby ready"){
            let peer = new SimplePeer({initiator: true, trickle: false})
            this.peer = peer
            console.log("LOBBY READY TO START!")

            console.log("lobby: ", message.content)

            this.store.commit('updatePlayerList', message.content)
            this.peer.on('signal', (data: string | undefined) => {
                console.log('signalling!')
                const P2Pdata = new Message("host", "p2p data", data)
                console.log("sending hostdata to server: ")
                this.socket!.send(JSON.stringify(P2Pdata))
            })
        }

        if (message.metadata == 'remote p2p data'){
            let msgblob = event.data
            const msgstring = await(new Response(msgblob)).text()
            const message = JSON.parse(msgstring)
            console.log('message from server: ')
            console.log(message)
            console.log('peer: ', this.peer)
            this.peer!.signal(message.content)
            console.log('signalled ...')
            this.peer!.on('connect', () => {
                console.log("connected")
                this.game.providePeer(this.peer!)
                this.onConnect(this.game)
            })
        }

    }

    public async initiateP2P(game: Game2P): Promise<void>{
        console.log("LOBBY READY TO START!")
        console.log( "A player has joined the lobbert. \nInitiating P2P...")

        console.log(this.peer)
        this.peer!.on('signal', (data: string | undefined) => {
            console.log('signalling!')
            const P2Pdata = new Message("host", "p2p data", data)
            console.log("sending hostdata to server: ")
            this.socket!.send(JSON.stringify(P2Pdata))
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
            this.socket!.send(JSON.stringify(message))
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
                game.providePeer(peer)
                game.waitForStart()
                onConnect(game)

            }
    
        }
    
    }
    
}

