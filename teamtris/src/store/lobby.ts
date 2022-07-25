import { Lobby } from '@/api/data/lobby'


export default {
    state: () => ({
       code: '',
       hostsockid: '',

    // arr: number,
    // das: number,
    // dcf: number,
    // sdf: number,
    }),
    mutations: {
        setConnectCode: function(state: Lobby, code: string) {
            state.code = code
        },
    }
}