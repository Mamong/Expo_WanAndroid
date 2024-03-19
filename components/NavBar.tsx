import { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { DrawerNavigationOptions } from '@react-navigation/drawer'
import { Stack } from "expo-router";
import Drawer from "expo-router/drawer";

import { useAppSelector } from "@/store";
import { getNavBarStyles } from "@/utils/Utility";

export default function NavBar({ inDrawer = false, options }:
    {
        inDrawer?: boolean,
        options?: NativeStackNavigationOptions & DrawerNavigationOptions
    }) {
    const themeColor = useAppSelector((state) => state.user.themeColor)
    return (
        inDrawer ? <Drawer.Screen
            options={{ ...getNavBarStyles(themeColor), ...options }}
        /> :
            <Stack.Screen
                options={{ ...getNavBarStyles(themeColor), ...options }}
            />
    )
}