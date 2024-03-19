/*
默认的列表空数据占位图，可能是数据为空，
也可能是loading，错误原因可能为网络错误、普通业务错误以及未登录几种
*/

import images from "@/assets";
import { DEVICE_WIDTH } from "@/utils/screenUtil";
import { View, Image, Text, StyleSheet, Button } from "react-native";

export default function DefaultError({ cover,
    error,
    actionTitle,
    action }: ErrorEmptyProps) {
    return (
        <View style={styles.wrapper}>
            <Image
                source={cover ?? images.logoIcon}
                style={styles.cover}
            />
            <View style={styles.textTips}>
                <Text style={styles.text}>{error}</Text>
            </View>
            {actionTitle && <Button title={actionTitle} onPress={() => action?.call(undefined)} />}
        </View>
    )
}

const styles = StyleSheet.create({
    wrapper: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        backgroundColor: "#fff"
    },
    cover: {
        width: DEVICE_WIDTH * 0.5,
        aspectRatio: 1,
    },
    textTips: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 16,
        marginVertical: 8
    },
    text: {
        fontSize: 14,
        lineHeight: 20
    }
})