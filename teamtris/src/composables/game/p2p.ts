
import { Console } from 'console'
import { hostname } from 'os'
import SimplePeer, {SignalData} from 'simple-peer'

import wsAPIMessage, {wsMessage} from "./messenger"
import Game2P from "./game2p"

import { Ref } from 'vue'
import { GameState } from '@/store/game'
import { Store } from 'vuex'
import { useStore, State }  from '@/store/store'
import { connect } from 'http2'

// TODO: renmae this to websocketConnection (which is repsonsible for setting up WebsocketConnection)

export default class WebsocketConnection{

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

    public async connect(): Promise<WebSocket> {
        console.log(this.wssUrl)
        console.log(typeof this.wssUrl)
        var socket = new WebSocket(this.wssUrl)
        socket.addEventListener("error", e => {
            console.log("encountered error: /n", e)
            setTimeout(() => this.connect())
        })
        this.socket = socket
        return socket
    }
        
    public async setup(isHost: boolean, game: Game2P, onConnect: (game: Game2P) => void, connectCode?: string) {
    
        //chat
    
        if(isHost){

            await this.Host(game, onConnect)
        }
    
        if(!isHost){
            let peer = new SimplePeer({trickle: false})
            this.peer = peer
            
            console.log('connectcode: ', connectCode)
            this.connectCode.value = connectCode
            if(!connectCode) {
                console.error('guest is missing connect code')

            }
            await this.Guest(peer, game, onConnect, connectCode!)
    
        }
    }


    public handleSocketMessage = async (event: any) => {

        console.log('event: ', event)
        const message = JSON.parse(event.data)
        console.log('message from server: ')
        console.log(message)

        let updateLobbyInfo = (message: wsMessage) => {
       
            let lobby = JSON.parse(message.data)
            console.log('lobby code ' ,lobby.code)
            console.log( lobby.code )
            this.connectCode!.value = lobby.code
            console.log("this connectcode value ", this.connectCode!.value)
            
            if(lobby.players){
                this.store.commit('setPlayerIds', {hostId: lobby.hostId, guestId: lobby.guestId})
            }
        }

        if (message.metadata == "lobby info"){
            updateLobbyInfo(message)
        }

        if (message.metadata == "lobby ready"){

            updateLobbyInfo(message)


            let peer = new SimplePeer({initiator: true, trickle: false})
            this.peer = peer
            console.log("LOBBY READY TO START!")



            this.peer.on('signal', (data: string | undefined) => {
                console.log('signalling!')
                const signalMessage = new wsMessage("remote p2p data", data)
                const P2Pdata = new wsAPIMessage("sendlobbymessage", signalMessage)
                console.log("sending hostdata to server: ")
                this.socket!.send(JSON.stringify(P2Pdata))
            })
        }

        if (message.metadata == 'remote p2p data'){
            console.log('message from server: ')
            console.log(message)
            console.log('peer: ', this.peer)
            this.peer!.signal(message.data)
            console.log('signalled ...')
            this.peer!.on('connect', () => {
                console.log("connected")
                this.game.providePeer(this.peer!)
                this.onConnect(this.game)
            })
        }

    }

    public handleSocketMessageGuest = async (event: any) => {

        console.log('event: ', event)
        const message = JSON.parse(event.data)
        console.log('message from server: ')
        console.log(message)

        if (message.metadata == "lobby info"){
        
            let lobby = JSON.parse(message.data)
            console.log('lobby code ' ,lobby.code)
            console.log( lobby.code )
            this.connectCode!.value = lobby.code
            console.log("this connectcode value ", this.connectCode!.value)
            
            if(lobby.players){
                this.store.commit('setPlayerIds', {hostId: lobby.hostId, guestId: lobby.guestId})
            }

        }
        if(message.metadata == "game start"){
            console.log(" starting game...")
        }

        if(message.metadata == "remote p2p data"){
            console.log("got remote p2p data!")
            console.log(message.metadata)
            this.peer!.signal(message.data)
            this.peer!.on('signal', (data: string | undefined) => {
                
                const signalMessage = new wsMessage("remote p2p data", data)
                const P2Pdata = new wsAPIMessage("sendlobbymessage", signalMessage)
                console.log("sending guestdata to server: ")
                this.socket!.send(JSON.stringify(P2Pdata));


            })
            this.game.providePeer(this.peer!)
            this.game.waitForStart()
            this.onConnect(this.game)

        }
    }

    public async initiateWebsocketConnection(game: Game2P): Promise<void>{
        console.log("LOBBY READY TO START!")
        console.log( "A player has joined the lobbert. \nInitiating WebsocketConnection...")

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

        const userId = this.store.state.user.data? this.store.state.user.data.id : null;
            
        this.socket!.onopen = (event) => {
            console.log('socket opened from host!')
            // let message = {
            //     sender: "null",
            //     role: "host",
            //     content: "hello"
            // }
            let message = new wsAPIMessage("createlobby")
            this.socket!.send(JSON.stringify(message))
        }
    
        this.socket!.onmessage = this.handleSocketMessage
    }
    
     async Guest(peer: SimplePeer.Instance, game: Game2P, onConnect: (game: Game2P) => void, connectCode: string): Promise<void> {
    
        const id = this.store.state.user.data?.id;

        this.socket!.onopen = (event) => {
            console.log('socket opened from guest!')
            // let message = {
            //     sender: "null",
            //     role: "guest",
            //     content: "add me to the lobby",
            //     code: connect_code
            // }

            let message = new wsAPIMessage("joinlobby", undefined, connectCode)
            this.socket!.send(JSON.stringify(message))
        }
    
        this.socket!.onmessage = this.handleSocketMessageGuest
    
    }
    
}

