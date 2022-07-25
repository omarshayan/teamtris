import { InjectionKey } from 'vue'
import { Store, createStore, useStore as baseUseStore} from 'vuex'
import configModule, { ConfigState } from './config'
import lobbyModule from './lobby'
import gameModule, { GameState } from './game'
import { Lobby } from '@/api/data/lobby'

export interface State {
    config: ConfigState
    lobby: Lobby
    game: GameState
}

export const key: InjectionKey<Store<State>> = Symbol()

export const store = createStore<State>({
    modules: {
        config: configModule,
        lobby: lobbyModule,
        game: gameModule
    }
})

export function useStore() {
    return baseUseStore(key)
}