export interface GameState {
    ready: boolean
    active: boolean
    disconnected: boolean
}



export default {
    state: () => ({
        ready: false,
        active: false,
        disconnected: true,

    }),
    mutations: {
        ready: function(state: GameState) {

            state.ready = true
        },
        start: function(state: GameState) {
            if(!state.ready) {
                throw new Error('Cannot start, gamestate is not ready!')
            }
            state.active = true
        },
        suspend: function(state: GameState, dcf: number) {
            state.active = false
        },
    }
}