import { useState } from "react";
import { Pressable, Share, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import WebView from "react-native-webview";
import { WebViewProgressEvent } from "react-native-webview/lib/WebViewTypes";

import NavBar from "@/components/NavBar";
import ProgressBar from "@/components/ProgressBar";
import globalStyles from "@/styles/globalStyles";
import { Ionicons } from "@expo/vector-icons";

async function onShare(title: string, url: string) {
    try {
        await Share.share({
            message: `${title}：${url}`,
        });
    } catch (error: any) {
        alert(error.message);
    }
}

export default function WebViewScreen() {
    const params = useLocalSearchParams()
    const [progress, setProgress] = useState(0)

    const url = params?.url?.toString() ?? 'https://www.wanandroid.com/'
    const title = params?.title?.toString() ?? ''

    const onLoadProgress = (e: WebViewProgressEvent) => {
        setProgress(e.nativeEvent.progress)
    }

    return (
        <>
            <NavBar options={{
                title,
                headerRight: () =>
                    <Pressable onPress={() => {
                        onShare(title, url)
                    }}>
                        {({ pressed }) => (
                            <Ionicons
                                name="share"
                                size={25}
                                color="#fff"
                                style={{ opacity: pressed ? 0.5 : 1 }}
                            />
                        )}
                    </Pressable>
            }} />

            <View style={globalStyles.container}>
                {/* <ProgressBar progress={progress} /> */}
                <WebView
                    source={{ uri: url }}
                    onLoadProgress={onLoadProgress}
                />
            </View>
        </>
    )
}