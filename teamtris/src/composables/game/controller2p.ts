import Game2P from "./game2p"
import Controller from "./controller"
import Clock from './types/clock'

class Controller2P extends Controller {

    constructor(game: Game2P){
        super(game)
    }

    public async initialize() { 
        document.addEventListener("keydown", e => {
            console.log(this.game.activeTurn)
            e. preventDefault()
            this.keyStates[e.key] = true
            if(!e.repeat){
                this.keyPress(e.key)
            }
            
        })

        document.addEventListener("keyup", e => {
            e. preventDefault()
            this.keyStates[e.key] = false
        })
    }

    public keyPress(key: string){

        switch(key) { 
            case "ArrowLeft": { 
                // console.log('left')
                if(this.game.activeTurn){
                    this.game.player.move([0, -1], this.game.board)
                }
               break; 
            } 
            case "ArrowRight": { 
                // console.log('right')
                if(this.game.activeTurn){
                    this.game.player.move([0, 1], this.game.board)
                }
               break; 
            } 

            case "z": {
                if(this.game.activeTurn){
                    this.game.player.rotate(-1, this.game.board)
                }
                break;
            }

            case "x": {
                if(this.game.activeTurn){
                    this.game.player.rotate(1, this.game.board)
                }
                break;
            }

            case "Z": {
                if(this.game.activeTurn){
                    this.game.player.rotate(-1, this.game.board)
                }                break;
            }

            case "X": {
                if(this.game.activeTurn){
                    this.game.player.rotate(1, this.game.board)
                }                break;
            }

            case " ": {
                if(this.game.activeTurn){
                this.game.player.hardDrop(this.game.board)

                }
                break;
            }

            case "ArrowUp": {
                if(this.game.activeTurn){
                    this.game.player.rotate(1, this.game.board)
                }                        break; 
            }

            case "ArrowDown": {
                this.game.player.canSD = true
                break;
            }

            case "r": {
                console.log('resetting!')
                this.game.reset()
                break;
            }

            case "R": {
                console.log('resetting!')
                this.game.reset()
                break;
            }


            case "Shift": {
                this.game.player = this.game.bag.hold(this.game.player)
                break;
            }


         } 
    }

    
    public poll(game: Game2P) {
        if (this.keyStates["ArrowDown"]) {
            
        }

        if (this.keyStates["ArrowLeft"]) {     

        }

        if (this.keyStates["ArrowRight"]) {

        }


        if (this.keyStates["z"]) {

        }

        if (this.keyStates["x"]) {

        }

    }

    public countTics(clock: Clock, game: Game2P){

        //das left
        if (!this.keyStates["ArrowLeft"] || this.keyStates["ArrowRight"]){
            clock.dasL = 0
            game.player.autorepeat = false
        }
        else if(this.keyStates["ArrowLeft"] && !this.keyStates["ArrowRight"]){

            if(clock.dasL > this.dasT){
                game.player.autorepeat = true
            }
            if(!game.player.autorepeat){
                clock.ar = 0
            }
            if (game.player.autorepeat) {
                if(clock.ar > this.arT){
                    for(let i = 0; i < Math.round(clock.ar/this.arT); i++ ){
                        game.player.move([0, -1], game.board)
                    }
                    clock.ar %= this.arT
                }
            }
        }

        //das right
        if (!this.keyStates["ArrowRight"] || this.keyStates["ArrowLeft"]){
            clock.dasR = 0
            game.player.autorepeat = false
        }
        else if(this.keyStates["ArrowRight"] && !this.keyStates["ArrowLeft"]){
            if(clock.dasR > this.dasT){
                game.player.autorepeat = true
            }
            if(!game.player.autorepeat){
                clock.ar = 0
            }
            if (game.player.autorepeat) {
                if(clock.ar > this.arT){
                    for(let i = 0; i < Math.round(clock.ar/this.arT); i++ ){
                        game.player.move([0, 1], game.board)
                    }
                    clock.ar %= this.arT
                }
            }
        }


        //soft dropping
        if (!this.keyStates["ArrowDown"]){
            clock.sd = 0
        }
        else if(this.keyStates["ArrowDown"]){
            //disable and reset gravity
            game.player.canSD = true
            if(clock.sd > this.sdT && game.player.canSD) {
                for(let i = 0; i < Math.round(clock.sd/this.sdT); i++ ){
                    if(!game.board.checkCollision(game.player, [1,0])){
                        game.player.move([1, 0], game.board)
                    }
                }
                clock.sd %= this.sdT
            }

        }

        




        //hard gravity / leeway
        if(!game.board.checkCollision(game.player, [1, 0])) {
            clock.lockDelay = 0
        }
        else if(game.board.checkCollision(game.player, [1, 0])) { // if you're about to collide, hardgravity comes into play
            game.player.lock_clock += clock.dt
            clock.grav = 0
            if (clock.lockDelay > this.lockDelay || game.player.lock_clock > this.gravT){
                game.player.move([1, 0], game.board)
                clock.lockDelay = 0
            }
        }

        //ambient gravity
        if (clock.grav > this.gravT) {
            if(!game.board.checkCollision(game.player, [1, 0])) { //gravity stops when you're about to collide
                for(let i = 0; i < Math.round(clock.grav/this.gravT); i++ ){
                    game.player.move([1, 0], game.board)
                }
                clock.grav %= this.gravT
            }
        }


    }
}


export default Controller2P