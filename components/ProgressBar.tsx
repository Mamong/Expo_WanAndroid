import React from "react";
import { ProgressView } from "@react-native-community/progress-view";
import { Color } from "@/constants/Colors";
import { useAppSelector } from "@/store";

export default function ProgressBar({ progress }: { progress: number }) {
    const themeColor = useAppSelector((state) => state.user.themeColor)

    if (progress === 1) {
        return null;
    }
    return (
        <ProgressView
            progressTintColor={themeColor}
            trackTintColor={Color.WHITE}
            progress={progress} />
    );
}