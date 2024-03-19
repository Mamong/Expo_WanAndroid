import { useEffect } from 'react';
import { Pressable, StyleSheet } from 'react-native';

import { getRealDP as dp } from '../../../../utils/screenUtil';
import { Text, View } from '@/components/Themed';
import { getChapterBgColor, i18n, i18n2 } from '@/utils/Utility';
import NavBar from '@/components/NavBar';
import { useGetHierarchyQuery } from '@/services/other.service';
import CommonFlatList from '@/components/CommonFlatList';
import globalStyles from '@/styles/globalStyles';
import { uniformError } from '@/utils/HttpErrUtil';
import { Color } from '@/constants/Colors';
import { router } from 'expo-router';

const renderItem = ({ item }: { item: Tree }) => {
  return (
    <View style={styles.itemWrapper}>
      <View style={styles.itemContent}>
        <Text style={styles.title}>{item.name}</Text>
        <View style={styles.content}>
          <View style={styles.leftContent}>
            {item.children.map(el => (
              <Pressable key={el.id} onPress={() => {
                router.navigate({
                  pathname: "/hierarchy/article",
                  params: {
                    title: item.name,
                    selected: el.id,
                    articleTabs: JSON.stringify(item.children)
                  }
                })
              }}>
                {({ pressed }) =>
                  <View style={{ backgroundColor: Color.WHITE }}>
                    <View
                      style={[
                        styles.tabItemWrapper,
                        {
                          backgroundColor: getChapterBgColor(el.id),
                          opacity: pressed ? 0.6 : 1
                        },
                      ]}>
                      <Text style={styles.tabItemText}>{el.name}</Text>
                    </View>
                  </View>
                }
              </Pressable>
            ))}
          </View>
        </View>
      </View>
    </View>
  );
}

const renderHeader = () => <View style={{ height: dp(20), backgroundColor: Color.DEFAULT_BG }} />

export default function TabHierarchyScreen() {

  const { data,
    isLoading,
    isFetching,
    isError,
    isSuccess,
    error,
    refetch
  } = useGetHierarchyQuery()

  useEffect(() => {

  }, [])

  return (
    <>
      <NavBar options={{ title: i18n2('tab_hierarchy') }} />
      <View style={globalStyles.container}>
        <CommonFlatList
          isLoading={isLoading}
          isSuccess={isSuccess}
          isError={isError}
          hasMoreData={false}
          error={error && uniformError(error)}
          data={data ?? []}
          keyExtractor={item => item.id.toString()}
          initialNumToRender={5}
          renderItem={renderItem}
          ListHeaderComponent={renderHeader}
          // onEndReached={onEndReached}
          isRefreshing={isFetching}
          onRefresh={refetch}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  itemWrapper: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: Color.DEFAULT_BG
  },
  itemContent: {
    width: dp(700),
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftContent: {
    width: dp(620),
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
});
