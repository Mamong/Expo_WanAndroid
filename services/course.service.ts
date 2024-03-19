import apiSlice from './api'

export const courseApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        // 18.1教程列表
        getCourseList: builder.query<Tree[], void>({
            query: () => ({
                url: 'chapter/547/sublist/json'
            }),
            providesTags: ['Course']
        }),
        // 18.2单个教程下所有文章
        getCourseArticleList: builder.query<ListResponse<Article>, { page: number, id: number }>({
            query: ({ id, page }) => ({
                url: `article/list/${page}/json?cid=${id}&order_type=1`
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
    })
})

export const {
    useGetCourseArticleListQuery,
    useLazyGetCourseArticleListQuery,
} = courseApiSlice