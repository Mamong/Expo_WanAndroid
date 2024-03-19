import NavBar from "@/components/NavBar";
import { Stack } from "expo-router";

export default function SettingsLayout() {
    return (
        <>
            <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="index" options={{ headerShown: false }} />
            </Stack>
        </>
    )
}