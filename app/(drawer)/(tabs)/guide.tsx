import { useCallback, useRef, useState } from 'react';
import { Text, View, FlatList, Pressable, RefreshControl, StyleSheet, ViewToken } from 'react-native';
import { router } from 'expo-router';

import { getRealDP as dp } from '../../../utils/screenUtil';
import { getChapterBgColor, i18n, i18n2 } from '@/utils/Utility';
import NavBar from '@/components/NavBar';
import { Color } from '@/constants/Colors';
import globalStyles from '@/styles/globalStyles';
import { useGetGuideDataQuery } from '@/services/other.service';
import { useAppSelector } from '@/store';


const handleScrollToItemByIndex = (componentRef: any, index: number) => {
  if (!componentRef || index < 0) {
    return;
  }
  componentRef.scrollToIndex({
    animated: true,
    index: index,
    viewOffset: 0,
    viewPosition: 0,
  });
}

const renderRightItem = ({ item }: { item: Navi }) => {

  return (
    <View style={styles.itemWrapper}>
      <View style={styles.itemContent}>
        <Text style={styles.title}>{item.name}</Text>
        <View style={styles.content}>
          {item.articles.map(el => (
            <View key={el.id} style={{ backgroundColor: Color.WHITE }}>
              <Pressable
                style={({ pressed }) => [
                  styles.tabItemWrapper,
                  {
                    backgroundColor: getChapterBgColor(el.id),
                    opacity: pressed ? 0.6 : 1.0
                  },
                ]}
                onPress={() => {
                  router.navigate({
                    pathname: '/webview', params: {
                      title: el.title,
                      url: el.link,
                    }
                  });
                }}>
                <Text style={styles.tabItemText}>{el.title}</Text>
              </Pressable>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

//列表滚动变化监听配置
const VIEWABILITY_CONFIG = {
  minimumViewTime: 0,
  viewAreaCoveragePercentThreshold: 0,
  waitForInteraction: true,
};

export default function TabGuideScreen() {
  const themeColor = useAppSelector((state) => state.user.themeColor)
  const isLeftPress = useRef(false)
  const timer = useRef<NodeJS.Timeout | null>(null)

  const leftFlatListRef = useRef<FlatList>(null)
  const rightFlatListRef = useRef<FlatList>(null)
  const [selectIndex, setSelectIndex] = useState(0)

  const { data: guideData,
    isLoading,
    isFetching,
    isError,
    error,
    refetch } = useGetGuideDataQuery()


  const handleLeftItemPress = async (index: number) => {
    isLeftPress.current = true
    setSelectIndex(index)
    handleScrollToItemByIndex(leftFlatListRef.current, index - 5);
    handleScrollToItemByIndex(rightFlatListRef.current, index);
  }


  const renderLeftItem = ({ item, index }: { item: Navi, index: number }) => {
    return (
      <Pressable
        style={
          selectIndex === index
            ? styles.leftBtnChecked
            : styles.leftBtnUnChecked
        }
        onPress={() => handleLeftItemPress(index)}>
        <Text
          style={
            selectIndex === index
              ? [styles.leftTextChecked, { color: themeColor }]
              : styles.leftTextUnChecked
          }>
          {item.name}
        </Text>
      </Pressable>
    );
  }

  const _onViewableItemsChanged = useCallback((value: {
    viewableItems: ViewToken[];
    changed: ViewToken[];
  }) => {
    if (isLeftPress.current) {
      timer.current && clearTimeout(timer.current);
      timer.current = setTimeout(() => {
        isLeftPress.current = false;
      }, 1000);
      return;
    }
    const { viewableItems } = value;
    const index = viewableItems[0].index;
    setSelectIndex(index ?? 0);
    handleScrollToItemByIndex(leftFlatListRef.current, index ?? 5 - 5);
  }, []);


  return (
    <View style={globalStyles.container}>
      <NavBar />
      <View style={{ flex: 1, flexDirection: 'row' }}>
        <View style={styles.leftContent}>
          <FlatList
            ref={leftFlatListRef}
            style={{ backgroundColor: Color.GUIDE_BG }}
            keyExtractor={(item, index) => index.toString()}
            data={guideData}
            renderItem={renderLeftItem}
            showsVerticalScrollIndicator={false}
          />
        </View>
        <View style={styles.rightContent}>
          <FlatList
            ref={rightFlatListRef}
            data={guideData}
            keyExtractor={(item, index) => index.toString()}
            ListHeaderComponent={() => <View style={{ height: dp(20) }} />}
            renderItem={renderRightItem}
            onViewableItemsChanged={_onViewableItemsChanged}
            viewabilityConfig={VIEWABILITY_CONFIG}
            refreshControl={
              <RefreshControl
                refreshing={isFetching}
                onRefresh={refetch}
                tintColor={themeColor}
                colors={[themeColor]}
                title={i18n2('footer_load_more')}
                titleColor={Color.TEXT_LIGHT}
              />
            }
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  itemWrapper: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: Color.DEFAULT_BG,
  },
  itemContent: {
    width: dp(500),
    borderRadius: dp(30),
    backgroundColor: Color.WHITE,
    alignItems: 'center',
    marginBottom: dp(20),
    paddingHorizontal: dp(20),
    paddingTop: dp(20),
    paddingBottom: dp(10),
    justifyContent: 'space-between',
  },
  title: {
    fontSize: dp(32),
    color: Color.TEXT_MAIN,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  content: {
    width: dp(460),
    flexWrap: 'wrap',
    flexDirection: 'row',
    paddingTop: dp(20),
  },
  tabItemWrapper: {
    paddingHorizontal: dp(30),
    paddingVertical: dp(10),
    borderRadius: dp(30),
    marginRight: dp(15),
    marginBottom: dp(20),
  },
  tabItemText: {
    fontSize: dp(28),
    color: Color.WHITE,
  },
  leftContent: {
    width: dp(200),
  },
  rightContent: {
    flex: 1,
    width: dp(500),
  },
  leftBtnChecked: {
    height: dp(98),
    width: dp(200),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Color.WHITE,
  },
  leftBtnUnChecked: {
    height: dp(98),
    width: dp(200),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Color.GUIDE_BG,
  },
  leftTextChecked: {
    fontSize: dp(26),
  },
  leftTextUnChecked: {
    fontSize: dp(26),
    color: Color.TEXT_MAIN,
  },
});
