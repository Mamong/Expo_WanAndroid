import { SerializedError } from "@reduxjs/toolkit";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";

export function httpMessage(code: number) {
    const codeMap: Record<number, string> = {
        400: '请求错误(400)',
        401: '未授权，请重新登录(401)',
        403: '拒绝访问(403)',
        404: '请求出错(404)',
        408: '请求超时(408)',
        500: '服务器错误(500)',
        501: '服务未实现(501)',
        502: '网络错误(502)',
        503: '服务不可用(503)',
        504: '网络超时(504)',
        505: 'HTTP版本不受支持(505)',
    }
    return codeMap[code]
}

export function uniformError(error: FetchBaseQueryError | SerializedError) {
    console.log(error)
    let message = ''
    let status = -9999
    if ('status' in error) {
        // you can access all properties of `FetchBaseQueryError` here
        message = 'error' in error ? error.error : JSON.stringify(error.data)
        if (typeof error.status == 'number') {
            status = error.status
        }

    } else if (error.message) {
        // you can access all properties of `SerializedError` here
        message = error.message
    }
    return { status, message }
}