import Renderer from './renderer'

export default class gamePreviewRenderer extends Renderer {

    private tempBackground: HTMLImageElement | undefined

    constructor(canvas: HTMLCanvasElement){
        super(canvas)
        this.loadImages()
    }

    private async loadImages(){
        try{
            this.tempBackground = await gamePreviewRenderer.loadImageFromUrl('src/assets/new-game-preview-cropped.png')
        } catch (e) {
            console.log(e)
            console.log("error!")
        }
    }

    public async renderMenu(){
        await this.loadImages()
        await this.context.drawImage(this.tempBackground!, 0, 0, 256, 512)
        this.context.font = "60px Floppy Pixel Regular"
        this.context.fillStyle='white'
        this.context.fillText('host a', 64, 50)
        this.context.fillText('new game', 32, 100)

    }


}