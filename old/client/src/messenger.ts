function Message(role: String, metadata: String, content: String){
    this.sender = "client"
    this.role = role
    this.metadata = metadata
    this.content = content
}

export default Message