import { BaseQueryApi, FetchBaseQueryError } from '@reduxjs/toolkit/query'
import apiSlice, { myFetchBaseQuery } from './api'


export const homeApiSlice = apiSlice.injectEndpoints({
    overrideExisting: true,
    endpoints: builder => ({
        // 1.1首页文章列表
        getArticleList: builder.query<ListResponse<Article>, number>({
            // query: (page = 0) => ({
            //     url: `article/list/${page}/json?page_size=10`,
            //     method: 'GET'
            // }),
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
            queryFn: async (arg, queryApi, extraOptions, baseQuery) => {

                const fetchList = baseQuery({
                    url: `article/list/${arg}/json?page_size=10`,
                    method: 'GET'
                })
                const fetchTops = baseQuery({
                    url: `article/top/json`,
                    method: 'GET'
                })
                if (arg == 0) {
    
                    const result = await Promise.all([fetchList,fetchTops])
                    if (result[0].error)
                        return { error: result[0].error};

                    const data = result[0].data as ListResponse<Article>;
                    const data2 = result[1].data as Article[]
                    data2.forEach(element => {
                        element.isTop = true
                    });
                    data.datas = data2.concat(data.datas)

                    return {data} 
                } else {
                    const result = await fetchList
                    if (result.error)
                        return { error: result.error };

                    const data = result.data as ListResponse<Article>;
                    return { data };
                }
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
            },
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