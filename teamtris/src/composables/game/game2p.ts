import { Ref } from 'vue'

import { Tetrimino, Board, Bag} from "./tetris"
import Renderer from "./graphics"
import Controller2P from "./controller2p"
import Engine from "./engine"
import UI from "./UI"
import SimplePeer from 'simple-peer'
import Game from "./game"
import { ConfigState } from '@/store/config'
import Message from "./messenger"
import Clock from './types/clock'
import { Console } from 'console'


const constants = {
    remotePlayerStateQueueSize: 5
}
function drawMap(tileImage: HTMLImageElement) {
}
class Game2P extends Game {
    peer: SimplePeer.Instance
    activeTurn: boolean
    isHost: boolean
    role: string
    remotePlayerStateQueue: [y: number, x: number, orientation: number][]

    constructor(timer: Ref<number | undefined>, lineCounter: Ref<number | undefined>, config: ConfigState, renderer: Renderer, isHost: boolean){
        super(timer, lineCounter, config, renderer)
        if(isHost){
            this.activeTurn = true
            this.role = "host"
        }
        else if(!isHost){
            this.activeTurn = false
            this.role = "guest"
        }
        this.isHost = isHost
        this.remotePlayerStateQueue = []

    }

    public initializeEngine(): void {
        this.engine = new Engine(this.logic2P.bind(this))
    }

    public providePeer(peer: SimplePeer.Instance) {
        this.peer = peer
    }

    public async start() {

        if(this.isHost){
            this.controller = new Controller2P(this)
            this.controller.initialize()
            this.board = new Board(23, 10)
            this.bag = new Bag()

            await this.waitForStart()

            let bag_data: string = (this.bag.queue.map(mino => mino.letter)).join()



            //sending initial gamestate in form of a message, where bag_data contains the initial bag's mino letters in the format X,X,X,X,X,X,X
            let init_gamestate = new Message("host", "initial gamestate", bag_data)

            console.log("sending init gamestate to host!")

            this.peer.send(JSON.stringify(init_gamestate))



            this.player = this.bag.pop()


            this.engine.start()
        }

    }
    public waitForStart= async () => {

            await this.renderer.loadSprites()
             this.peer.on("data", data => {
                let dataObj = JSON.parse(data)




                //get initial gamestate and start game
                if(dataObj.metadata == "initial gamestate"){
                    console.log("recieved init gamestate from host!")
                    console.log(dataObj.content)
                    this.controller = new Controller2P(this)
                    this.controller.initialize()
                    this.board = new Board(23, 10)

                    this.bag = new Bag()

                    this.bag.queue = (dataObj.content.split(",")).map(letter => new Tetrimino(letter))

                    this.player = this.bag.pop()
                    this.engine.start()
                }

                //recieve player position
                if(dataObj.metadata == "player position"){
                    // console.log('recieved player pos: ' ,dataObj.y)
                    // console.log('math trunc: ', Math.trunc(dataObj.y))
                    if(this.player && !this.activeTurn) {
                        this.remotePlayerStateQueue.push([Math.trunc(dataObj.y), Math.trunc(dataObj.x), Math.trunc(dataObj.orientation)])
                    }
                }

                //recieve player piece drop signal
                if(dataObj.metadata == "piece dropped"){
                    console.log("piecee dropped")
                    this.remotePlayerStateQueue = []
                    if(this.player && !this.activeTurn) {
                        this.player.pos = [Math.trunc(dataObj.y), Math.trunc(dataObj.x)]
                        this.player.orientation = Math.trunc(dataObj.orientation)
                    }
                    this.player.place(this.board)

                    this.bag.canHold = true
                    this.player = this.bag.pop()
                    
                    console.log('recieved bag:  ', data.bag)
                    this.bag.queue = (dataObj.bag.split(",")).map(letter => new Tetrimino(letter))
                    this.activeTurn = true

                }





            })
        }

    public logic2P(clock: Clock) {

        const newClock: Clock = this.logic(clock)
        console.log("turn: " , this.activeTurn , '\t new? : ', this.new)
        if(this.activeTurn && !this.new){
            let player_pos = {
                metadata: "player position",
                x: this.player.pos[1],
                y: this.player.pos[0],
                orientation: this.player.orientation
            }
            console.log('sending pos ', player_pos)
            this.peer.send(JSON.stringify(player_pos))
        }
        if(!this.new && !this.activeTurn){
            if(this.remotePlayerStateQueue.length > 0) {
                this.remotePlayerStateQueue = this.remotePlayerStateQueue.slice(0, 10)
                console.log('remotePlayerStateQueue: ', this.remotePlayerStateQueue)
                let remotePlayerState = this.remotePlayerStateQueue.shift()
                // console.log('setting position from remote', remotePlayerState)
                this.player.pos = [remotePlayerState[0], remotePlayerState[1]]
                this.player.orientation = remotePlayerState[2]
                this.player.shape = this.player.rotations[this.player.orientation]

            }
        }

        //check if a piece was placed
        if(this.player.placed == true){
            let placedposx = this.player.pos[1]
            let placedposy = this.player.pos[0]

            console.log('piece placed at ', placedposy, ', ', placedposx)
            this.activeTurn = false

            let bag_data: String = (this.bag.queue.map(mino => mino.letter)).join()


            let piece_dropped = {
                metadata: "piece dropped",
                x: placedposx,
                y: placedposy,
                bag: bag_data
            }

            console.log('bag: ', bag_data)

            this.peer.send(JSON.stringify(piece_dropped))
        }

        return newClock
    }






}

export default Game2P