import { useCallback, useEffect, useRef } from 'react';
import { View } from 'react-native';
import { router } from 'expo-router';

import globalStyles from '@/styles/globalStyles';

import { useGetBannerQuery, useGetTopArticleListQuery, useLazyGetArticleListQuery } from '@/services/home.service';
import { useCollectArticleMutation, useUncollectArticleMutation } from '@/services/mine.service';
import { useAppSelector } from '@/store';

import CommonFlatList from '@/components/CommonFlatList';
import ArticleItemRow from '@/components/ArticleItemRow';
import Banner from '@/components/Banner';
import NavBar from '@/components/NavBar';

import { uniformError } from '@/utils/HttpErrUtil';
import { showToast, i18n, i18n2 } from '@/utils/Utility';
import { getRealDP as dp } from '../../../utils/screenUtil';


const renderHeader = () => {

  const {
    data,
    isLoading,
  } = useGetBannerQuery()

  if (isLoading || !data) {
    return
  }

  return (
    <>
      <Banner bannerArr={data} />
      <View style={{ height: dp(20) }} />
    </>
  )
}
const keyExtractor = (item:Article) => (item.isTop?'top-':'') + item.id.toString()

export default function TabHomeScreen() {
  const currentPage = useRef(0)
  const fetchingPage = useRef(0)

  const [fetchArticles, {
    data,
    isLoading,
    isSuccess,
    isFetching,
    isError,
    error,
  }] = useLazyGetArticleListQuery()

  // const {data:tops,refetch} = useGetTopArticleListQuery()

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
    if (isFetching||!hasMore) return
    fetchingPage.current = currentPage.current + 1;
    await fetchArticles(fetchingPage.current)
  }

  const onRefresh = async () => {
    console.log("onRefresh")
    fetchingPage.current = 0
    // await refetch()
    await fetchArticles(fetchingPage.current)
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
  },[isLogin])

  return (
    <>
      <NavBar />
      {/* <PageLoading mask={true}/> */}
      <View style={globalStyles.container}>
        <CommonFlatList
          isLoading={isLoading}
          isSuccess={isSuccess}
          isError={isError}
          hasMoreData={data ? data.curPage < data.pageCount : false}
          error={error && uniformError(error)}

          //cause rerender
          // data={[...tops??[],...data?.datas??[]]}
          data={data?.datas}
          keyExtractor={keyExtractor}
          initialNumToRender={10}
          renderItem={renderItem}
          ListHeaderComponent={renderHeader}
          onEndReached={onEndReached}
          isRefreshing={fetchingPage.current == 0 && isFetching}
          onRefresh={onRefresh}
        />
      </View>
    </>
  );
}
