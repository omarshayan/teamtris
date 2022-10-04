export interface UserState {
  data: any | null
  name: string
}

export default {

  state: () => ({
    data: null,
    name: "Anonymous"
  }),

  mutations: {
    login: function (state: UserState, payload: any) {
      state.data = payload;
    },
    setName: function(state: UserState, name: string) {
      state.name = name;
    }
  },
}