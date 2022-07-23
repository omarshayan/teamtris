import { Ref } from 'vue'

import { Tetrimino, Board, Bag} from "./tetris"
import Renderer from "./graphics"
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

class Game2P extends Game {
    peer: SimplePeer.Instance | null
    isHost: boolean
    role: string
    remotePlayerStateQueue: [y: number, x: number, orientation: number][]

    constructor(timer: Ref<number | undefined>, lineCounter: Ref<number | undefined>, config: ConfigState, renderer: Renderer, isHost: boolean){
        super(timer, lineCounter, config, renderer)
        this.solo = false
        if(isHost){
            this.activeTurn = true
            this.role = "host"
        }
        else if(!isHost){
            this.activeTurn = false
            this.role = "guest"
        }
        else { this.role = ""}
        this.isHost = isHost
        this.remotePlayerStateQueue = []
        this.peer = null
    }

    public initializeEngine(): void {
        this.engine = new Engine(this.logic2P.bind(this))
    }

    public providePeer(peer: SimplePeer.Instance) {
        this.peer = peer
    }

    public async start() {

        if(this.isHost){
            this.board = new Board(23, 10)
            this.bag = new Bag()

            await this.waitForStart()

            let bag_data: string = (this.bag.queue.map(mino => mino.letter)).join()



            //sending initial gamestate in form of a message, where bag_data contains the initial bag's mino letters in the format X,X,X,X,X,X,X
            let init_gamestate = new Message("host", "initial gamestate", bag_data)

            console.log("sending init gamestate to host!")

            this.peer!.send(JSON.stringify(init_gamestate))



            this.player = this.bag.pop()


            this.engine.start()
        }

    }
    public waitForStart= async () => {

            await this.renderer.loadSprites()
             this.peer!.on("data", data => {
                let datastr = data.toString()
                // console.log('data recieved: ', data.toString())
                let dataObj = JSON.parse(data)




                //get initial gamestate and start game
                if(dataObj.metadata == "initial gamestate"){
                    console.log("recieved init gamestate from host!")
                    console.log(dataObj.content)
                    this.board = new Board(23, 10)

                    this.bag = new Bag()

                    this.bag.queue = (dataObj.content.split(",")).map((letter: string) => new Tetrimino(letter))

                    this.player = this.bag.pop()
                    this.engine.start()
                }

                //recieve player position
                if(dataObj.metadata == "player position"){
                    // console.log('recieved player pos: ' ,dataObj.y)
                    // console.log('math trunc: ', Math.trunc(dataObj.y))
                    if(this.player && !this.activeTurn) {
                        this.remotePlayerStateQueue.push([Math.trunc(parseInt(dataObj.y)), Math.trunc(parseInt(dataObj.x)), Math.trunc(parseInt(dataObj.orientation))])
                    }
                }

                //recieve player piece drop signal
                if(dataObj.metadata == "piece dropped"){
                    console.log("piecee dropped")
                    this.remotePlayerStateQueue = []
                    if(this.player && !this.activeTurn) {
                        let pos: [number, number] = [Math.trunc(dataObj.y), Math.trunc(dataObj.x)]
                        let orientation = Math.trunc(dataObj.orientation)
                        if(!this.player.placed){

                        this.player.place(this.board, pos, orientation)
                        }

                        this.bag.canHold = true
                        this.player = this.bag.pop()
                        
                        console.log('recieved bag:  ', dataObj.bag)
                        this.bag.queue = (dataObj.bag.split(",")).map( (letter: string) => new Tetrimino(String(letter)))
                    }
                    this.activeTurn = true

                }





            })
        }

    public logic2P(clock: Clock) {

        //check if a piece was placed
        if(this.player.placed == true && this.activeTurn){
            let placedposx = this.player.placedAt![1] 
            let placedposy = this.player.placedAt![0] 

            console.log('piece placed at ', placedposy, ', ', placedposx)
            this.activeTurn = false

            this.bag.canHold = true
            this.player = this.bag.pop()

            let bag_data: String = (this.bag.queue.map(mino => mino.letter)).join()


            let piece_dropped = {
                metadata: "piece dropped",
                x: placedposx,
                y: placedposy,
                bag: bag_data
            }

            console.log('bag: ', bag_data)

            this.peer!.send(JSON.stringify(piece_dropped))
        }
        const newClock: Clock = this.logic(clock)
        if (!this.activeTurn) {
            Object.values(newClock).forEach((val) => val = 0)
            newClock.sd           = 0
            newClock.grav         = 0
            newClock.lockDelay    = 0
            newClock.ar           = 0
            newClock.dasL         = 0
            newClock.dasR         = 0
            newClock.game         = 0
            newClock.countdown    = 0
            newClock.dt           = 0
        }
        // console.log("turn: " , this.activeTurn , '\t new? : ', this.new)
        if(this.activeTurn && !this.new){
            let player_pos = {
                metadata: "player position",
                x: this.player.pos[1],
                y: this.player.pos[0],
                orientation: this.player.orientation
            }
            // console.log('sending pos ', player_pos)
            this.peer!.send(JSON.stringify(player_pos))
        }
        if(!this.new && !this.activeTurn){
            if(this.remotePlayerStateQueue.length > 0) {
                this.remotePlayerStateQueue = this.remotePlayerStateQueue.slice(0, 10)
                // console.log('remotePlayerStateQueue: ', this.remotePlayerStateQueue)
                let remotePlayerState = this.remotePlayerStateQueue.shift()
                console.log('setting position from remote', remotePlayerState)
                this.player.pos = [remotePlayerState![0], remotePlayerState![1]]
                this.player.orientation = remotePlayerState![2]
                this.player.shape = this.player.rotations[this.player.orientation]

            }
        }


        return newClock
    }






}

export default Game2P