import { InjectionKey } from 'vue'
import { Store, createStore } from 'vuex'
import configModule, { ConfigState } from './config'

export interface State {
    Config: ConfigState
}

export const key: InjectionKey<Store<State>> = Symbol()

export const store = createStore<State>({
    modules: {
        config: configModule
    }
})