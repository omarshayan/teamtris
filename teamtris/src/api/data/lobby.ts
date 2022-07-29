import * as dotenv from 'dotenv'
import { connect } from 'http2'
import createEndpoint from '../createEndpoint'
import { APIRequestMethod } from '../request'

export interface Lobby {
    code: string
    hostsockid: string
    gameReady: boolean
}

export default () => ({ 
    byCode: createEndpoint<null, Lobby>  ( APIRequestMethod.get,    '/lobbies/:code'),
    list:   createEndpoint<null, Lobby[]>( APIRequestMethod.get,    '/lobbies'),
})