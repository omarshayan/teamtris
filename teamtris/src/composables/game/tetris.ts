import Engine from "./engine"
import Renderer from "./graphics"
import Controller from "./controller"

const letters = ['T', 'I', 'O', 'S', 'Z', 'J', 'L']

const blankRow: any[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]


const tetrimatrices:{
    T: any [][][]
    I: any [][][]
    O: any [][][]
    S: any [][][]
    Z: any [][][]
    J: any [][][]
    L: any [][][]
} = {
    T: [[[0, 1, 0],
        [1, 1, 1],
        [0, 0, 0]],

        [[0, 1, 0],
        [0, 1, 1],
        [0, 1, 0]],

        [[0, 0, 0],
        [1, 1, 1],
        [0, 1, 0]],

        [[0, 1, 0],
        [1, 1, 0],
        [0, 1, 0]]],

    I: [[[0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0]],

        [[0, 0, 1, 0],
        [0, 0, 1, 0],
        [0, 0, 1, 0],
        [0, 0, 1, 0]],

        [[0, 0, 0, 0],
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0]],

        [[0, 1, 0, 0],
        [0, 1, 0, 0],
        [0, 1, 0, 0],
        [0, 1, 0, 0]]],

    O: [[[1, 1],
        [1, 1]],

        [[1, 1],
        [1, 1]],

        [[1, 1],
        [1, 1]],

        [[1, 1],
        [1, 1]]],

    S: [[[0, 1, 1],
        [1, 1, 0],
        [0, 0, 0]],

        [[0, 1, 0],
        [0, 1, 1],
        [0, 0, 1]],

        [[0, 0, 0],
        [0, 1, 1],
        [1, 1, 0]],

        [[1, 0, 0],
        [1, 1, 0],
        [0, 1, 0]]],

    Z: [[[1, 1, 0],
        [0, 1, 1],
        [0, 0, 0]],

        [[0, 0, 1],
        [0, 1, 1],
        [0, 1, 0]],

        [[0, 0, 0],
        [1, 1, 0],
        [0, 1, 1]],

        [[0, 1, 0],
        [1, 1, 0],
        [1, 0, 0]]],

    J: [[[1, 0, 0],
        [1, 1, 1],
        [0, 0, 0]],

        [[0, 1, 1],
        [0, 1, 0],
        [0, 1, 0]],

        [[0, 0, 0],
        [1, 1, 1],
        [0, 0, 1]],

        [[0, 1, 0],
        [0, 1, 0],
        [1, 1, 0]]],

    L: [[[0, 0, 1],
        [1, 1, 1],
        [0, 0, 0]],

        [[0, 1, 0],
        [0, 1, 0],
        [0, 1, 1]],

        [[0, 0, 0],
        [1, 1, 1],
        [1, 0, 0]],

        [[1, 1, 0],
        [0, 1, 0],
        [0, 1, 0]]]
}



export class Tetrimino {
    public letter: string
    public pos: [y: number, x: number]
    public shape: number[][]
    size: number
    rotations: number[][][]
    public orientation: number
    placed: boolean
    autorepeat: boolean
    public lock_clock: number
    public canSD: boolean

    constructor(letter: string, pos: [number, number] = [0, 3]) {
        this.letter = letter
        this.pos = pos
        if (this.letter == 'O'){
            this.pos[1]++
        }
        this.orientation = 0
        this.rotations = tetrimatrices[letter]
        this.shape = this.rotations[this.orientation]
        this.size = this.shape.length
        this.placed = false
        this.autorepeat = false
        this.lock_clock = 0
    }

    public render(contextId: string, renderer: Renderer, board: Board) {

        //render shadow
        for(let row = this.pos[0]; row < board.rows; row++) {
            if(!board.checkCollision(this, [row - this.pos[0], 0]) &&
                board.checkCollision(this, [row - this.pos[0] + 1, 0])){
                for(let x = 0; x < this.size; x++) {
                    for(let y = 0; y < this.size; y++){
                        if(this.shape[y][x] == 1)

                        renderer.renderSprite(contextId, this.letter + "_shadow", row + y, this.pos[1] + x)
                    }
                }
                row = board.rows + 1
            }
        }

        //render piece
        for(let x = 0; x < this.size; x++) {
            for(let y = 0; y < this.size; y++){
                if(this.shape[y][x] == 1)

                renderer.renderSprite(contextId, this.letter, this.pos[0] + y, this.pos[1] + x)
            }
        }
    }

