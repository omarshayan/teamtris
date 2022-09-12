
import axios, {
    AxiosError,
}                      from 'axios';


// types ---------------------------------------------------------------------------------------------------------------

export enum APIRequestMethod {
    get    = 'get',
    post   = 'post',
    put    = 'put',
    patch  = 'patch',
    delete = 'delete',
}


export interface APIQuery {
    id?:       string;
    code?:     string;
    username?: string;
    password?: string;
}


export interface APIRequestParams {
    url?:                string;
    method?:             APIRequestMethod;
    data?:               any;
    headers?:            {[key: string]: string};
    responseType?:       ResponseType;
    validateStatus?:     (status: number) => boolean;
}

export interface APIResponse {
    status:      number;
    statusText:  string;
    error?:      Error;
    data?:       any;
}

export interface Session {
    token:         string;
    user:          string;
}


export interface APIResultBase<Status, Success> {
    path?:       string;
    status:      Status;
    success:     Success;
    message?:     string;
    warning?:    string;
    error?:       string;
}

export interface APIResultSuccess<Data> extends APIResultBase<200, true> {
    type?:        string;
    data:        Data;
    session?:    Session;
}

export type APIResultFailure = APIResultBase<number, false>;

export type APIResult<Data> = APIResultSuccess<Data> | APIResultFailure;

export type APIEndpoint<Entity, Data> =
    (
        token?:  string,
        query?:  APIQuery,
        data?:   any,
        params?: APIRequestParams
    ) => Promise<APIResult<Data>>;


// request -------------------------------------------------------------------------------------------------------------

export default async (params: APIRequestParams): Promise<APIResponse> => {

    const {url, method, data} = params;
    const methodU = method ?? APIRequestMethod.get;

    console.log('Request:', methodU.toUpperCase(), url, data ? ('<data>') : '');


    // invoke request & handle error
    try {
        return await axios({
            responseType: 'json',
            method: methodU,
            url, data,

        });
    } catch (error: any) {

        if ((error as AxiosError).response) {
            // tslint:disable-next-line: no-shadowed-variable
            const {data, status, statusText} = (error as AxiosError).response!;
            console.warn('response error -', {status, statusText, data});
        }
        else {
            console.warn('request error -', error);
        }
        return {
            error,
            status:     error.response?.status     ?? -1,
            statusText: error.response?.statusText ?? 'Unknown request error'
        };
    }
};