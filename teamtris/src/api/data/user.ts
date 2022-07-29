import * as dotenv from 'dotenv'
import { connect } from 'http2'
import createEndpoint from '../createEndpoint'
import { APIRequestMethod } from '../request'

export interface User {
    name: string
    token: string
}

export default () => ({ 
    info: createEndpoint<null, User>  ( APIRequestMethod.get,    '/users/me'),
    login:   createEndpoint<null, User>( APIRequestMethod.post,    '/auth/login'),
    signup:  createEndpoint<null, User>( APIRequestMethod.post, '/auth/signup')
})