import { Tetrimino, Board, Bag} from "./tetris"
import Renderer from "./graphics"
import Controller2P from "./controller2p"
import Engine from "./engine"
import UI from "./UI"
import * as Peer from "simple-peer"
import Game from "./game"
import { ConfigState } from '@/store/config'
import Message from "./messenger"
import { runInThisContext } from "vm"
import { urlToHttpOptions } from "url"




function drawMap(tileImage: HTMLImageElement) {
}
class Game2P extends Game {
    peer: Peer
    activeTurn: boolean
    isHost: boolean
    role: string
    remotePlayerStateQueue: [y: number, x: number, orientation: number][]

    constructor(config: ConfigState, renderer: Renderer, isHost: boolean){
        super(config, renderer)
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

    public providePeer(peer: Peer) {
        this.peer = peer
    }

    public async run() {

        if(this.isHost){
            this.controller = new Controller2P(this)
            this.controller.initialize()
            this.board = new Board(20, 10)
            this.bag = new Bag()

            this.peer.on("data", data => {
                let dataObj = JSON.parse(data)

                if(dataObj.metadata == "player position"){
                    // if(this.player) this.player.pos = [Math.trunc(dataObj.y), Math.trunc(dataObj.x)]
                    if(this.player) this.remotePlayerStateQueue.push([Math.trunc(dataObj.y), Math.trunc(dataObj.x), Math.trunc(dataObj.orientation)])

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

                    this.bag.queue = (dataObj.bag.split(",")).map(letter => new Tetrimino(letter))
                    this.activeTurn = true
                    this.new = true

                }
            })

            let bag_data: String = (this.bag.queue.map(mino => mino.letter)).join()



            //sending initial gamestate in form of a message, where bag_data contains the initial bag's mino letters in the format X,X,X,X,X,X,X
            let init_gamestate = new Message("host", "initial gamestate", bag_data)

            console.log("sending init gamestate to host!")

            this.peer.send(JSON.stringify(init_gamestate))



            this.player = this.bag.pop()
            await this.renderer.loadSprites()



            const engine = new Engine(this.logic.bind(this))
            engine.start()
        }

        if(!this.isHost){

            this.peer.on("data", data => {
                let dataObj = JSON.parse(data)




                //get initial gamestate and start game
                if(dataObj.metadata == "initial gamestate"){
                    console.log("recieved init gamestate from host!")
                    console.log(dataObj.content)
                    this.controller = new Controller2P(this)
                    this.controller.initialize()
                    this.board = new Board(20, 10)

                    this.bag = new Bag()

                    this.bag.queue = (dataObj.content.split(",")).map(letter => new Tetrimino(letter))

                    this.player = this.bag.pop()
                    this.renderer.loadSprites()
                    const engine = new Engine(this.logic.bind(this))
                    engine.start()
                }

                //recieve player position
                if(dataObj.metadata == "player position"){
                    if(this.player && !this.activeTurn) this.remotePlayerStateQueue.push([Math.trunc(dataObj.y), Math.trunc(dataObj.x), Math.trunc(dataObj.orientation)])
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

                    this.bag.queue = (dataObj.bag.split(",")).map(letter => new Tetrimino(letter))
                    this.activeTurn = true
                    this.new = true
                }





            })
        }

    }

    public logic(clock: {[clk: string]: number}) {


        if(this.activeTurn){
            let player_pos = {
                metadata: "player position",
                x: this.player.pos[1],
                y: this.player.pos[0],
                orientation: this.player.orientation
            }


            this.peer.send(JSON.stringify(player_pos))
        }

        //all clock values come in with 1 frames dt at least


        //if it's a new game or turn, initialize clocks to 0
        if(this.new){
            clock.sd = 0
            clock.grav = 0
            clock.lockDelay = 0
            clock.ar = 0
            clock.dasL = 0
            clock.dasR = 0
            clock.game = 0
            clock.dt = 0
        }
        this.new = false


        //poll controller
        if(this.activeTurn){
            this.controller.poll(this)
        }
        else if(!this.activeTurn){
            if(this.remotePlayerStateQueue.length > 0) {
                let remotePlayerState = this.remotePlayerStateQueue.shift()
                this.player.pos = [remotePlayerState[0], remotePlayerState[1]]
                this.player.orientation = remotePlayerState[2]
                this.player.shape = this.player.rotations[this.player.orientation]

            }
        }


        //check if a piece was placed
        if(this.player.placed == true){
            let placedposx = this.player.pos[1]
            let placedposy = this.player.pos[0]

            this.bag.canHold = true
            this.player = this.bag.pop()


            this.activeTurn = false

            let bag_data: String = (this.bag.queue.map(mino => mino.letter)).join()


            let piece_dropped = {
                metadata: "piece dropped",
                x: placedposx,
                y: placedposy,
                bag: bag_data
            }

            this.peer.send(JSON.stringify(piece_dropped))



        }

        if(this.activeTurn){
            this.controller.countTics(clock, this)

        }

        //render shit
        this.board.render(this.renderer)
        this.player.render("game", this.renderer, this.board)
        this.bag.render(this.renderer, this.board)

        //update UI
        this.UI.updateTimer(clock.game)
        this.UI.updateLinesCleared(this.board.linesCleared)
        this.UI.updateFPS(clock.dt)
        this.UI.updateTurn(this.activeTurn)

        return clock
    }






}

export default Game2P