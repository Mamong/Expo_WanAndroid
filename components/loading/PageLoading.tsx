import { View, StyleSheet, StyleProp, ViewStyle } from "react-native";
import BigLoading from "./BigLoading";
import ActivityLoading from "./ActivityLoading";

export default function PageLoading({ mask, ...rest }: PageLoadingProps) {
    const extraStyle: StyleProp<ViewStyle> = mask ?
        { pointerEvents: "auto", backgroundColor: "#0009" } : { pointerEvents: "none" }
    return (
        <View style={[styles.loading, extraStyle]}>
            <ActivityLoading {...rest} />
        </View>
    )
}

const styles = StyleSheet.create({
    loading: {
        display: "flex",
        position: "absolute",
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        zIndex: 40,
        alignItems: "center",
        justifyContent: "center",
        // pointerEvents: "none"
        // backgroundColor:"white"
    }
})