import { request } from "http"
import Renderer from "./graphics"
import Clock from './types/clock'

type GameLogic = (clock: Clock) => Clock

class Engine {
    private running: boolean
    private requestId: number | undefined
    private lastTime: number
    private renderer: Renderer
    private gameLogic: GameLogic

    private gravityClock: number

    private clock: Clock

    constructor(gameLogic: GameLogic){
        this.gameLogic = gameLogic
        this.running = false
        this.clock = {
            sd: 0,
            grav: 0,
            lockDelay: 0,
            ar: 0,
            dasL: 0,
            dasR: 0,
            game: 0,
            countdown: 0,
            dt: 0,
        }
    }

    public start() {
        this.running = true
        this.gravityClock = 0
        this.lastTime = (new Date()).getTime()

        window.requestAnimationFrame(this.nextFrame.bind(this))

    }

    public stop() {
        // if (requestId) {
        //     console.log('stopping game with passed request id')
        //     window.cancelAnimationFrame(requestId)
        //     r
        // }
        if (this.requestId){
            console.log('stopping game..')
            console.log(this.requestId)
            window.cancelAnimationFrame(this.requestId)
            this.requestId = undefined
            this.running = false
        }
        return
    }
    

    private nextFrame() {
        const time = (new Date()).getTime()
        const dt = (time - this.lastTime) / 1000 //converting from ms to seconds, about 0.04

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

        if(this.running) {
            this.requestId = window.requestAnimationFrame(this.nextFrame.bind(this))
        }
    }
}

export default Engine