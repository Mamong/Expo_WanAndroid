import apiSlice from './api'


export const homeApiSlice = apiSlice.injectEndpoints({
    overrideExisting: true,
    endpoints: builder => ({
        // 1.1首页文章列表
        getArticleList: builder.query<ListResponse<Article>, number>({
            query: (page = 0) => ({
                url: `article/list/${page}/json?page_size=10`,
                method: 'GET'
            }),
            // Only have one cache entry because the arg always maps to one string
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
        // 1.2首页轮播
        getBanner: builder.query<Banner[], void>({
            query: () => ({
                url: 'banner/json',
                method: 'GET'
            }),
            providesTags: ['Banner']
        }),
        // 1.3常用网站
        getOftenUsedWebsites: builder.query({
            query: () => ({
                url: 'friend/json'
            })
        }),
        // 1.4搜索热词
        getSearchHotKey: builder.query<Hotkey[], void>({
            query: () => ({
                url: 'hotkey/json'
            })
        }),
        //1.5 置顶文章
        getTopArticleList: builder.query<Article[], void>({
            query: () => ({
                url: 'article/top/json',
                method: 'GET'
            }),
            transformResponse: (response: Article[]) => {
                response.forEach(element => {
                    element.isTop = true
                });
                return response
            }
            //providesTags: ['Article']
        }),
    })
})

export const {
    useGetBannerQuery,
    useGetArticleListQuery,
    useLazyGetArticleListQuery,
    useGetSearchHotKeyQuery,
    useGetTopArticleListQuery,
} = homeApiSlice

export const {
    getArticleList
} = homeApiSlice.endpoints