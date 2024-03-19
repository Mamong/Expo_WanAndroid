import {
    forwardRef,
    useCallback,
    useEffect,
    useImperativeHandle,
    useMemo,
    useRef,
    useState
} from 'react';
import {
    FlatList,
    NativeScrollEvent,
    NativeSyntheticEvent,
    Pressable,
    RefreshControl,
    View,
    StyleSheet
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

import { Color } from '@/constants/Colors';
import { DEVICE_HEIGHT, getRealDP as dp } from '../utils/screenUtil';
import { useAppSelector } from '@/store';
import { i18n, i18n2, showToast } from '@/utils/Utility';
import ListFooter from './ListFooter';
import PageLoading from './loading/PageLoading';
import DefaultEmpty from './emptyPlaceholder/DefaultEmpty';
import DefaultError from './emptyPlaceholder/DefaultError';

interface FlatListProps {
    isLoading: boolean,
    isError: boolean,
    isSuccess: boolean,
    error?: { status: number, message: string },

    hasMoreData: boolean
    isShowTop?: boolean,
    isRefreshing: boolean,
    onRefresh?: () => void,
}

export type CommonFlatListProps = FlatListProps & FlatList['props'];


const CommonFlatLists = forwardRef(({
    isLoading,
    isError,
    isSuccess,
    error,

    isShowTop = true,
    isRefreshing,
    hasMoreData,
    onRefresh,
    data,
    ...rest }: CommonFlatListProps, ref) => {

    const flatListRef = useRef<FlatList>(null)
    const [showTop, setShowTop] = useState(isShowTop)
    const themeColor = useAppSelector((state) => state.user.themeColor)

    useImperativeHandle(
        ref,
        () => ({
            // 暴露给父组件的方法
            scrollToTop: () => {
                flatListRef.current?.scrollToOffset({ animated: true, offset: 0 });
            },
        }),
    );

    const handleScrollToTop = () => {
        flatListRef.current?.scrollToOffset({ animated: true, offset: 0 })
    }

    const onScroll = useCallback((e: NativeSyntheticEvent<NativeScrollEvent>) => {
        const scrollY = e.nativeEvent.contentOffset.y
        if (!isShowTop) return
        if (scrollY > 0) {
            setShowTop(true)
        } else {
            setShowTop(false)
        }
    }, [])

    useEffect(() => {
        if (isError) {
            showToast("加载出错")
        }
    }, [isError])

    const refreshControl = useMemo(() => <RefreshControl
        refreshing={isRefreshing}
        onRefresh={onRefresh}
        tintColor={themeColor}
        colors={[themeColor]}
        title={i18n2('footer_load_more')}
        titleColor={Color.TEXT_LIGHT}
    />, [isRefreshing, themeColor])

    const renderFooter = useMemo(() => <ListFooter
        hasMoreData={hasMoreData}
        indicatorColor={themeColor}
    />, [hasMoreData, themeColor])

    if (isLoading) {
        return <PageLoading type='loading' />
    }
    if (data?.length == 0 && isError && error) {
        const { status, message } = error
        const callback = () => {
            if (status == -1001) {
                router.navigate('/user/login')
            } else {
                onRefresh?.call(undefined)
            }
        }
        return <DefaultError
            error={message}
            action={callback}
            actionTitle={status == -1001 ? '去登录' : '重试'} />
    }

    return (
        <View style={styles.container}>
            <FlatList
                ref={flatListRef}
                data={data}
                onScroll={onScroll}
                onEndReachedThreshold={0.1}
                refreshControl={
                    refreshControl
                }
                ListEmptyComponent={
                    DefaultEmpty
                }
                ListFooterComponent={
                    renderFooter
                }
                {...rest}
            />
            {showTop &&
                <Pressable onPress={handleScrollToTop}>
                    <View style={styles.fixAndroidStyle}>
                        <View style={[styles.topStyle, { backgroundColor: themeColor }]}>
                            <Ionicons name='rocket' size={dp(60)} color={Color.WHITE} />
                        </View>
                    </View>
                </Pressable>}
        </View>
    )
})

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    fixAndroidStyle: {
        position: 'absolute',
        bottom: dp(80),
        right: dp(45),
        width: dp(120),
        height: dp(120),
        backgroundColor: 'rgba(0,0,0,0.005)', // android View设置borderRadius需要外加一层带背景色的View
    },
    topStyle: {
        width: dp(120),
        height: dp(120),
        borderRadius: dp(60),
        justifyContent: 'center',
        alignItems: 'center',
        opacity: 0.8,
    },
})

export default CommonFlatLists