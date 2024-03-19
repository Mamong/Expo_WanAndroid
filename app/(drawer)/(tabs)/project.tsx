import React,{ useCallback, useEffect, useState } from 'react';
import { useWindowDimensions } from 'react-native';
import { TabView, TabBar } from 'react-native-tab-view';

import NavBar from '@/components/NavBar';
import { getRealDP as dp } from '../../../utils/screenUtil';

import { useLazyGetProjectTreeQuery } from '@/services/other.service';
import { Color } from '@/constants/Colors';
import { useAppSelector } from '@/store';
import ArticleFlatList from '@/components/ArticleFlatList';



export default function TabProjecyScreen() {
  const layout = useWindowDimensions();
  const [fetchTree, {data,isLoading, isFetching, isError, isSuccess, error} ] = useLazyGetProjectTreeQuery()

  const [index, setIndex] = React.useState(0);
  const themeColor = useAppSelector((state) => state.user.themeColor)

  const [routes, setRoutes] = useState<{ key: string, title: string, id: number }[]>([])

  useEffect(() => {
    fetchTree()
  }, [])

  useEffect(() => {
    if (isSuccess && data) {
      setRoutes(data.map(item => {
        return { key: item.name, title: item.name, id: item.id }
      }))
    }
  }, [isSuccess])

  const renderScene = useCallback(({ route }: { route: { key: string, title: string, id: number } }) =>
    <ArticleFlatList source="project" chapterId={route.id} />,[]);

  const renderTabBar = useCallback((props: any) => <TabBar {...props}
    scrollEnabled={true}
    activeColor={Color.WHITE}
    inactiveColor={Color.TEXT_TAB_INACTIVE}
    tabStyle={{
      height: dp(70),
      width: dp(270),
    }}
    labelStyle={{
      fontSize: dp(28),
      paddingBottom: dp(25),
      fontWeight: 'bold',
    }}
    indicatorStyle={{
      height: dp(4),
      backgroundColor: Color.WHITE,
      width: dp(100),
      marginLeft: dp(85),
    }}
    style={{
      backgroundColor: themeColor,
      height: dp(80),
    }}
  />,[themeColor])

  return (
    <>
      <NavBar />
      {isSuccess && <TabView lazy
        renderTabBar={renderTabBar}
        navigationState={{ index, routes: routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
      />}
    </>
  );
}