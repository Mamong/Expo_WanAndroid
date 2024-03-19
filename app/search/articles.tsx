import { useCallback, useEffect, useRef } from 'react';
import { View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

import CommonFlatList from '@/components/CommonFlatList';
import globalStyles from '@/styles/globalStyles';
import ArticleItemRow from '@/components/ArticleItemRow';
import NavBar from '@/components/NavBar';
import { uniformError } from '@/utils/HttpErrUtil';
import { useAppSelector } from '@/store';
import { showToast, i18n, i18n2 } from '@/utils/Utility';
import { getRealDP as dp } from '../../utils/screenUtil';
import { useCollectArticleMutation, useUncollectArticleMutation } from '@/services/mine.service';
import { useLazyGetSearchArticleQuery } from '@/services/other.service';


export default function ArticlesScreen() {
  const params = useLocalSearchParams()
  const keyword = params?.key?.toString() ?? ''

  const currentPage = useRef(0)
  const fetchingPage = useRef(0)

  const [fetchArticles, {
    data,
    isLoading,
    isSuccess,
    isFetching,
    isError,
    error,
  }] = useLazyGetSearchArticleQuery()

  const isLogin = useAppSelector((state) => state.user.isLogin)
  const [collectArticle, { isLoading: isCollecting }] = useCollectArticleMutation()
  const [uncollectArticle, { isLoading: isCanceling }] = useUncollectArticleMutation()

  useEffect(() => {
    console.log('index第一次渲染时调用')
    onRefresh()
  }, [])

  const onEndReached = async () => {
    console.log("onEndReached")
    const hasMore = data ? data.curPage < data.pageCount : false
    if (isFetching || !hasMore) return
    fetchingPage.current = currentPage.current + 1;
    await fetchArticles({ k: keyword, page: fetchingPage.current })
  }

  const onRefresh = async () => {
    console.log("onRefresh")
    fetchingPage.current = 0
    await fetchArticles({ k: keyword, page: fetchingPage.current })
  }

  useEffect(() => {
    if (isSuccess) {
      currentPage.current = fetchingPage.current
    }
  }, [isFetching])

  console.log(isLoading, isSuccess, isError)

  const renderItem = useCallback(({ item }: { item: Article }) => {
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
        item={item}
        onCollectPress={onCollectionPress}
      />
    )
  }, [isLogin])

  return (
    <>
      <NavBar options={{
        title: keyword
      }} />
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
          ListHeaderComponent={() => <View style={{ height: dp(20) }} />}
          onEndReached={onEndReached}
          isRefreshing={fetchingPage.current == 0 && isFetching}
          onRefresh={onRefresh}
        />
      </View>
    </>
  );
}