class UI {
    timer: HTMLElement
    lineCounter: HTMLElement
    FPS: HTMLElement
    activeTurn: HTMLElement

    constructor(timer: HTMLElement, lineCounter: HTMLElement, FPS: HTMLElement, activeTurn: HTMLElement){
        this.timer = timer
        this.lineCounter = lineCounter
        this.FPS = FPS
        this.activeTurn = activeTurn
    }


    public updateTimer(gameTime: number){
        const total_ms = (Math.round(gameTime*1000))
        const ms = Math.round(total_ms % 1000)
        const sec = Math.round((total_ms/1000 % 60))
        const min = Math.round((total_ms/1000/60))
        this.timer.innerHTML = String(min).padStart(1, '0') + ":" + String(sec).padStart(2, '0') + "." + String(ms).padStart(3, '0')
    }

    public updateLinesCleared(linesCleared: number){
        const linesStr = String(linesCleared)
        this.lineCounter.innerHTML = linesStr + "/40"
    }

    public updateFPS(dt: number) {
        // this.FPS.innerHTML = String(Math.round(1/dt *1000)/1000)
        this.FPS.innerHTML = ""
    }

    public updateTurn(activeTurn: boolean) {
        // this.FPS.innerHTML = String(Math.round(1/dt *1000)/1000)
        if(activeTurn){
            this.activeTurn.innerHTML = "mine"
        }
        if(!activeTurn){
            this.activeTurn.innerHTML = "their"
        }

    }



}

export default UI