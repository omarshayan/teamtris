import * as dotenv from 'dotenv'
import { connect } from 'http2'
import createEndpoint from '../createEndpoint'
import { APIRequestMethod } from '../request'
import { User } from '@/api/data/user'

export interface Lobby {
    code: string
    hostsockid: string
    gameReady: boolean
    players: User[]
    playerIds: string[]
}

export default () => ({ 
    byCode: createEndpoint<null, Lobby>  ( APIRequestMethod.get,    '/lobbies/:code'),
    list:   createEndpoint<null, Lobby[]>( APIRequestMethod.get,    '/lobbies'),
})