import { User } from '@/api/data/user'

export interface UserState {
  data: User | null
}

export default {

  state: () => ({
    data: null
  }),

  mutations: {
    login: function (state: UserState, payload: User) {
      state.data = payload;
    }
  },
}