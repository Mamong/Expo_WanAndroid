import { Platform, ToastAndroid } from 'react-native';
import LanguageUtil from '@/localization/LanguageUtil';
import { Color } from '@/constants/Colors';
import Ionicons from '@expo/vector-icons/Ionicons';
import Toast from 'react-native-root-toast';
import LanguageMapper, { LanguageMapperType } from '@/localization/LanguageMapper';
import { TranslateOptions } from 'i18n-js';

/**
 * 吐司方法
 * @param info 吐司文案信息
 * @return
 */
export function showToast(info: string) {
    //   if (isAndroid) {
    //     return ToastAndroid.show(info, ToastAndroid.SHORT);
    //   }
    //   if (!global.toast) {
    //     return;
    //   }
    //   global.toast.show(info);
    // Add a Toast on screen.
    let toast = Toast.show(info, {
        duration: Toast.durations.LONG,
        position: Toast.positions.BOTTOM,
        shadow: true,
        animation: true,
        hideOnPress: true,
        keyboardAvoiding: true,
        delay: 0,
        onShow: () => {
            // calls on toast\`s appear animation start
        },
        onShown: () => {
            // calls on toast\`s appear animation end.
        },
        onHide: () => {
            // calls on toast\`s hide animation start.
        },
        onHidden: () => {
            // calls on toast\`s hide animation end.
        }
    });
}

/**
 * 获取默认"react-navigation"导航样式
 * @param navigation
 * @param backgroundColor
 * @return 导航样式
 */
export function getNavBarStyles(backgroundColor = Color.THEME) {
    return {
        headerBackTitleVisible: false,
        headerShown: true,
        headerStyle: { backgroundColor },
        headerTitleStyle: { color: Color.WHITE },
        headerTintColor: Color.WHITE
    }
}

/**
 * 获取首页专题背景色
 * @param index 专题id
 * @return 背景色
 */
export function getChapterBgColor(index: number) {
    const colors = [
        '#79CDCD',
        '#71C671',
        '#4169E1',
        '#3CB371',
        '#EE82EE',
        '#F4A460',
        '#FF7256',
        '#5F9EA0',
        '#79CDCD',
        '#BC8F8F',
    ];
    return colors[index % 10];
}

/**
 * APP主题色数据
 */
export function getThemeColorDataSource() {
    return [
        { name: '默认主题色', color: '#2196F3' },
        { name: '皇家蓝', color: '#4169E1' },
        { name: '军校蓝', color: '#5F9EA0' },
        { name: '深卡其布', color: '#BDB76B' },
        { name: '玫瑰棕色', color: '#BC8F8F' },
        { name: '印度红', color: '#CD5C5C' },
        { name: '深石板灰', color: '#2F4F4F' },
        { name: '海洋绿', color: '#2E8B57' },
        { name: '暗淡的灰色', color: '#696969' },
        { name: '橙色', color: '#FFA500' },
        { name: '粉红色', color: '#FFC0CB' },
        { name: '深粉色', color: '#FF1493' },
        { name: '兰花的紫色', color: '#DA70D6' },
        { name: '适中的紫色', color: '#9370DB' },
        { name: '紫色', color: '#800080' },
        { name: '纯黑', color: '#000000' },
    ];
}

export function i18n(Text: string) {
    return LanguageUtil.t(Text);
}

export function i18n2(text: keyof LanguageMapperType, options?:TranslateOptions) {
    return LanguageUtil.t(LanguageMapper[text],options);
}

/**
 * 抽屉列表数据
 */
export interface DrawerDataProps {
    route: string,
    title: string,
    iconName: React.ComponentProps<typeof Ionicons>['name']
}

export function getDrawerData() {
    return [
        { route: '/(drawer)/(tabs)', iconName: 'home', title: i18n2('menu_home') },
        { route: '/coin-detail', iconName: 'trending-up', title: i18n2('menu_points') },
        { route: '/collection', iconName: 'heart', title: i18n2('menu_collection') },
        { route: '/websites', iconName: 'globe', title: i18n2('menu_websites') },
        { route: '/about', iconName: 'person', title: i18n2('menu_about') },
        { route: 'share', iconName: 'share', title: i18n2('menu_share') },
        { route: '/settings', iconName: 'settings', title: i18n2('menu_settings') },
        { route: 'logout', iconName: 'power', title: i18n2('menu_logout') },
    ] as DrawerDataProps[];
}

export interface LanguageOpt {
    language: string,
    languageCode: 'en' | 'zhHans' | 'zhHant'
}
export function getLanguageList() {
    return [
        { language: '简体中文', languageCode: 'zhHans' },
        { language: '繁体中文', languageCode: 'zhHant' },
        { language: 'English', languageCode: 'en' },
    ] as LanguageOpt[];
}

/*1.用正则表达式实现html转码*/
export function htmlEncode(str: string) {
    let s = "";
    if (str.length == 0) return "";
    s = str.replace(/&/g, "&amp;");
    s = s.replace(/</g, "&lt;");
    s = s.replace(/>/g, "&gt;");
    s = s.replace(/ /g, "&nbsp;");
    s = s.replace(/\'/g, "&#39;");
    s = s.replace(/\"/g, "&quot;");
    return s;
}
/*2.用正则表达式实现html解码*/
export function htmlDecode(str: string) {
    let s = "";
    if (str.length == 0) return "";
    s = str.replace(/&amp;/g, "&");
    s = s.replace(/&lt;/g, "<");
    s = s.replace(/&gt;/g, ">");
    s = s.replace(/&nbsp;/g, " ");
    s = s.replace(/&#39;/g, "\'");
    s = s.replace(/&quot;/g, "\"");
    return s;
}

export function replaceSpecificTag(str: string, tag: string, replacement = "") {
    var regex = new RegExp(`<${tag}[^>]*>|<\/${tag}>`, 'gi');
    return str.replace(regex, replacement);
}

export function trimHtmlWithFix(html: string) {
    return replaceSpecificTag(htmlDecode(html), 'em').replace(/\(/g, '（').replace(/\)/g, '）')
}