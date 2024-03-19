import { memo, useCallback, useState } from 'react';
import { View, Image, Text, StyleSheet, Pressable } from 'react-native';
import { router } from 'expo-router';
import Swiper from 'react-native-swiper';

import { DEVICE_WIDTH, getRealDP as dp } from '../utils/screenUtil';
import { Color } from '@/constants/Colors';


//Swiper在函数组件中存在问题，需要memo一下
const Mswiper = memo(({ bannerArr, onIndexChanged }:
    {
        bannerArr: Banner[],
        onIndexChanged: (arg0: number) => void
    }) => {
    return (
        <Swiper
            style={styles.imgCarousel}
            horizontal={true}
            loop={true}
            autoplay={true}
            showsPagination={false}
            removeClippedSubviews={false} // 处理ios切换页面白屏
            onIndexChanged={onIndexChanged}>
            {
                bannerArr.map(el =>
                    <Pressable key={el.id}
                        onPress={() => {
                            router.navigate({
                                pathname: "/webview",
                                params: {
                                    title: el.title,
                                    url: el.url
                                }
                            })
                        }}>
                        <Image style={styles.imgBanner} source={{ uri: el.imagePath }} />
                    </Pressable>)
            }
        </Swiper>
    )
}, (prevProps, nextProps) => prevProps.bannerArr === nextProps.bannerArr)


export default function Banner({ bannerArr }: { bannerArr: Banner[] }) {
    const [currentIndex, setCurrentIndex] = useState(0)

    const onIndexChanged = useCallback((index: number) => {
        setCurrentIndex(index)
    }, [])

    // const onIndexChanged = (index: number) => {
    //     setCurrentIndex(index)
    // }

    if (!bannerArr.length) {
        return <View style={styles.defaultBg} />;
    }
    return (
        <View style={styles.bannerContainer}>
            <Mswiper bannerArr={bannerArr} onIndexChanged={onIndexChanged}></Mswiper>
            <View style={styles.bannerHint}>
                <Text style={styles.bannerText} numberOfLines={1}>
                    {bannerArr[currentIndex].title}
                </Text>
                <Text style={styles.bannerText}>
                    {currentIndex + 1}/{bannerArr.length}
                </Text>
            </View>
        </View>
    );
}

const imageHeight = dp(380);
const styles = StyleSheet.create({
    defaultBg: {
        height: imageHeight,
        backgroundColor: Color.DEFAULT_BG,
    },
    bannerContainer: {
        height: imageHeight,
        backgroundColor: Color.DEFAULT_BG,
    },
    imgCarousel: {
        height: imageHeight,
    },
    imgBanner: {
        width: DEVICE_WIDTH,
        height: imageHeight,
        resizeMode: 'stretch',
    },
    bannerHint: {
        flex: 1,
        width: DEVICE_WIDTH,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: dp(20),
        backgroundColor: 'rgba(0,0,0,0.3)',
        height: dp(50),
        bottom: 0,
        left: 0,
        position: 'absolute',
    },
    bannerText: {
        color: Color.WHITE,
        fontSize: dp(28),
    },
});