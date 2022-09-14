import * as dotenv from 'dotenv'
import { User } from './user'
import createEndpoint from '../createEndpoint'
import { APIRequestMethod } from '../request'

export interface Score {
    value: number,
    player1: User,
    player2: User,
    category: string,
    createdAt: string,
}


export default () => ({
    submit:  createEndpoint<null, Score>( APIRequestMethod.post, '/scores/submit')
})