    public renderPreview(contextId: string, renderer: Renderer, pos: number){
        for(let x = 0; x < this.size; x++) {
            for(let y = 0; y < this.size; y++){
                if(this.shape[y][x] == 1)

                renderer.renderSprite(contextId, this.letter, this.pos[0] + y, this.pos[1] + x)
            }
        }

    }

    public move(dir: [dy: number, dx: number], board: Board){

        this.pos = [this.pos[0] + dir[0], this.pos[1] + dir[1]]
        if(!board.inBounds(this)){
            this.pos = [this.pos[0] - dir[0], this.pos[1] - dir[1]]
        }
        else if (board.inBounds(this)){
            this.lock_clock = 0
        }
        if(board.checkCollision(this)){
            this.pos = [this.pos[0] - dir[0], this.pos[1] - dir[1]]
            if(dir[0] >= 1){
                this.place(board)
            }
        }
    }

    public rotate(dir: number, board: Board) {
        let oldOri = this.orientation
        this.orientation = (((this.orientation + dir) % 4) + 4 ) % 4
        let newOri = this.orientation

        this.shape = this.rotations[this.orientation]

        // if(!board.inBounds(this)){
        //     this.orientation = (((this.orientation - dir) % 4) + 4 ) % 4
        //     this.shape = this.rotations[this.orientation]
        // }
        // else if (board.inBounds(this)){
        //     this.lock_clock = 0
        // }
        if(board.checkCollision(this)){


            let R = 1
            let L = 3


            //attempt to kick
            if(this.letter == 'J' || this.letter == 'L' || this.letter == 'S' || this.letter == 'T' || this.letter == 'Z'){
                if( newOri == L || oldOri == R) { //if the new orientation is closer to L
                    if(!board.checkCollision(this, [0, 1]) && board.inBounds(this, [0, 1])){
                        this.move([0, 1], board)
                        return
                    }
                    if(oldOri == R){
                        if(!board.checkCollision(this, [1, 1]) && board.inBounds(this, [1, 1])){
                            this.move([1, 1], board)
                            return
                        }
                        if(!board.checkCollision(this, [-2, 0]) && board.inBounds(this, [-2, 0])){
                            this.move([-2, 0], board)
                            return
                        }
                        if(!board.checkCollision(this, [-2, 1]) && board.inBounds(this, [-2, 1])){
                            this.move([-2, 1], board)
                            return
                        }
                    }
                    if(newOri == L){
                        if(!board.checkCollision(this, [-1, 1]) && board.inBounds(this, [-1, 1])){
                            this.move([-1, 1], board)
                            return
                        }
                        if(!board.checkCollision(this, [-2, 0]) && board.inBounds(this, [-2, 0])){
                            this.move([-2, 0], board)
                            return
                        }
                        if(!board.checkCollision(this, [2, 1]) && board.inBounds(this, [2, 1])){
                            this.move([2, 1], board)
                            return
                        }
                    }
                }

                if( newOri == R || oldOri == L) { //if the new orientation is closer to R
                    if(!board.checkCollision(this, [0, -1]) && board.inBounds(this, [0, -1])){
                        this.move([0, -1], board)
                        return
                    }
                    if(newOri == R){
                        if(!board.checkCollision(this, [-1, -1]) && board.inBounds(this, [-1, -1])){
                            this.move([-1, -1], board)
                            return
                        }
                        if(!board.checkCollision(this, [2, 0]) && board.inBounds(this, [2, 0])){
                            this.move([2, 0], board)
                            return
                        }
                        if(!board.checkCollision(this, [2, -1]) && board.inBounds(this, [2, -1])){
                            this.move([2, -1], board)
                            return
                        }
                    }
                    if(oldOri == L){
                        if(!board.checkCollision(this, [1, -1]) && board.inBounds(this, [1, -1])){
                            this.move([1, -1], board)
                            return
                        }
                        if(!board.checkCollision(this, [-2, 0]) && board.inBounds(this, [-2, 0])){
                            this.move([-2, 0], board)
                            return
                        }
                        if(!board.checkCollision(this, [-2, -1]) && board.inBounds(this, [-2, -1])){
                            this.move([-2, -1], board)
                            return
                        }
                    }
                }
                //after attempting to kick, if n

            }
            if(this.letter == 'I'){
                if((oldOri == 0 && newOri == R) || (oldOri == L && newOri == 2)){
                    if(!board.checkCollision(this, [0, -2]) && board.inBounds(this, [0, -2])){
                        this.move([0, -2], board)
                        return
                    }
                    if(!board.checkCollision(this, [0, 1]) && board.inBounds(this, [0, 1])){
                        this.move([0, 1], board)
                        return
                    }
                    if(!board.checkCollision(this, [1, -2]) && board.inBounds(this, [1, -2])){
                        this.move([1, -2], board)
                        return
                    }
                    if(!board.checkCollision(this, [-2, 1]) && board.inBounds(this, [-2, 1])){
                        this.move([-2, 1], board)
                        return
                    }
                }
                if((oldOri == R && newOri == 0) || (oldOri == 2 && newOri == L)){
                    if(!board.checkCollision(this, [0, 2]) && board.inBounds(this, [0, 2])){
                        this.move([0, 2], board)
                        return
                    }
                    if(!board.checkCollision(this, [0, -1]) && board.inBounds(this, [0, -1])){
                        this.move([0, -1], board)
                        return
                    }
                    if(!board.checkCollision(this, [1, -2]) && board.inBounds(this, [1, -2])){
                        this.move([1, -2], board)
                        return
                    }
                    if(!board.checkCollision(this, [2, -1]) && board.inBounds(this, [2, -1])){
                        this.move([2, -1], board)
                        return
                    }

                }
                if((oldOri == R && newOri == 2) || (oldOri == 0 && newOri == L)){
                    if(!board.checkCollision(this, [0, -1]) && board.inBounds(this, [0, -1])){
                        this.move([0, -1], board)
                        return
                    }
                    if(!board.checkCollision(this, [0, 2]) && board.inBounds(this, [0, 2])){
                        this.move([0, 2], board)
                        return
                    }
                    if(!board.checkCollision(this, [-2, -1]) && board.inBounds(this, [-2, -1])){
                        this.move([-2, -1], board)
                        return
                    }
                    if(!board.checkCollision(this, [1, 2]) && board.inBounds(this, [1, 2])){
                        this.move([1, 2], board)
                        return
                    }

                }
                if((oldOri == 2 && newOri == R) || (oldOri == L && newOri == 0)){

                    if(!board.checkCollision(this, [0, 1]) && board.inBounds(this, [0, 1])){
                        this.move([0, 1], board)
                        return
                    }
                    if(!board.checkCollision(this, [0, -2]) && board.inBounds(this, [0, -2])){
                        this.move([0, -2], board)
                        return
                    }
                    if(!board.checkCollision(this, [2, 1]) && board.inBounds(this, [2, 1])){
                        this.move([2, 1], board)
                        return
                    }
                    if(!board.checkCollision(this, [1, -2]) && board.inBounds(this, [-1, -2])){
                        this.move([-1, -2], board)
                        return
                    }

                }
            }

            this.orientation = oldOri
            this.shape = this.rotations[this.orientation]
        }
    }

