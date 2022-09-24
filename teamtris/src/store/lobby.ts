import { Lobby } from '@/api/data/lobby'
import { User } from '@/api/data/user'

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
        setConnectCode: function(state: Lobby, code: string) {
            state.code = code
        },
        setHostSockID: function(state: Lobby, hostsockid: string) {
            state.hostsockid = hostsockid
        },
        setPlayerIds: function(state: Lobby, ids: {hostId: string, guestId: string}) {
            state.hostId = ids.hostId
            state.guestId = ids.guestId
        },
        updatePlayerList: function(state: Lobby, playerIds: string[]) {
            console.log('updating playerIds to ', playerIds)
            state.playerIds = playerIds
        }
    }
}