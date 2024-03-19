import React, { useEffect } from 'react'
import { View, StyleSheet } from 'react-native'
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withTiming,
} from 'react-native-reanimated'

export default function Loading(props) {
    //? Props
    const { style } = props

    //? Assets
    const onePoint = useSharedValue(0)
    const twoPoint = useSharedValue(0)
    const threePoint = useSharedValue(0)
    const fourPoint = useSharedValue(1)

    //从小变大
    const animatedOnePointStyles = useAnimatedStyle(() => ({
        transform: [{ scaleX: onePoint.value }, { scaleY: onePoint.value }],
    }))

    //从1移到2
    const animatedTwoPointStyles = useAnimatedStyle(() => ({
        transform: [{ translateX: twoPoint.value }, { translateY: 0 }],
    }))

    //从2移到3
    const animatedThreePointStyles = useAnimatedStyle(() => ({
        transform: [{ translateX: threePoint.value }, { translateY: 0 }],
    }))

    //从大变小
    const animatedFourPointStyles = useAnimatedStyle(() => ({
        transform: [{ scaleX: fourPoint.value }, { scaleY: fourPoint.value }],
    }))

    useEffect(() => {
        onePoint.value = withRepeat(withTiming(1, { duration: 600 }), -1, false)
        twoPoint.value = withRepeat(withTiming(24, { duration: 600 }), -1, false)
        threePoint.value = withRepeat(withTiming(24, { duration: 600 }), -1, false)
        fourPoint.value = withRepeat(withTiming(0, { duration: 600 }), -1, false)
    }, [])

    return (
        <View style={[styles.wrap, style]}>
            <Animated.View
                style={[styles.dot, styles.dot1, animatedOnePointStyles]}
            />
            <Animated.View
                style={[styles.dot, styles.dot1, animatedTwoPointStyles]}
            />
            <Animated.View
                style={[styles.dot, styles.dot3, animatedThreePointStyles]}
            />
            <Animated.View
                style={[styles.dot, styles.dot4, animatedFourPointStyles]}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    wrap: {
        display: "inline-block",
        position: "relative",
        width: 80,
        height: 24,
    },
    dot: {
        position: "absolute",
        top: "15%",
        width: 13,
        height: 13,
        backgroundColor: "white",
        borderRadius: "100%",
    },
    dot1: {
        left: 8,
    },
    dot3: {
        left: 32,
    },
    dot4: {
        left: 56,
    }
})