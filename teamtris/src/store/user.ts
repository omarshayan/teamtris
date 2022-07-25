export interface UserState {
    name: string
}

export default {


  state: () => ({
      name: ''
  }) ,
  mutations: {
    set: function (state: UserState, payload: string) {
      state.name = payload;
    }
  },

}