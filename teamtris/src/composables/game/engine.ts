import { request } from "http"
import Renderer from "./graphics"


type GameLogic = (clock: {[clk: string]: number}) => {[clk: string]: number}

class Engine {
    
    private requestId: number | undefined
    private lastTime: number
    private renderer: Renderer
    private gameLogic: GameLogic

    private gravityClock: number

    private clock: {[clk: string]: number} = {}

    constructor(gameLogic: GameLogic){
        this.gameLogic = gameLogic
    }

    public start() {
        this.gravityClock = 0

        this.clock.sd = 0
        this.clock.grav = 0
        this.clock.lockDelay = 0
        this.clock.ar = 0
        this.clock.dasL = 0
        this.clock.dasR = 0
        this.clock.game = 0
        this.clock.countdown = 0
        this.clock.dt = 0



        this.lastTime = (new Date()).getTime()
        console.log('next frame!')

        window.requestAnimationFrame(this.nextFrame.bind(this))

    }

    public stop() {
        if (this.requestId){
            console.log('stopping game..')
            window.cancelAnimationFrame(this.requestId)
            this.requestId = undefined
        }
    }
    

    private nextFrame() {
        const time = (new Date()).getTime()
        const dt = (time - this.lastTime) / 1000 //converting from ms to seconds, about 0.04

        console.log('next frame : ', dt)
        // Object.entries(this.clock).forEach(([clk, val], index) => {
        //     val += dt
        // });

        this.clock.sd           += dt
        this.clock.grav         += dt
        this.clock.lockDelay    += dt
        this.clock.ar           += dt
        this.clock.dasL         += dt
        this.clock.dasR         += dt
        this.clock.game         += dt
        this.clock.countdown    += dt
        this.clock.dt           += dt

        this.lastTime = time

        this.clock = this.gameLogic(this.clock)

        this.requestId = window.requestAnimationFrame(this.nextFrame.bind(this))
    }
}

export default Engine