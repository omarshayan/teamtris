import * as dotenv from 'dotenv'
import { connect } from 'http2'
import createEndpoint from '../createEndpoint'
import { APIRequestMethod } from '../request'

export interface Lobby {
    code: string
    hostsockid: string
    gameReady: boolean
}

export default (baseUrl: string) => ({ 
    byCode: createEndpoint<null, Lobby>  (baseUrl, APIRequestMethod.get,    '/lobbies/:id'),
    list:   createEndpoint<null, Lobby[]>(baseUrl, APIRequestMethod.get,    '/lobbies'),
})