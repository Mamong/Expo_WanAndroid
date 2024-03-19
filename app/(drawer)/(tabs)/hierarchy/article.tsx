import { useState } from 'react';
import { useWindowDimensions } from 'react-native';
import { TabView, TabBar } from 'react-native-tab-view';
import { useLocalSearchParams } from 'expo-router';

import NavBar from '@/components/NavBar';
import { getRealDP as dp } from '../../../../utils/screenUtil';

import { Color } from '@/constants/Colors';
import { useAppSelector } from '@/store';
import ArticleFlatList from '@/components/ArticleFlatList';


export default function HierarchyArticleScreen() {
    const layout = useWindowDimensions();
    const params = useLocalSearchParams()

    const title = params.title.toString() ?? ""
    const selected = params.selected as unknown as number
    const articleTabs = params.articleTabs.toString() ?? ""
    const data = JSON.parse(articleTabs) as Tree[]

    const [index, setIndex] = useState(() => data.findIndex(item => item.id == selected));
    const themeColor = useAppSelector((state) => state.user.themeColor)

    const [routes] = useState(()=>data.map(item => {
        return { key: item.name, title: item.name, id: item.id }
      }))

    const renderScene = ({ route }: { route: { key: string, title: string, id: number } }) =>
    <ArticleFlatList source="article" chapterId={route.id} />;

    const renderTabBar = (props: any) => <TabBar {...props}

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
    />

    return (
        <>
            <NavBar options={{ title }} />
            <TabView lazy
                renderTabBar={renderTabBar}
                navigationState={{ index, routes }}
                renderScene={renderScene}
                onIndexChange={setIndex}
                initialLayout={{ width: layout.width }}
            />
        </>
    );
}