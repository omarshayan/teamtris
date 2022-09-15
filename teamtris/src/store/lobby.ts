import { Lobby } from '@/api/data/lobby'
import { User } from '@/api/data/user'

export default {
    state: () => ({
       code: '',
       hostsockid: '',
       playerIds: []

    // arr: number,
    // das: number,
    // dcf: number,
    // sdf: number,
    }),
    mutations: {
        setConnectCode: function(state: Lobby, code: string) {
            state.code = code
        },
        setHostSockID: function(state: Lobby, hostsockid: string) {
            state.hostsockid = hostsockid
        },
        updatePlayerList: function(state: Lobby, playerIds: string[]) {
            state.playerIds = playerIds
        }
    }
}