    public hardDrop(board){

        for(let row = this.pos[0]; row < board.rows; row++) {
            this.pos[0] = row
            if(!board.checkCollision(this) && board.checkCollision(this, [1, 0])){

                this.place(board)
                return
            }
        }
    }

    public place(board){
        for(let x = 0; x < this.size; x++) {
            for(let y = 0; y < this.size; y++){
                if(this.shape[y][x] == 1){
                    let temp = this.letter
                    let temp2 = board.cells
                    temp2[this.pos[0] + y][this.pos[1] + x] = temp
                    board.cells = temp2
                }
            }
        }
        this.placed = true
        board.clearLines()
    }

    public resetPos() {
        this.pos = [0, 4]
    }


}


export class Board {
    rows: number
    cols: number
    cells: any[][]
    linesCleared: number

    constructor(rows: number, cols: number){
        this.cols = cols
        this.rows = rows
        this.linesCleared = 0


        //initialize cells as empty
        // this.cells = [];
        // for(let i = 0; i < rows; i++) {
        //     this.cells[rows] = []
        //     for(let j = 0; j < cols; j++) {
        //         this.cells[rows][cols] = 0
        //     }
        // }
        this.cells = [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]]



    }

    public render(renderer: Renderer) {
        console.log('rendering board')
        for(let row = 0; row < this.rows; row++) {
            for(let col = 0; col < this.cols; col++){
                renderer.renderSprite("game", this.cells[row][col], row, col)
            }
        }
    }

    public checkCollision(player: Tetrimino, dir: [dy: number, dx: number]=[0,0]): boolean {
        //check each cell player is occupying
        for(let x = 0; x < player.size; x++) {
            for(let y = 0; y < player.size; y++){
                if(player.shape[y][x] == 1){
                    if(player.pos[0] + y + dir[0] >= this.rows ||
                    //    player.pos[1] + x >= this.cols ||
                       this.cells[player.pos[0] + y + dir[0]][player.pos[1] + x + dir[1]] != 0) {
                        return true

                    }
                }
            }
        }
        return false
    }

    public inBounds(player: Tetrimino, dir: [dy: number, dx: number]=[0,0]): boolean{
        for(let x = 0; x < player.size; x++) {
            for(let y = 0; y < player.size; y++){
                if(player.shape[y][x] == 1){
                    if(player.pos[1] + x + dir[1] >= this.cols || player.pos[1] + x + dir[1] < 0)
                        return false
                }
            }
        }
        return true

    }

    public clearLines() {
        var linesCleared = 0
        for(let row = this.rows - 1; row >= 0; row--) {
            if(this.cells[row].indexOf(0) === -1){
                for(let rowAbove = row; rowAbove > 0; rowAbove--){
                    let temp = this.cells[rowAbove - 1]
                    this.cells[rowAbove] = temp
                }
                let emptyRow = blankRow
                this.cells[0] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
                row++
                linesCleared++
            }
        }
        this.linesCleared += linesCleared

    }




}

