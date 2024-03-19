import { Ionicons } from '@expo/vector-icons';

import { Tabs, router } from 'expo-router';
import { Pressable } from 'react-native';
import { DrawerToggleButton } from "@react-navigation/drawer";

import { useClientOnlyValue } from '@/components/useClientOnlyValue';
import { useAppSelector } from '@/store';
import { i18n2 } from '@/utils/Utility';

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof Ionicons>['name'];
  color: string;
}) {
  return <Ionicons size={28} style={{ marginBottom: -3 }} {...props} />;
}

const HeadLeft = () => <DrawerToggleButton tintColor='#fff' />

export default function TabLayout() {
  //const colorScheme = useColorScheme();
  const themeColor = useAppSelector((state) => state.user.themeColor)

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: themeColor,
        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.
        headerShown: useClientOnlyValue(false, true),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: i18n2('tab_home'),
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
          headerRight: () => (
            <Pressable onPress={() => {
              router.navigate({
                pathname: "/search/"
              })
            }}>
              {({ pressed }) => (
                <Ionicons
                  name="search"
                  size={25}
                  color="#fff"
                  style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                />
              )}
            </Pressable>
          ),
          headerLeft: HeadLeft,
        }}
      />
      <Tabs.Screen
        name="hierarchy"
        options={{
          headerShown: false,
          title: i18n2('tab_hierarchy'),
          tabBarIcon: ({ color }) => <TabBarIcon name="school" color={color} />,
          // headerLeft: HeadLeft,
        }}
      />
      <Tabs.Screen
        name="wx-article"
        options={{
          title: i18n2('tab_public_account'),
          tabBarIcon: ({ color }) => <TabBarIcon name="people" color={color} />,
        }}
      />
      <Tabs.Screen
        name="guide"
        options={{
          title: i18n2('tab_navigation'),
          tabBarIcon: ({ color }) => <TabBarIcon name="rocket" color={color} />,
        }}
      />
      <Tabs.Screen
        name="project"
        options={{
          title: i18n2('tab_project'),
          tabBarIcon: ({ color }) => <TabBarIcon name="newspaper" color={color} />,
        }}
      />
    </Tabs>
  );
}
