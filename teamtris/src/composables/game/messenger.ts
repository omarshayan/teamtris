import { stringify } from "querystring"
import { resolveTransitionHooks } from "vue"

type wsAPIAction = "joinlobby" | "createlobby" | "sendlobbymessage" | "createloljkjkbby"

export default class wsAPIMessage {
    action: wsAPIAction 
    message?: string | null
    code?: string | null

    constructor(action: wsAPIAction, message?: wsMessage, code?: string) {
        this.action = action 
        this.message = message? JSON.stringify(message) : null
        this.code = code? code : null
    }
}

export class wsMessage {
    metadata: string
    data: any | null

    constructor(metadata: string, data?: any) {
        this.metadata = metadata
        this.data = data? data : null
    }
}

export class wrtcMessage {
    metadata: string
    content: any | null

    constructor(metadata: string, data?: any) {
        this.metadata = metadata
        this.content = data? data : null
    }
}