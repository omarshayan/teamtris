export interface UserState {
  data: any | null
}

export default {

  state: () => ({
    data: null
  }),

  mutations: {
    login: function (state: UserState, payload: any) {
      state.data = payload;
    }
  },
}