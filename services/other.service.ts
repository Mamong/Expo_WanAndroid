import apiSlice from './api'

export const mineApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        //2.1体系数据
        getHierarchy: builder.query<Tree[], void>({
            query: () => ({
                url: 'tree/json'
            }),
            providesTags: ['Hierarchy']
        }),
        //2.2体系下的文章
        getHierarchyArticleList: builder.query<ListResponse<Article>, { page: number, id: number }>({
            query: ({ page, id }) => ({
                url: `article/list/${page}/json?cid=${id}`
            }),
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
        //2.3按照作者昵称搜索文章


        // 3.1导航数据
        getGuideData: builder.query<Navi[], void>({
            query: () => ({
                url: 'navi/json'
            }),
            providesTags: ['Navi']
        }),
        // 4.1获取项目分类数据
        getProjectTree: builder.query<Tree[], void>({
            query: () => ({
                url: 'project/tree/json'
            }),
            providesTags: ['Project']
        }),
        // 4.2获取项目分类下的文章
        getProjectArticleList: builder.query<ListResponse<Article>, { page: number, id: number }>({
            query: ({ page, id }) => ({
                url: `project/list/${page}/json?cid=${id}`
            }),
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

        //17 工具列表
        getToolList: builder.query({
            query: () => ({
                url: 'tools/list/json',
            })
        }),

        /**
         * 7.1 根据关键词搜索文章
         * @param k 关键词
         * @param page 页码
         */
        getSearchArticle: builder.query<ListResponse<Article>, { k: string, page: number }>({
            query: ({ k, page = 0 }) => ({
                url: `article/query/${page}/json`,
                method: 'POST',
                body: { k }
            }),
            // transformResponse:(response:ListResponse<Article>)=>{
            //     console.log(response.datas)
            //     return response
            // },
            serializeQueryArgs: ({ queryArgs, endpointName }) => {
                return `${endpointName}-${queryArgs.k}`
            },
            merge: (current, newItems, other) => {
                if (other.arg.page == 0) {
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
    useGetHierarchyQuery,
    useLazyGetHierarchyArticleListQuery,
    useLazyGetProjectTreeQuery,
    useLazyGetProjectArticleListQuery,
    useGetGuideDataQuery,
    useLazyGetSearchArticleQuery
} = mineApiSlice

