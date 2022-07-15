import { InjectionKey } from 'vue'
import { Store, createStore, useStore as baseUseStore} from 'vuex'
import configModule, { ConfigState } from './config'
import lobbyModule from './lobby'
import { Lobby } from '@/api/lobby'

export interface State {
    config: ConfigState
    lobby: Lobby
}

export const key: InjectionKey<Store<State>> = Symbol()

export const store = createStore<State>({
    modules: {
        config: configModule,
        lobby: lobbyModule
    }
})

export function useStore() {
    return baseUseStore(key)
}