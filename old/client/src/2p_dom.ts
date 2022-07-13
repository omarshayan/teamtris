import UI from "./UI"
import Renderer from "./graphics"
import Peer from 'simple-peer'
import Game2P from "./game2p"
import Chat from "./chat"


async function Manip_DOM(peer?: Peer, isHost?: boolean) {
    
    const boardCanvas = document.getElementById('board-canvas') as HTMLCanvasElement | undefined
    const bagCanvas = document.getElementById('bag-canvas') as HTMLCanvasElement | undefined
    const holdCanvas = document.getElementById('hold-canvas') as HTMLCanvasElement | undefined

    const timerEl = document.getElementById('timer')
    const lineCounterEl = document.getElementById('line-counter')
    const FPS = document.getElementById('FPS')
    const turn = document.getElementById("turn")

    const gameUI = new UI(timerEl, lineCounterEl, FPS, turn)

    const chatEl = document.getElementById("chat-history")


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
    if(isHost){
        turn.innerText = "mine"
    }
    else if(!isHost){
        turn.innerText = "theirs"
    }

    //chat

    const chat: Chat = new Chat(document.forms["chat-input"], peer, chatEl)
    chat.initialize()


    const game = new Game2P(renderer, gameUI, peer, isHost)
    game.run()


}

export default Manip_DOM