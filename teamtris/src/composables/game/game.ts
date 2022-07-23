import { Tetrimino, Board, Bag} from "./tetris"
import Renderer from "./graphics"
import Controller from "./controller"
import Engine from "./engine"
import { ConfigState } from '@/store/config'
import { count } from "console"

import { Ref } from 'vue'
import { runInThisContext } from "vm"
import Clock from './types/clock'

const constants = {
    countdown: 1,
    height: 23,
    width: 10
}

class Game {

    public solo = true
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

    public timer: Ref<number | undefined>
    public lineCounter: Ref<number | undefined>


    constructor(timer: Ref<number | undefined>, lineCounter: Ref<number | undefined>, config: ConfigState, renderer: Renderer) {
        this.elapsedTime = 0
        this.config = config
        this.new = true
        this.spriteSize = 8

        this.controller = new Controller(this)
        this.controller.initialize()
        this.board = new Board(23, 10)
        this.bag = new Bag()
        this.player = this.bag.pop()

        // UI
        this.timer = timer
        this.lineCounter = lineCounter 

        this.renderer = renderer
        // this.engine = new Engine(this.logic.bind(this))
        this.engine = this.initializeEngine()
    }

    public initializeEngine(){
        return new Engine(this.logic.bind(this))

    }

    public async start() {
        await this.renderer.loadSprites()

        console.log('game runnning')

        this.engine.start()
    }

    public async stop(requestId?: number) {
        this.engine.stop()
        await this.controller.deinitialize()
        return
    }

    public async destroy() {

    }

    public logic(clock: Clock)  {
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

            let countdown = String(constants.countdown - Math.floor(clock.countdown))
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

        //render shit
        this.board.render(this.renderer)
        this.player.render("game", this.renderer, this.board)
        this.bag.render(this.renderer, this.board)
        
        // check if topped out
        if (this.board.toppedOut){
            this.stop()
            console.log('topped out!')
            return clock
        }

        //check if a piece was placed
        if(this.solo && this.player.placed == true && this.activeTurn){
            console.log('in a solo game')
            this.bag.canHold = true
            this.player = this.bag.pop()
        }

        // check arr and das clocks 
        if(this.activeTurn && !this.new){
            this.controller.countTics(clock, this)
        }



        ////update UI
        //this.UI.updateTimer(clock.game)
        //this.UI.updateLinesCleared(this.board.linesCleared)
        //this.UI.updateFPS(clock.dt)

        return clock
    }

    public reset() {
        this.board = new Board(23, 10)
        this.bag = new Bag()
        this.player = this.bag.pop()
        this.new = true

    }
}

export default Game