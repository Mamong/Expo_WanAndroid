import { useEffect, useRef } from 'react';
import { View } from 'react-native';
import { router } from 'expo-router';

import { getRealDP as dp } from '../utils/screenUtil';
import CommonFlatList from '@/components/CommonFlatList';
import globalStyles from '@/styles/globalStyles';
import ArticleItemRow from '@/components/ArticleItemRow';
import { uniformError } from '@/utils/HttpErrUtil';
import { useLazyGetHierarchyArticleListQuery, useLazyGetProjectArticleListQuery } from '@/services/other.service';
import { Color } from '@/constants/Colors';
import { useLazyGetWxArticleListQuery } from '@/services/wxarticle.service';
import { useAppSelector } from '@/store';
import { useCollectArticleMutation, useUncollectArticleMutation } from '@/services/mine.service';
import { i18n, i18n2, showToast } from '@/utils/Utility';


export default function ArticleFlatList({
    chapterId,
    source }: {
        chapterId: number,
        source: 'wxarticle' | 'project' | 'article'
    }) {

    const currentPage = useRef(1)
    const fetchingPage = useRef(1)

    const [fetchArticles, {
        data,
        isLoading,
        isSuccess,
        isFetching,
        isError,
        error,
    }] = source == 'wxarticle' ?
            useLazyGetWxArticleListQuery() :
            (source == 'project' ? useLazyGetProjectArticleListQuery() :
                useLazyGetHierarchyArticleListQuery())

    const isLogin = useAppSelector((state) => state.user.isLogin)
    const [collectArticle, { isLoading: isCollecting }] = useCollectArticleMutation()
    const [uncollectArticle, { isLoading: isCanceling }] = useUncollectArticleMutation()


    useEffect(() => {
        console.log('第一次渲染时调用')
        onRefresh()
    }, [])


    const onEndReached = async () => {
        console.log("onEndReached")
        const hasMore = data ? data.curPage < data.pageCount : false
        if (isFetching || !hasMore) return
        fetchingPage.current = currentPage.current + 1;
        await fetchArticles({ id: chapterId, page: fetchingPage.current })
    }

    const onRefresh = async () => {
        console.log("onRefresh")
        fetchingPage.current = 1
        await fetchArticles({ id: chapterId, page: fetchingPage.current })
    }

    useEffect(() => {
        if (isSuccess) {
            currentPage.current = fetchingPage.current
        }
    }, [isFetching])

    console.log(chapterId, isLoading, isSuccess, isError)

    const renderItem = ({ item }: { item: Article }) => {
        const onCollectionPress = () => {
            if (!isLogin) {
                showToast(i18n2('tips_not_loggin'));
                return router.navigate('/user/login');
            }
            if (item.collect) {
                uncollectArticle(item.id)
            } else {
                collectArticle(item.id)
            }
        }
        return (
            <ArticleItemRow
                isWxArticle={source == 'wxarticle'}
                item={item}
                onCollectPress={onCollectionPress}
            />
        )
    }

    return (
        <>
            {/* <PageLoading mask={true}/> */}
            <View style={globalStyles.container}>
                <CommonFlatList
                    isLoading={isLoading}
                    isSuccess={isSuccess}
                    isError={isError}
                    hasMoreData={data ? data.curPage < data.pageCount : false}
                    error={error && uniformError(error)}

                    data={data?.datas ?? []}
                    keyExtractor={item => item.id.toString()}
                    initialNumToRender={10}
                    renderItem={renderItem}
                    ListHeaderComponent={() => <View style={{ height: dp(20), backgroundColor: Color.DEFAULT_BG }} />}
                    onEndReached={onEndReached}
                    isRefreshing={fetchingPage.current == 1 && isFetching}
                    onRefresh={onRefresh}
                />
            </View>
        </>
    );
}