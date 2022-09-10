import { EventLoopUtilityFunction } from 'perf_hooks'
import LobbyAPI from './data/lobby'

import request, { APIQuery, APIEndpoint, APIRequestMethod, APIRequestParams } from './request'
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

    public async invoke<Entity, Data>(endpoint: APIEndpoint<Entity, Data>, token?: string | undefined, query?: APIQuery, data?: any, params?: APIRequestParams) {
            const result = await endpoint(token, query, data, params)
            console.log('invocation result: ', result)

            // TODO: format api results 
            // if (result.success){
            //     return result.data
            // }
            // else return
            return result
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

    public register = async (username: string, password: string): Promise<any> => {
        var res
        await api.post('/auth/signup', {username, password})
        .then(response => {
            console.log('logging response')

            console.log(response)
            res = response
        })
        .catch(error => {
            console.log('logging error')
            console.log(error)
            res = error
        })

        return res
    }
}

export default new fetchAPI()