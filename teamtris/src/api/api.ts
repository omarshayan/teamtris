import { EventLoopUtilityFunction } from 'perf_hooks'
import LobbyAPI from './data/lobby'
import request, { APIEndpoint, APIRequestMethod, APIRequestParams } from './request'
import { AxiosInstance } from 'axios'
import { api } from './utils/axios'

class fetchAPI {


    server_baseUrl: string | undefined
    api: AxiosInstance

    constructor() {
        this.server_baseUrl = import.meta.env.VITE_API_SERVER_BASEURL
        this.api = api
        if (!this.server_baseUrl) {
            throw new Error('Cannot find API url!')
        }

    }

    public async invoke<Entity, Data>(endpoint: APIEndpoint<Entity, Data>, token?: string | undefined, query?: string[], data?: any, params?: APIRequestParams) {
            const result = await endpoint(token, query, data, params)
            console.log('invocation result: ', result)
            if (result.success){
                return result.data
            }
            else return
    }

    public login = async (username: string, password: string) => {
        api.post('/auth/login', {username, password})
        .then(response => {
            console.log(response)
        })
        .catch(error => {
          console.log(error)
        })
    }

    public register = async (username: string, password: string) => {
        api.post('/auth/signup', {username, password})
        .then(response => {
            console.log(response)
        })
        .catch(error => {
          console.log(error)
        })
    }
}

export default new fetchAPI()