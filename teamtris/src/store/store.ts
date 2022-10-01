import { InjectionKey } from 'vue'
import { Store, createStore, useStore as baseUseStore} from 'vuex'

import configModule, { ConfigState } from './config'
import lobbyModule, { LobbyState } from './lobby'
import gameModule, { GameState } from './game'
import userModule, { UserState } from './user'

export interface State {
    user: UserState
    config: ConfigState
    lobby: LobbyState
    game: GameState
}

export const key: InjectionKey<Store<State>> = Symbol()

export const store = createStore<State>({
    modules: {
        user: userModule,
        config: configModule,
        lobby: lobbyModule,
        game: gameModule
    }
})

export function useStore() {
    return baseUseStore(key)
}