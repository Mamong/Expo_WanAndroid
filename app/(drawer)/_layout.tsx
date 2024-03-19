import CustomDrawerContent from "@/components/CustomDrawerContent";
import { i18n, i18n2 } from "@/utils/Utility";
 import Drawer from "expo-router/drawer";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Icon from '@expo/vector-icons/Ionicons';
import LanguageMapper from "@/localization/LanguageMapper";
 
export default function DrawerLayout() {
    /*
    由于我们的侧滑菜单是自定义的，因此没有在这里设置Drawer.Screen
     */
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <Drawer drawerContent={(props) =><CustomDrawerContent {...props} />}
            screenOptions={{ headerShown: false, swipeEdgeWidth : 0, drawerType:"front"}}>
                <Drawer.Screen
                    name="(tabs)" // This is the name of the page and must match the url from root
                    options={{
                        drawerLabel: i18n2("tab_home"),
                        title: i18n2('tab_home'),
                    }}
                />
                <Drawer.Screen
                    name="settings" // This is the name of the page and must match the url from root
                    options={{
                        drawerLabel: i18n2('menu_settings'),
                        title: i18n2('menu_settings'),
                        // headerLeft:()=><DrawerToggleButton tintColor='#fff'/>
                    }}
                /> 
                <Drawer.Screen
                    name="collection" // This is the name of the page and must match the url from root
                    options={{
                        drawerLabel: i18n2('menu_collection'),
                        title: i18n2('menu_collection'),
                        // headerLeft:()=><DrawerToggleButton tintColor='#fff'/>
                    }}
                /> 
                <Drawer.Screen
                    name="about" // This is the name of the page and must match the url from root
                    options={{
                        drawerLabel: i18n2("menu_about"),
                        title: i18n2('menu_about'),
                        // headerLeft:()=><DrawerToggleButton tintColor='#fff'/>
                    }}
                /> 
                <Drawer.Screen
                    name="websites" // This is the name of the page and must match the url from root
                    options={{
                        drawerLabel: i18n2("menu_websites"),
                        title: i18n2('menu_websites'),
                        // headerLeft:()=><DrawerToggleButton tintColor='#fff'/>
                    }}
                /> 
            </Drawer>
         </GestureHandlerRootView>
    );
}