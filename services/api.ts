import { BaseQueryFn, FetchArgs, FetchBaseQueryError, FetchBaseQueryMeta, createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { httpMessage } from '../utils/HttpErrUtil'
import AuthUtil from '@/utils/AuthUtil'

const baseQuery = fetchBaseQuery({
    baseUrl: 'https://www.wanandroid.com',//process.env.EXPO_PUBLIC_BASE_URL,
    prepareHeaders: async (headers, { getState }) => {
        const token = await AuthUtil.getCookie()
        if (token) headers.set('cookie', token)
        headers.set("Content-Type", "multipart/form-data;charset=utf-8")
        headers.set("Accept", "application/json;charset=utf-8")
        return headers;
    },
})
export const myFetchBaseQuery: BaseQueryFn<FetchArgs, unknown, FetchBaseQueryError, {}, FetchBaseQueryMeta> = async (args, api, extraOptions) => {
    try {
        const { method, body } = args
        const newArgs = { ...args }
        //POST转为表单数据
        if (method == 'POST') {
            let data = new FormData();
            for (const i in body) {
                data.append(i, body[i]);
            }
            newArgs.body = data
        }
        const result = await baseQuery(newArgs, api, extraOptions);
        return new Promise<any>((resolve, reject) => {
            // console.log(result)
            if (result.meta?.response) {
                const { status, headers, url } = result.meta.response as Response
                console.log("url:", url)
                if (status != 200) {
                    console.log(result)
                    resolve({ error: { data: httpMessage(status), status: status }, meta: result.meta })
                    return
                }
                //save cookie
                const cookie = headers.get('set-cookie')
                if (cookie) {
                    AuthUtil.saveCookie(cookie)
                    //api.dispatch(setToken(cookie))
                }
            }
            if (result.data) {
                const { data, errorCode, errorMsg } = result.data as Result<any>;
                if (errorCode == 0) {
                    resolve({ data, meta: result.meta })
                } else {
                    resolve({ error: { data: errorMsg, status: errorCode }, meta: result.meta })
                }
            } else {
                resolve(result)
            }

        });
    } catch (error) {
        //console.log(error)
        return { error }
    }
}

const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: myFetchBaseQuery,
    tagTypes: ['User',
        'Article', 'Banner',
        'Hierarchy', 'Project',
        'WXPublisher', 'WXArticle',
        'Navi', 'Course'
    ],
    endpoints: builder => ({}),
})

export default apiSlice
