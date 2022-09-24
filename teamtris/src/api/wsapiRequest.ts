
type wsAPIAction = "createlobby" | "sendlobbymessage" 

export default interface wsAPIMessage {
    action: wsAPIAction,
    message: string
}