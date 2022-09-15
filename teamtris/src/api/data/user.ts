import * as dotenv from 'dotenv'
import { connect } from 'http2'
import createEndpoint from '../createEndpoint'
import { APIRequestMethod } from '../request'

export interface User {
    id: number
    username: string
    createdon: string
}

export interface Auth {
    user: User
    token: string
    refresh: string
}

export default () => ({ 
    me: createEndpoint<null, User>  ( APIRequestMethod.get,    '/user/me'),
    info: createEndpoint<null, User>  ( APIRequestMethod.get,    '/user/:id'),
    login:   createEndpoint<null, Auth>( APIRequestMethod.post,    '/auth/login'),
    signup:  createEndpoint<null, User>( APIRequestMethod.post, '/auth/signup')
})