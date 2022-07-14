import { Tetrimino, Board, Bag} from "./tetris"
import Renderer from "./graphics"
import Controller from "./controller"
import Engine from "./engine"
import UI from "./UI"







function drawMap(tileImage: HTMLImageElement) {
}

class Game {

    public activeTurn: boolean = true

    private context: CanvasRenderingContext2D
    private width: number
    private height: number
    spriteSize: number

    public board: Board
    public player: Tetrimino
    public bag: Bag

    protected new: boolean

    protected controller: Controller

    protected renderer: Renderer
    //protected UI: UI






    

    constructor(renderer: Renderer) {
        this.new = true
        this.spriteSize = 8




        this.renderer = renderer
        //this.UI = gameUI

        
    }

    public async run() {
        console.log('game runnning')
        this.controller = new Controller(this)
        this.controller.initialize()
        this.board = new Board(20, 10)
        this.bag = new Bag()
        this.player = this.bag.pop()
        await this.renderer.loadSprites()
        
        
        const engine = new Engine(this.logic.bind(this))
        engine.start()

    }

    public logic(clock: {[clk: string]: number}) {
        //all clock values come in with 1 frames dt at least 
        console.log('game logic')

        //if it's a new game, initialize clocks to 0 
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
        this.controller.poll(this)


        //check if a piece was placed 
        if(this.player.placed == true){
            this.bag.canHold = true
            this.player = this.bag.pop()
        }

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