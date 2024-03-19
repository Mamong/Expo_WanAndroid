import { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";

import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import CommonFlatList from "@/components/CommonFlatList";
import NavBar from "@/components/NavBar";
import { Color } from "@/constants/Colors";
import { useLazyGetMyCoinInfoQuery, useLazyGetMyCoinListQuery } from "@/services/mine.service";
import { useAppSelector } from "@/store";
import globalStyles from "@/styles/globalStyles";
import { uniformError } from "@/utils/HttpErrUtil";
import { i18n, i18n2 } from "@/utils/Utility";
import { DEVICE_WIDTH, getRealDP as dp } from '../../utils/screenUtil';

const renderItem = ({ item }: { item: CoinDetail }) => {
    return (
        <View style={styles.itemWrapper}>
            <View>
                <Text style={styles.coinReasonText}>{item.reason}</Text>
                <Text style={styles.coinDescText}>{item.desc}</Text>
            </View>
            <Text style={styles.coinCountText}>{`+${item.coinCount}`}</Text>
        </View>
    );
}

const renderSeparator = () => {
    return (
        <View style={{ backgroundColor: Color.WHITE }}>
            <View style={globalStyles.splitLine} />
        </View>
    );
}

export default function CoinDetailScreen() {
    const themeColor = useAppSelector((state) => state.user.themeColor)
    const insets = useSafeAreaInsets()

    const currentPage = useRef(1)
    const fetchingPage = useRef(1)
    const [fetchCoinList, {
        data,
        isLoading,
        isSuccess,
        isFetching,
        isError,
        error,
    }] = useLazyGetMyCoinListQuery()

    const [fetchCoinInfo, {
        data: coinInfo,
        // isLoading,
        // isSuccess,
        // isFetching,
        // isError,
        // error,
    }] = useLazyGetMyCoinInfoQuery()

    useEffect(() => {
        console.log('index第一次渲染时调用')
        fetchCoinInfo()
        onRefresh()
    }, [])

    const onEndReached = async () => {
        console.log("onEndReached")
        const hasMore = data ? data.curPage < data.pageCount : false
        if (isFetching||!hasMore) return
        fetchingPage.current = currentPage.current + 1;
        await fetchCoinList(fetchingPage.current)
    }

    const onRefresh = async () => {
        console.log("onRefresh")
        fetchingPage.current = 1
        await fetchCoinList(fetchingPage.current)
    }

    useEffect(() => {
        if (isSuccess) {
            currentPage.current = fetchingPage.current
        }
    }, [isFetching])

    const renderHeader = () => {
        return (
            <View style={[styles.headerWrapper, { backgroundColor: themeColor }]}>
                <View style={styles.item}>
                    <Text style={styles.itemTitle}>{i18n2('points_rank')}</Text>
                    <Text style={styles.coinText}>{coinInfo?.rank}</Text>
                </View>
                <View style={styles.item}>
                    <Text style={styles.itemTitle}>{i18n2("points_level")}</Text>
                    <Text style={styles.coinText}>{coinInfo?.level}</Text>
                </View>
                <View style={styles.item}>
                    <Text style={styles.itemTitle}>{i18n2("points_point")}</Text>
                    <Text style={styles.coinText}>{coinInfo?.coinCount}</Text>
                </View>
            </View>
        );
    }

    return (
        <View style={[styles.container, { paddingBottom: insets.bottom }]}>
            <NavBar options={{
                title: i18n2("menu_points_details"),
                headerRight: () =>
                    <Pressable onPress={() => {
                        router.navigate({
                            pathname: "/webview",
                            params: {
                                title: i18n2("points_rule"),
                                url: 'https://www.wanandroid.com/blog/show/2653',
                            }
                        });
                    }} ><View style={styles.iconWrapper}>
                            <Ionicons name="help-circle-outline" size={dp(50)} color={Color.WHITE} />
                        </View></Pressable>
            }} />
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
                ListHeaderComponent={renderHeader}
                ItemSeparatorComponent={renderSeparator}
                onEndReached={onEndReached}
                isRefreshing={fetchingPage.current == 1 && isFetching}
                onRefresh={onRefresh}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Color.DEFAULT_BG,
    },
    headerWrapper: {
        display: "flex",
        flexDirection: "row",
        height: dp(200),
        justifyContent: "space-around",
        alignItems: 'center',
    },
    iconWrapper: {
        height: dp(60),
        width: dp(60),
        borderRadius: dp(30),
        alignItems: 'center',
        justifyContent: 'center',
    },
    item: {
        display:"flex",
        alignItems:"center",
        flex:1,
    },
    itemTitle: {
        fontSize: dp(36),
        color: Color.WHITE,
    },
    coinText: {
        fontSize: dp(56),
        fontWeight: 'bold',
        color: Color.WHITE,
    },
    itemWrapper: {
        width: "100%",
        flexDirection: 'row',
        backgroundColor: Color.WHITE,
        paddingVertical: dp(28),
        paddingHorizontal: dp(28),
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    coinCountText: {
        fontSize: dp(30),
        color: Color.WX_GREEN,
        fontWeight: 'bold',
    },
    coinDescText: {
        fontSize: dp(28),
        color: Color.TEXT_DARK,
        marginTop: dp(20),
    },
    coinReasonText: {
        fontSize: dp(30),
        color: Color.TEXT_MAIN,
    },
});
