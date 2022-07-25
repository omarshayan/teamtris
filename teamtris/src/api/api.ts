import LobbyAPI from './data/lobby'
import { APIEndpoint } from './request'
export default class fetchAPI {


    server_baseUrl: string | undefined


    constructor() {
        this.server_baseUrl = import.meta.env.VITE_API_SERVER_BASEURL
        if (!this.server_baseUrl) {
            throw new Error('Cannot find API url!')
        }

    }

    private async invoke(endpoint: APIEndpoint<Entity, Data>) {
            
    }
    
}
