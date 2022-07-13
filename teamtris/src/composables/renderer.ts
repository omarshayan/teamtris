
 export default class Renderer {

    protected context: CanvasRenderingContext2D

    constructor(canvas: HTMLCanvasElement ) {
        this.context = canvas.getContext("2d")!
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
}