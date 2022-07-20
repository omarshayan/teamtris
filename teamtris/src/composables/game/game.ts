import { Tetrimino, Board, Bag} from "./tetris"
import Renderer from "./graphics"
import Controller from "./controller"
import Engine from "./engine"
import { ConfigState } from '@/store/config'
import { count } from "console"

import { Ref, ref, computed } from 'vue'
import { runInThisContext } from "vm"



function drawMap(tileImage: HTMLImageElement) {
}

class Game {

    public activeTurn: boolean = true
    public elapsedTime: number

    spriteSize: number

    public board: Board
    public player: Tetrimino
    public bag: Bag

    protected new: boolean

    protected controller: Controller
    public config: ConfigState;
    protected renderer: Renderer
    protected engine: Engine

    public timer: Ref<Number | undefined>
    public lineCounter: Ref<Number | undefined>


    constructor(timer: Ref<Number | undefined>, lineCounter: Ref<Number | undefined>, config: ConfigState, renderer: Renderer) {
        this.elapsedTime = 0
        this.config = config
        this.new = true
        this.spriteSize = 8

        this.controller = new Controller(this)
        this.controller.initialize()
        this.board = new Board(20, 10)
        console.log('this board is ', this.board)
        this.bag = new Bag()
        this.player = this.bag.pop()

        this.renderer = renderer
        this.engine = new Engine(this.logic.bind(this))

        // UI
        this.timer = timer
        this.lineCounter = lineCounter 
    }

    public async run() {
        await this.renderer.loadSprites()

        console.log('game runnning')

        this.engine.start()
    }

    public async stop() {
        this.engine.stop()
    }

    public async destroy() {

    }

    public logic(clock: {[clk: string]: number}) {
        //all clock values come in with 1 frames dt at least

        //if it's a new game, initialize clocks to 0, and play the countdown
        if(this.new){
            // keep all clocks (except countdown) until countdown is finished
            // Object.entries(clock).forEach(([clk, val], index) => {
            //     if(clk != 'countdown'){
            //         val = 0
            //         console.log(clk, ': ', val)
            //     }
            // })
            clock.sd = 0
            clock.grav = 0
            clock.lockDelay = 0
            clock.ar = 0
            clock.dasL = 0
            clock.dasR = 0
            clock.game = 0
            clock.dt = 0
    
            this.board.render(this.renderer)
            // this.player.render("game", this.renderer, this.board)
            this.bag.render(this.renderer, this.board)

            let countdown = String(3 - Math.floor(clock.countdown))
            if (countdown == '0'){
                this.new = false
                console.log(clock)

            }
            else{
                this.renderer.renderCountdown(countdown)
            }

            return clock
        }
        else if(!this.new) {
            clock.countdown = 0
            this.elapsedTime = clock.game
            this.timer.value = clock.game
            this.lineCounter.value = this.board.linesCleared
        }

        //poll controller
        this.controller.poll(this)

        //check if a piece was placed
        if(this.player.placed == true){
            this.bag.canHold = true
            this.player = this.bag.pop()
        }

        // check arr and das clocks 
        this.controller.countTics(clock, this)

        //render shit
        this.board.render(this.renderer)
        this.player.render("game", this.renderer, this.board)
        this.bag.render(this.renderer, this.board)

        ////update UI
        //this.UI.updateTimer(clock.game)
        //this.UI.updateLinesCleared(this.board.linesCleared)
        //this.UI.updateFPS(clock.dt)

        return clock
    }

    public reset() {
        this.board = new Board(20, 10)
        this.bag = new Bag()
        this.player = this.bag.pop()
        this.new = true

    }
}

export default Game