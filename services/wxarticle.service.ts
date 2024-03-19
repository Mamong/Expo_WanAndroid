import apiSlice from './api'

export const wxApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        // 15.1获取公众号Tabs列表
        getWxArticleTabs: builder.query<Tree[], void>({
            query: () => ({
                url: 'wxarticle/chapters/json'
            }),
            providesTags: ['WXPublisher']
        }),
        // 15.2查看某个公众号历史数据
        getWxArticleList: builder.query<ListResponse<Article>, { page: number, id: number }>({
            query: ({ id, page }) => ({
                url: `wxarticle/list/${id}/${page}/json`
            }),
            // Only have one cache entry because the arg always maps to one string
            serializeQueryArgs: ({ queryArgs, endpointName }) => {
                return `${endpointName}-${queryArgs.id}`
            },
            merge: (current, newItems, other) => {
                if (other.arg.page == 1) {
                    return newItems
                }
                return { ...current, datas: [...current.datas, ...newItems.datas] }
            },
            forceRefetch() {
                return true
            },
        }),
        //15.3 在某个公众号中搜索
    })
})

export const {
    useLazyGetWxArticleTabsQuery,
    useLazyGetWxArticleListQuery,
} = wxApiSlice