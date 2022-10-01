

export interface LobbyState {
    code: string
    hostsockid: string
    gameReady: boolean
    playerIds: string[]
    hostId: string | null
    guestId: string | null
}


export default {
    state: () => ({
       code: '',
       hostsockid: '',
       playerIds: [],
       hostId: '',
       guestId: null,

    // arr: number,
    // das: number,
    // dcf: number,
    // sdf: number,
    }),
    mutations: {
        setConnectCode: function(state: LobbyState, code: string) {
            state.code = code
        },
        setHostSockID: function(state: LobbyState, hostsockid: string) {
            state.hostsockid = hostsockid
        },
        setPlayerIds: function(state: LobbyState, ids: {hostId: string, guestId: string}) {
            state.hostId = ids.hostId
            state.guestId = ids.guestId
        },
        updatePlayerList: function(state: LobbyState, playerIds: string[]) {
            console.log('updating playerIds to ', playerIds)
            state.playerIds = playerIds
        }
    }
}