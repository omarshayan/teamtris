import SimplePeer from "simple-peer"
import Message from "./messenger"

class Chat{

    el: HTMLElement
    history: string[]
    form: HTMLFormElement
    peer: SimplePeer.Instance

    constructor(chat_form: HTMLFormElement, peer: SimplePeer.Instance, el: HTMLElement){
        this.history = []
        this.form = chat_form
        this.peer = peer
        this.el = el
    }
    

    initialize(){
        //define onsubmit
        this.form.onsubmit = async (e) => {
            e.preventDefault();
            console.log("Preventing default form submission!")
    
            const chatFormData = new FormData(this.form)
            let chatValue = chatFormData.get("chat-input")
            console.log(chatValue)
            let chatString: string = chatValue!.toString()
            this.history.push(chatString)
            this.form.reset()
            this.updateDOM()
            let chat_msg = {
                metadata: "chat",
                content: chatString
            }
            this.peer.send(JSON.stringify(chat_msg))
        }

        //add event listener onto peer for chat msg receipt
        this.peer.on('data', (data: any) => {
            let dataObj = JSON.parse(data)
            if(dataObj.metadata == "chat"){
                this.history.push(dataObj.content.toString())
                this.updateDOM()
            }
        })
                    
    }

    updateDOM(){
        this.history.forEach(msg => {
            this.el.append(msg)
        })
    }




    
}



export default Chat