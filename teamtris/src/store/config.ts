export interface ConfigState {
    arr: Number
    das: Number
    dcf: Number
    sdf: Number
}



export default {
    state: () => ({
      //  arr: 100,
      //  das: 100,
      //  dcf: 100,
      //  sdf: 1,
    arr: Number,
    das: Number,
    dcf: Number,
    sdf: Number,
    }),
    mutations: {
        setArr: function(state: ConfigState, arr: Number) {
            state.arr = arr
        },
        setDas: function(state: ConfigState, das: Number) {

            state.das = das
        },
        setDcf: function(state: ConfigState, dcf: Number) {
            state.dcf = dcf
        },
        setSdf: function(state: ConfigState, sdf: Number) {
            state.sdf = sdf
        },
    }
}