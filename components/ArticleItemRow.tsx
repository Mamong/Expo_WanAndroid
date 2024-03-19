import { View, Text, Image, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

import { getRealDP as dp } from '../utils/screenUtil';
import globalStyles from '../styles/globalStyles';
import { Color } from '@/constants/Colors';
import { getChapterBgColor, i18n, i18n2, trimHtmlWithFix } from '@/utils/Utility';

interface ArticleItemRowProp {
    item: Article,
    isWxArticle?: boolean,
    onCollectPress: () => void
}

export default function ArticleItemRow({
    item,
    isWxArticle = false,
    onCollectPress }: ArticleItemRowProp) {
    //https://github.com/expo/expo/issues/26664
    const title = trimHtmlWithFix(item.title)

    return (
        <Pressable style={styles.container} onPress={() => {
            router.navigate({
                pathname: '/webview',
                params: {
                    title: title,
                    url: item.link
                }
            })
        }}>
            <View style={styles.itemWrapper}>
                <View style={styles.itemLeftWrapper}>
                    {item.isTop &&
                        <View style={styles.tabItemWrapper}>
                            <Text style={styles.topBadge}>置顶</Text>
                        </View>}
                    {item.isTop ?
                        <Text style={styles.title} numberOfLines={2}>
                            &emsp;&emsp;&emsp;{title}
                        </Text> :
                        <Text style={styles.title} numberOfLines={2}>
                            {title}
                        </Text>}
                    <Text numberOfLines={3} style={styles.desc}>
                        {item.desc}
                    </Text>
                    <View style={styles.likeTime}>
                        <Pressable style={({ pressed }) => [{
                            opacity: pressed ? 0.6 : 1.0
                        }]}
                            onPress={onCollectPress}>
                            <Ionicons
                                name={'heart'}
                                size={dp(50)}
                                color={item.collect ? Color.COLLECT : Color.ICON_GRAY}
                            />
                        </Pressable>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <View style={styles.timeIconWrapper}>
                                <Ionicons
                                    name={'time'}
                                    size={dp(50)}
                                    color={Color.ICON_GRAY}
                                />
                            </View>
                            <Text style={styles.dateText}>{item.niceDate}</Text>
                            <Text style={[styles.dateText, { marginLeft: dp(20) }]}>
                                {item.author || item.shareUser || item.chapterName}
                            </Text>
                        </View>
                    </View>
                </View>
                <View style={styles.itemRightWrapper}>
                    {item.envelopePic ? (
                        <Image
                            style={styles.image}
                            source={{ uri: item.envelopePic }}
                            resizeMode={'stretch'}
                        />
                    ) : (
                        <View style={{ backgroundColor: Color.WHITE }}>
                            <View
                                style={[
                                    globalStyles.circleSpecialWrapper,
                                    {
                                        backgroundColor: isWxArticle
                                            ? Color.WX_GREEN
                                            : getChapterBgColor(item.chapterId),
                                    },
                                ]}>
                                <Text style={globalStyles.specialText}>
                                    {item.superChapterName || i18n2('article')}
                                </Text>
                            </View>
                        </View>
                    )}
                </View>
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },
    itemWrapper: {
        width: dp(700),
        backgroundColor: Color.WHITE,
        paddingHorizontal: dp(20),
        paddingTop: dp(25),
        paddingBottom: dp(13),
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: dp(20),
        borderRadius: dp(20),
    },
    itemLeftWrapper: {
        flex: 1,
        width: dp(520),
        justifyContent: 'space-between',
        position: "relative",
    },
    itemRightWrapper: {
        justifyContent: 'center',
    },
    topBadge: {
        fontSize: dp(24),
        color: '#fff',
    },
    tabItemWrapper: {
        position: "absolute",
        paddingHorizontal: dp(8),
        paddingVertical: dp(4),
        borderRadius: dp(10),
        backgroundColor: 'red'
    },
    image: {
        height: dp(200),
        width: dp(120),
        backgroundColor: Color.ICON_GRAY,
    },
    title: {
        fontSize: dp(28),
        color: Color.TEXT_MAIN,
        fontWeight: 'bold',
        maxWidth: dp(520),
        lineHeight:dp(36),
        // backgroundColor:'yellow'
    },
    desc: {
        fontSize: dp(26),
        color: Color.TEXT_DARK,
        marginVertical: dp(12),
        maxWidth: dp(520),
    },
    likeTime: {
        width: dp(520),
        flexDirection: 'row',
        alignItems: 'center',
    },
    dateText: {
        fontSize: dp(24),
        color: Color.TEXT_LIGHT,
    },
    timeIconWrapper: {
        marginHorizontal: dp(20),
    },
});