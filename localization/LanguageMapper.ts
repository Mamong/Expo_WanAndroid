const LanguageMapper = {
    tips_login: 'Please login first',
    language: 'Language',
    search_placeholder: 'Search for more dry goods',
    search_hotkey: 'Popular search',
    tips_search_keywords: 'Please enter search keywords',
    menu_about: 'About author',
    about_desc:
        'wanAndroid client based on Facebook react native',
    about_email: 'Email',
    about_bottom:
        'This project is for learning purposes only, not for commercial purposes',
    menu_points_details: 'Points details',
    points_rule: 'Points rule',
    points_rank:'rank',
    points_level:'level',
    points_point:'point',
    menu_collection: 'My collection',
    menu_points: 'My points',
    menu_websites: 'Frequently used websites',
    menu_theme: 'Theme',
    menu_share: 'Share',
    menu_settings: 'Settings',
    menu_logout: 'Logout',
    // share_app_desc:"xxxxx",
    share_app_desc: 'Share WanAndroid application developed with react native, Click to download:%{url}',
    tips: 'Tips',
    cancel: 'Cancel',
    confirm: 'Confirm',
    logout_confirm: 'Are you sure to log out',
    tips_not_loggin: 'Not logged in',
    tips_username_empty: 'User name cannot be empty',
    tips_pwd_empty: 'Password cannot be empty',
    tips_pwd_confirm_empty: 'Confirm password cannot be empty',
    login: 'Log In',
    login_userName: 'User name',
    login_pwd: 'Password',
    login_to_register: 'New users? To ',
    login_success: 'Login success!',
    register_to_login: 'Have an account? To',
    register: 'register',
    register_confirm_pwd: 'Confirm password',
    footer_load_more: 'Playing with life loading...',
    tab_navigation: 'Navigation',
    tab_home: 'WanAndroid',
    tab_project: 'Project',
    tab_hierarchy: 'Hierarchy',
    tab_public_account: 'PublicAccount',
    loading: 'Loading...',
    tips_collected: 'Have been collected',
    article: 'Article',
    menu_home: 'Home',
    footer_no_more: 'All loaded',
} as const

export default LanguageMapper

export type LanguageMapperType = typeof LanguageMapper

type MapperKey = LanguageMapperType[keyof LanguageMapperType];

export type LanguageResource = {
    [key in MapperKey]: string
}