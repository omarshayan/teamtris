import * as dotenv from 'dotenv'
import { connect } from 'http2'

export interface Lobby {
    code: string
    hostsockid: string
    gameReady: boolean
}

export default class LobbyAPI { 

    apiUrl: string 
    server_baseUrl: string | undefined
    constructor() {
        this.apiUrl = '/api/lobbies'
        this.server_baseUrl = import.meta.env.VITE_API_SERVER_BASEURL
        console.log(import.meta.env)
        if (!this.server_baseUrl) {
            throw new Error('Cannot find API url!')
        }
    }

    public async getLobbyList(): Promise<Lobby[]>{

        if (!this.server_baseUrl ) {
            throw new Error('Cannot find API url!')
        }
        const response = await fetch(this.server_baseUrl + '/api/lobbies')
        console.log(response)
        const lobby_list = await response.json() as Lobby[]

        return lobby_list

    }

    public async getLobby(connectCode: string): Promise<Lobby> {
        if (!this.server_baseUrl) {
            throw new Error('Cannot find API url!')
        }
        return fetch(this.server_baseUrl + '/api/lobbies/' + connectCode)
            .then(res => res.json())
            .then(res => {
                return res as Lobby
            })
    }
}