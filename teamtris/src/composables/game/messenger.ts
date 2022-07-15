import { stringify } from "querystring"
import { resolveTransitionHooks } from "vue"

export default class Message {
    sender: string
    role: string
    metadata: string
    content: string | null

    constructor(role: string, metadata: string, content?: string) {
        this.role = role
        this.metadata = metadata
        this.content = content? content : null
        this.sender = 'client'
    }
}
