import { useEffect } from 'react';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';

import { FontAwesome } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme } from '@/components/useColorScheme';
import { getLocales } from 'expo-localization';
import { RootSiblingParent } from 'react-native-root-siblings';
import { Provider } from 'react-redux';
import { persistor, store } from '@/store';
import { PersistGate } from 'redux-persist/integration/react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar, StatusBarStyle } from 'expo-status-bar';
import AuthUtil from '@/utils/AuthUtil';
import i18n from '@/localization/LanguageUtil';
import { Platform } from 'react-native';


export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '/(drawer)/(tabs)/',
};

// Set the locale once at the beginning of your app.
// i18n.locale = getLocales()[0].languageCode || 'zhHans';
initApp()

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <StatusBar style={colorScheme as StatusBarStyle} />
          <RootLayoutNav />
        </PersistGate>
      </Provider>
    </ThemeProvider>
  );
}

function RootLayoutNav() {
  return (
    <SafeAreaProvider>
      <RootSiblingParent>
        <Stack>
          <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
        </Stack>
      </RootSiblingParent>
    </SafeAreaProvider>
  );
}

async function initApp() {
  //https://github.com/react-native-async-storage/async-storage/issues/1056
  // https://github.com/supabase/supabase-js/issues/786
  if (Platform.OS != "web") {
    const language = await AuthUtil.getAppLanguage();
    if (language) {
      i18n.locale = language
    } else {
      i18n.locale = 'zhHans'
    }
  }
}