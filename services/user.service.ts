import { FetchBaseQueryMeta } from '@reduxjs/toolkit/query';
import apiSlice from './api'

export const userApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        /**
         * 5.1 登录
         * @params username,password
         */
        login: builder.mutation<UserInfo, Partial<UserInfo>>({
            query: (body) => ({
                url: '/user/login',
                method: 'POST',
                body
            }),
            invalidatesTags: ['Article']
        }),
        /**
         * 5.2注册
         * @params username,password,repassword
         */
        register: builder.mutation<UserInfo, Partial<UserInfo>>({
            query: (body) => ({
                url: '/user/register',
                method: 'POST',
                body
            }),
            invalidatesTags: ['Article']
        }),
        // 5.3退出登录
        logout: builder.query<void, void>({
            query: () => ({
                url: '/user/logout/json',
                method: 'GET',
            }),
        })
    })
})

export const {
    useRegisterMutation,
    useLoginMutation,
    useLazyLogoutQuery
} = userApiSlice