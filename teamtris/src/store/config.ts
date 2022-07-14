export interface ConfigState {
    arr: number
    das: number
    dcf: number
    sdf: number
}



export default {
    state: () => ({
       arr: 100,
       das: 100,
       dcf: 100,
       sdf: 1,
    // arr: number,
    // das: number,
    // dcf: number,
    // sdf: number,
    }),
    mutations: {
        setArr: function(state: ConfigState, arr: number) {
            state.arr = arr
        },
        setDas: function(state: ConfigState, das: number) {

            state.das = das
        },
        setDcf: function(state: ConfigState, dcf: number) {
            state.dcf = dcf
        },
        setSdf: function(state: ConfigState, sdf: number) {
            state.sdf = sdf
        },
    }
}