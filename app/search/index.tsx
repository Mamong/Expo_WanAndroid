import { useState } from "react";
import { Keyboard, View, Text, StyleSheet, TextInput, Pressable } from "react-native";
import { router } from "expo-router";

import { Ionicons } from "@expo/vector-icons";

import NavBar from "@/components/NavBar";
import { Color } from "@/constants/Colors";
import globalStyles from "@/styles/globalStyles";
import { getChapterBgColor, i18n, i18n2, showToast } from "@/utils/Utility";
import { DEVICE_WIDTH, getRealDP as dp } from '@/utils/screenUtil';
import { useGetSearchHotKeyQuery } from "@/services/home.service";



export default function SearchScreen() {
    const [searchKey, setSearchKey] = useState('')
    const { data, isFetching } = useGetSearchHotKeyQuery()

    return (
        <View style={globalStyles.container}>
            <NavBar options={{
                headerTitle: () => (
                    <View style={styles.textInputWrapper}>
                        <TextInput
                            style={styles.textInputStyle}
                            placeholder={`  ${i18n2("search_placeholder")}`}
                            placeholderTextColor={Color.WHITE}
                            selectionColor={Color.WHITE}
                            autoFocus
                            onChangeText={searchKey => {
                                setSearchKey(searchKey);
                            }}
                        />
                    </View>
                ),
                headerRight: () =>
                    <Pressable onPress={() => {
                        Keyboard.dismiss();
                        if (!searchKey) {
                            return showToast(i18n2("tips_search_keywords"));
                        }
                        router.navigate({
                            pathname: '/search/articles',
                            params: {
                                key: searchKey
                            }
                        })
                    }}>
                        {({ pressed }) => (
                            <Ionicons
                                name="search"
                                size={25}
                                color="#fff"
                                style={{ opacity: pressed ? 0.5 : 1 }}
                            />
                        )}
                    </Pressable>
            }}

            />
            <View style={styles.hotKeyTitleWrapper}>
                <Ionicons name={'flame'} size={dp(50)} color={Color.RED} />
                <Text style={styles.hotKeyTitleText}>{i18n2("search_hotkey")}</Text>
            </View>
            <View style={styles.hotKeyWrapper}>
                {data?.map(el => (
                    <Pressable
                        key={el.id}
                        onPress={() =>
                            router.navigate({
                                pathname: '/search/articles',
                                params: {
                                    key: el.name
                                }
                            })
                        }
                        style={({ pressed }) => [
                            styles.hotKeyItem,
                            {
                                backgroundColor: getChapterBgColor(el.id),
                                opacity: pressed ? 0.6 : 1
                            },
                        ]}>
                        <Text style={styles.hotKeyText}>{el.name}</Text>
                    </Pressable>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    iconWrapper: {
        height: dp(60),
        width: dp(60),
        borderRadius: dp(30),
        alignItems: 'center',
        justifyContent: 'center',
    },
    textInputWrapper: {
        width: DEVICE_WIDTH - dp(260),
    },
    textInputStyle: {
        fontSize: dp(32),
        color: Color.WHITE,
        padding: 0,
    },
    hotKeyTitleWrapper: {
        height: dp(100),
        paddingHorizontal: dp(28),
        alignItems: 'center',
        flexDirection: 'row',
    },
    hotKeyTitleText: {
        fontSize: dp(38),
        color: Color.TEXT_MAIN,
        marginLeft: dp(15),
    },
    hotKeyWrapper: {
        paddingHorizontal: dp(28),
        flexWrap: 'wrap',
        flexDirection: 'row',
    },
    hotKeyItem: {
        paddingHorizontal: dp(30),
        paddingVertical: dp(15),
        borderRadius: dp(35),
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: dp(20),
        marginBottom: dp(20),
    },
    hotKeyText: {
        fontSize: dp(30),
        color: Color.WHITE,
        fontWeight: 'bold',
    },
});