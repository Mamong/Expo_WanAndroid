import images from "@/assets";
import React from "react";
import { View, Image, StyleSheet } from "react-native";
import Loading from "./Loading"

export default function BigLoading() {
    return (
        <View style={styles.wrap}>
            <Image source={images.logoIcon}
                style={styles.logo}
                resizeMode={'cover'} />
            <Loading />
        </View>
    )
}

const styles = StyleSheet.create({
    wrap: {
        display: "flex",
        alignItems: "center",
        padding: 16,
        marginHorizontal: "auto",
        marginTop: 16,
        textAlign: "center",
        borderRadius: 8,
        maxWidth: "auto",
        backgroundColor: "red"
    },
    logo: {
        width: 128,
        height: 128,
        marginHorizontal: "auto"
    }
})