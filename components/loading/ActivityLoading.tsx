import images from "@/assets";
import React from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { MaterialIcons } from '@expo/vector-icons';

export default function ActivityLoading(props: LoadingProps) {
    const { type = 'loading', title = "loading..." } = props
    return (
        <View style={styles.wrap}>
            {type == 'loading' && <ActivityIndicator size={32} color="#ffffffe6" />}
            {type == 'error' && <MaterialIcons name="error" size={32} color="#ffffffe6" />}
            {type == 'success' && <MaterialIcons name="check" size={32} color="#ffffffe6" />}
            <Text style={styles.tips}>{title}</Text>
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
        backgroundColor: "#000000e6"
    },
    tips: {
        fontSize: 16,
        color: "#ffffffe6"
    }
})