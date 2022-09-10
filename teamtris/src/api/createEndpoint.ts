import { EventLoopUtilityFunction } from 'perf_hooks';
import request, { APIQuery, APIRequestMethod, APIResponse, APIResult, APIEndpoint } from './request';


// helpers -------------------------------------------------------------------------------------------------------------

function appendQuery<Entity>(
    path:     string,
    pathKeys: string[],
    query?:   APIQuery | null
): string {

    // shortcut if no query
    if (!query) {
        return path;
    }

    // replace path params with values from query
    const options = {...query};
    for (const key of pathKeys) {
        const val = (options as any)[key];
        console.log('key: ', key);
        console.log('val: ', val);
        if (val) {
            path = path.replace(new RegExp(`:${key}\\b`), val);
            delete (options as any)[key];
        }
    }

    // append remaining query params
    if (Object.keys(options).length > 0) {
        path += '?q=' + encodeURIComponent(JSON.stringify(options));
    }

    console.log('path: ', path)

    return path;


}

function massageResponse<Data>(response: APIResponse): APIResult<Data> {

    if (response.data) {
        return {
            ...response.data as any,
        };
    }

    let message  = 'Request failed';
    if (response.error && response.error.message) {
        message += ' - ' + response.error.message;
    }
    else if (response.status !== 200) {
        message = response.statusText;
    }

    return {success: false, status: response.status, error: message};
}

export default <Entity, Data>(
    method:  APIRequestMethod,
    path:    string
): APIEndpoint<Entity, Data> => {

    const baseURL = import.meta.env.VITE_API_SERVER_BASEURL
    // extract path param names
    const REGEX = /:(\w+)/g;
    const pathKeys: string[] = [];
    // eslint-disable-next-line no-constant-condition
    while (true) {
        const m = REGEX.exec(path);
        if (!m) { break; }
        pathKeys.push(m[1]);
    }

    // return endpoint
    return async (token, query, data, params) => {
        params = {...params};

        // request start time
        const startTime = Date.now();

        // do not throw exception if status is not 200
        if (params.validateStatus === undefined) {
            params.validateStatus = () => true;
        }

        // add auth header if provided
        if (token) {
            params.headers = params.headers || {};
            params.headers.Authorization = `Bearer ${token}`;
        }


        // request URL
        console.log('appending query: ');
        console.log({path, pathKeys, query})
        const url     = baseURL + '/api' + appendQuery(path, pathKeys, query)

        // log request
        const logData = data instanceof FormData
            ? '<form data>'
            : data || ''
        console.log('%capi request:', 'color:blue;', method.toUpperCase(), url, logData)

        // invoke request & parse response
        const response = await request({url, method, data, ...params})
        
        if( !response.data ){
            console.warn('API response has no data')
        }
        const result = massageResponse<Data>(response)


        const elapsed = (Date.now() - startTime) + 'ms'
        const style = result.success ? 'color:green' : 'color:red'

        return result;
    }
}