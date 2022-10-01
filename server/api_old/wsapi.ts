import { EventLoopUtilityFunction } from 'perf_hooks'
import LobbyAPI from './data/lobby'

// import request, { APIQuery, APIEndpoint, APIRequestMethod, APIRequestParams } from './request'
import { AxiosInstance } from 'axios'
import { api } from './utils/axios'
import user from './data/user'

type wsAPIAction = "createlobby" | "sendlobbymessage" 

export interface wsAPIMessage {
    action: wsAPIAction,
    message: string
}

class WebSocketAPI {
    wss_url: string
    api: AxiosInstance


    constructor() {
        this.wss_url= import.meta.env.VITE_WEBSOCKET_SERVER_BASEURL
        this.api = api
        if (!this.wss_url) {
            throw new Error('Cannot find API url!')
        }

    }

    public connect(): WebSocket {
        console.log(this.wss_url)
        console.log(typeof this.wss_url)
        var socket = new WebSocket(this.wss_url)
        socket.addEventListener("error", e => {
            console.log("encountered error: /n", e)
            setTimeout(() => this.connect())
        })
        return socket
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

    public login = async (username: string, password: string): Promise<any> => {
        var res
        await api.post('/auth/login', {username, password})
        .then(response => {
            console.log(response)

            const user = response.data.data.user

            console.log(user)
            return user
        })
        .catch(error => {
          console.log(error)
          res = error
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

export default new WebSocketAPI()