import { stringify } from "querystring"
import { resolveTransitionHooks } from "vue"

export default class Message {
    sender: string
    role: string
    metadata: string
    content: any | null

    constructor(role: string, metadata: string, content?: any) {
        this.role = role
        this.metadata = metadata
        this.content = content? content : null
        this.sender = 'client'
    }
}
