import Renderer from '@/composables/renderer'
import { withCtx } from 'vue'

const spriteSheet: any = {
    //sprite index map
    //top left of sprite sheet is 0,0
    0: [0,0], //background sprite
    1: [0,1], //empty sprite
    'X': [0,2], 
    'T': [3, 0],
    'I': [2, 0],
    'O': [4, 0],
    'S': [1, 0],
    'Z': [6, 0],
    'J': [5, 0],
    'L': [8, 0],
    'T_shadow': [3, 1],
    'I_shadow': [2, 1],
    'O_shadow': [4, 1],
    'S_shadow': [1, 1],
    'Z_shadow': [6, 1],
    'J_shadow': [5, 1],
    'L_shadow': [8, 1],
    'T_preview': [0, 2],
    'I_preview': [0, 0],
    'O_preview': [0, 1],
    'S_preview': [0, 4],
    'Z_preview': [0, 3],
    'J_preview': [0, 5],
    'L_preview': [0, 6],
    'T_preview_grey': [1, 2],
    'I_preview_grey': [1, 0],
    'O_preview_grey': [1, 1],
    'S_preview_grey': [1, 4],
    'Z_preview_grey': [1, 3],
    'J_preview_grey': [1, 5],
    'L_preview_grey': [1, 6],
}

class GameRenderer{

    protected contexts: {[id: string]: CanvasRenderingContext2D}

    private countdown: string
    private gameRes: [width: number, height: number]
    private bagRes: [width: number, height: number]
    private spriteSize: number
    private sprites: HTMLImageElement | null
    private previewSprites: HTMLImageElement | null
    private previewSize: [width: number, height: number]


    constructor(canvases: {[id: string]: HTMLCanvasElement} ) {

        this.contexts = {}
        for(const canvas in canvases){
            this.contexts[canvas] = canvases[canvas].getContext("2d")!
        }
        this.gameRes = [canvases["game"].width, canvases["game"].height]
        this.bagRes = [canvases["bag"].width, canvases["bag"].height]
        this.spriteSize = 32
        this.previewSize = [this.spriteSize*5, this.spriteSize*3]

        this.sprites = null
        this.previewSprites = null
        this.countdown = ""

        this.contexts['game'].font = "60px Floppy Pixel Regular"
        this.contexts['game'].fillStyle = 'white'
        this.contexts['game'].textAlign = 'center'
    }

    public async loadSprites(){
        try{
            [this.sprites, this.previewSprites] = await Promise.all([
                Renderer.loadImageFromUrl("src/assets/sprite-atlas.png"),
                Renderer.loadImageFromUrl("src/assets/preview-sprites.png")])
        } catch (e) {
            console.log(e)
            console.log("error!")
        }


    }

    public static loadImageFromUrl(url:string): Promise<HTMLImageElement> {
        return new Promise(resolve => {
            const img = new Image()
            img.onload = () => {
                resolve(img)
            }
            img.src = url
        })
    }

    public async renderSprite(contextId: string, spriteId: string, y?:number, x?: number, mul: number=1) {
        //render sprite on respective context
        const coords = spriteSheet[spriteId]

        switch(contextId){
            case "game": {
                if (y==undefined || x==undefined) {
                    throw new Error('you can\'t render a sprite in the game without providing coordinates')
                    // return
                }
                this.renderCell(spriteId, y, x)
                break;
            }
            case "bag": {
                if (y==undefined) {
                    throw new Error('you can\'t render a sprite in the bag without providing a coordinate')
                    // return
                }
                
                this.contexts["bag"].drawImage(this.previewSprites!,
                    0, coords[1]*this.previewSize[1], this.previewSize[0], this.previewSize[1],
                    0, y*this.previewSize[1], this.previewSize[0], this.previewSize[1])
                break;
            }
            case "hold": {
                this.clearHeldPiece()
                this.contexts["hold"].drawImage(this.previewSprites!,
                    coords[0]*this.previewSize[0], coords[1]*this.previewSize[1], this.previewSize[0], this.previewSize[1],
                    0, 0, this.previewSize[0], this.previewSize[1])
                break;
            }
            default: {
                break;
            }
        }
    }

    public async renderCell(spriteId: string, y:number, x: number){
        const coords = spriteSheet[spriteId]
        const mul = this.spriteSize

        if (spriteId == '1') {
            this.contexts["game"].clearRect(
                x*mul, y*mul, mul, mul,
            )
            return
        }
        this.contexts["game"].drawImage(this.sprites!,
            coords[0]*mul, coords[1]*mul, mul, mul,
            x*mul, y*mul, mul, mul
            )
    }

    public async renderCountdown(count: string){
        this.contexts['game'].fillStyle = 'black'
        this.contexts['game'].fillText(String(this.countdown), this.gameRes[0]/2, this.gameRes[1]/2)
        this.contexts['game'].fillStyle = 'white'
        this.contexts['game'].fillText(String(count), this.gameRes[0]/2, this.gameRes[1]/2)
        this.countdown = count
    }

    public clearPreview(previewLength: number){
        this.contexts["bag"].clearRect(0,0, this.previewSize[0], this.previewSize[1]*previewLength)
    }

    public clearHeldPiece(){
        this.contexts["hold"].clearRect(0,0,this.previewSize[0], this.previewSize[1])
    }

}

export default GameRenderer