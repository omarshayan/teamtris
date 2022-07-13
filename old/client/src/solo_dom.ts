import UI from "./UI"
import Renderer from "./graphics"
import Game from "./game"


async function main() {
    
    const boardCanvas = document.getElementById('board-canvas') as HTMLCanvasElement | undefined
    const bagCanvas = document.getElementById('bag-canvas') as HTMLCanvasElement | undefined
    const holdCanvas = document.getElementById('hold-canvas') as HTMLCanvasElement | undefined

    const timerEl = document.getElementById('timer')
    const lineCounterEl = document.getElementById('line-counter')
    const FPS = document.getElementById('FPS')
    const turn = document.getElementById('turn')

    const gameUI = new UI(timerEl, lineCounterEl, FPS, turn)

    if (boardCanvas == null) {
        console.log("can't find the canvas")
        return
    }
    else if (bagCanvas == null) {
        console.log("can't find the canvas")
        return
    }    
    else if (holdCanvas == null) {
        console.log("can't find the canvas")
        return
    }    

    const canvases: {[id: string]: HTMLCanvasElement} = {
        "game": boardCanvas,
        "bag": bagCanvas,
        "hold": holdCanvas
    }


    const renderer = new Renderer(canvases)

    const game = new Game(renderer, gameUI)
    game.run()


}

main()