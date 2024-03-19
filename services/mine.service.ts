import apiSlice from './api'
import { homeApiSlice } from './home.service';

export const mineApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        // 6.1我收藏的文章列表
        getCollectArticleList: builder.query<ListResponse<Article>, number>({
            query: (page = 0) => ({
                url: `lg/collect/list/${page}/json`,
                method: 'GET'
            }),
            transformResponse: (response: ListResponse<Article>) => {
                response.datas.forEach(item => item.collect = true)
                return response;
            },
            serializeQueryArgs: ({ endpointName }) => {
                return endpointName
            },
            merge: (current, newItems, other) => {
                if (other.arg == 0) {
                    return newItems
                }
                return { ...current, datas: [...current.datas, ...newItems.datas] }
            },
            forceRefetch() {
                return true
            },
        }),
        // 6.2首页站内文章收藏 id:文章id
        collectArticle: builder.mutation<void, number>({
            query: (id) => ({
                url: `lg/collect/${id}/json`,
                method: 'POST',
                body: { id }
            }),
            async onQueryStarted(id, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled
                    dispatch(
                        homeApiSlice.util.updateQueryData('getArticleList', 0, (draft) => {
                            const item = draft.datas.find(item => item.id == id)
                            if (item) item.collect = true
                        })
                    )
                } catch (error) {
                    console.log(error)
                }
            },
        }),
        // 6.4.1首页文章取消收藏 id:文章id
        uncollectArticle: builder.mutation<void, number>({
            query: (id) => ({
                url: `lg/uncollect_originId/${id}/json`,
                method: 'POST',
                body: { id }
            }),
            async onQueryStarted(id, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled
                    dispatch(
                        homeApiSlice.util.updateQueryData('getArticleList', id, (draft) => {
                            const item = draft.datas.find(item => item.id == id)
                            if (item) item.collect = false
                        })
                    )
                } catch (error) {
                    console.log(error)
                }
            },
        }),
        //6.4.2我的收藏页-取消收藏
        uncollectMyArticle: builder.mutation<void, { id: number, originId: number | undefined }>({
            query: ({ id, originId = -1 }) => ({
                url: `lg/uncollect/${id}/json`,
                method: 'POST',
                body: { originId }
            }),
            //虽然首页数据也应该刷新，但此处不处理
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled
                    dispatch(
                        mineApiSlice.util.updateQueryData('getCollectArticleList', 0, (draft) => {
                            draft.datas = draft.datas.filter(item => item.id != arg.id)
                        })
                    )
                } catch (error) {
                    console.log(error)
                }
            },
        }),
        //9.2个人积分
        getMyCoinInfo: builder.query<CoinInfo, void>({
            query: () => ({
                url: 'lg/coin/userinfo/json',
                method: 'GET'
            })
        }),
        // 9.3获取个人积分获取列表，需要登录后访问
        getMyCoinList: builder.query<ListResponse<CoinDetail>, number>({
            query: (page = 1) => ({
                url: `lg/coin/list/${page}/json`,
                method: 'GET'
            }),
            serializeQueryArgs: ({ endpointName }) => {
                return endpointName
            },
            merge: (current, newItems, other) => {
                if (other.arg == 1) {
                    return newItems
                }
                return { ...current, datas: [...current.datas, ...newItems.datas] }
            },
            forceRefetch() {
                return true
            },
        }),
    })
})

export const {
    useLazyGetCollectArticleListQuery,
    useCollectArticleMutation,
    useUncollectArticleMutation,
    useUncollectMyArticleMutation,
    useLazyGetMyCoinListQuery,
    useLazyGetMyCoinInfoQuery,
} = mineApiSlice