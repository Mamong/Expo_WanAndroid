import { View, Text, ActivityIndicator, StyleSheet } from "react-native";

import { Color } from "@/constants/Colors";
import { i18n, i18n2 } from "@/utils/Utility";
import { DEVICE_WIDTH, getRealDP as dp } from '../utils/screenUtil';

export default function ListFooter({
    hasMoreData,
    indicatorColor = Color.THEME }: {
        hasMoreData: boolean,
        indicatorColor?: string
    }) {
    if (hasMoreData) {
        return (
            <View style={styles.footer}>
                <ActivityIndicator color={indicatorColor} />
                <Text style={{ marginLeft: dp(20), color: Color.TEXT_LIGHT }}>
                    {i18n2("footer_load_more")}
                </Text>
            </View>
        )
    } else {
        return (
            <View style={styles.footer}>
                <Text style={{ color: Color.TEXT_LIGHT }}>{i18n2("footer_no_more")}</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    footer: {
        flexDirection: 'row',
        width: DEVICE_WIDTH,
        height: dp(80),
        alignItems: 'center',
        justifyContent: 'center',
    },
});