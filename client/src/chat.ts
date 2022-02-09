import Peer from "simple-peer"
import Message from "./messenger"

class Chat{

    el: HTMLElement
    history: string[]
    form: HTMLFormElement
    peer: Peer

    constructor(chat_form: HTMLFormElement, peer: Peer, el: HTMLElement){
        this.history = []
        this.form = chat_form
        this.peer = Peer
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
            let chatString: string = chatValue.toString()
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
        this.peer.on( data => {
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