export class Bag {

    public queue: Tetrimino[]
    private heldPiece: Tetrimino
    private previewLength: number
    public canHold: boolean

    constructor(){
        this.queue = this.shuffledBag(letters)
        this.heldPiece = null
        this.canHold = true
        this.previewLength = 5
    }

    private shuffledBag(letters: string[]): Tetrimino[] {
        let currentIndex = letters.length,  randomIndex;

        // While there remain elements to shuffle...
        while (currentIndex != 0) {

          // Pick a remaining element...
          randomIndex = Math.floor(Math.random() * currentIndex);
          currentIndex--;

          // And swap it with the current element.
          [letters[currentIndex], letters[randomIndex]] = [
            letters[randomIndex], letters[currentIndex]];
        }

        return Array.from(letters, letter => new Tetrimino(letter));
      }

      public pop(): Tetrimino {
        if(this.queue.length <= 7){
            let newBag = this.shuffledBag(letters)
            this.queue = newBag.concat(this.queue)
        }
          return this.queue.pop()
      }

      public render (renderer: Renderer, board: Board) {
        renderer.clearPreview(this.previewLength)
        for(let i = 1; i <= this.previewLength; i++) {
            //for each piece in the bag
            renderer.renderSprite("bag", this.queue[this.queue.length-i].letter + "_preview", i - 1)
        }
        if(this.heldPiece != null){
            if(this.canHold == false){
                renderer.renderSprite("hold", this.heldPiece.letter + "_preview_grey")
            }
            else{
                renderer.renderSprite("hold", this.heldPiece.letter + "_preview")
            }
        }
        else if(this.heldPiece == null){
            renderer.clearHeldPiece()
        }
      }

      public hold (player: Tetrimino): Tetrimino {
          var newPiece: Tetrimino = player
          if(this.canHold){
            if(this.heldPiece == null){
                this.heldPiece = player
                newPiece = this.pop()
            }
            else {
                newPiece = this.heldPiece
                this.heldPiece = player
            }
            this.canHold = false
            newPiece.resetPos()
          }

          return newPiece
      }


}