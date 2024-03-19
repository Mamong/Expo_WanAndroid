import { useRef, useState } from 'react';
import { View, Text, Animated, ActivityIndicator, StyleSheet, Pressable } from 'react-native'
import { router } from 'expo-router'
import Icon from '@expo/vector-icons/Ionicons';

import { getLanguageList, getThemeColorDataSource, i18n, i18n2 } from '@/utils/Utility'
import { DEVICE_WIDTH, getRealDP as dp } from '../../utils/screenUtil';
import globalStyles from '@/styles/globalStyles';
import { Color } from '@/constants/Colors';
import NavBar from '@/components/NavBar';

import { useAppDispatch, useAppSelector } from '@/store'
import { setThemeColor } from '@/store/slices/user.slice';

export default function SettingsScreen(props: any) {

  const { themeColor, language } = useAppSelector((state) => state.user)
  const dispatch = useAppDispatch()

  const [isShowColor, setIsShowColor] = useState(false)
  const [isShowIndicator, setIsShowIndicator] = useState(false)
  const rotation = useRef(new Animated.Value(0))

  const currentLanguage = getLanguageList().find(
    el => el.languageCode === language,
  );

  const onPressTheme = () => {
    setIsShowColor(state => !state)
    if (isShowColor) {
      Animated.timing(rotation.current, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true
      }).start();
    } else {
      Animated.timing(rotation.current, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true
      }).start();
    }
  }

  return (
    <>
      <NavBar options={{
        title: i18n2('menu_settings')
      }} />
      <View style={globalStyles.container}>
        {/* 主题 */}
        <Pressable
          onPress={onPressTheme}>
          <View style={styles.itemWrapper}>
            <View style={styles.sideWrapper}>
              <Icon
                name={'color-palette'}
                size={dp(50)}
                color={Color.TEXT_DARK}
              />
              <Text style={styles.languageText}>{i18n2('menu_theme')}</Text>
            </View>
            <View style={styles.sideWrapper}>
              <View style={[styles.themeView, { backgroundColor: themeColor }]} />
              <Animated.View
                style={{
                  transform: [
                    {
                      rotateZ: rotation.current.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['0deg', '180deg'],
                      }),
                    },
                  ],
                }}>
                <Icon
                  name="arrow-down"
                  size={dp(50)}
                  color={Color.TEXT_DARK}
                />
              </Animated.View>
            </View>
          </View>
        </Pressable>
        {/* 展开主题色 */}
        {isShowColor ? (
          <View style={styles.themeColorWrapper}>
            {getThemeColorDataSource().map(el => (
              <Pressable
                key={el.color}
                onPress={async () => {
                  //界面更新会被dispatch阻塞，因此要对它做一个延迟
                  setIsShowIndicator(true);
                  setTimeout(()=>{
                    dispatch(setThemeColor(el.color))
                    setIsShowIndicator(false);
                  })
                }}
                style={({ pressed }) => [
                  {
                    backgroundColor: el.color,
                    opacity: pressed ? 0.5 : 1
                  },
                  styles.themeItemView]}
              />
            ))}
          </View>
        ) : null}
        <View style={globalStyles.splitLine} />
        {/* 多语言 */}
        <Pressable
          onPress={() => router.navigate('/language')}>
          <View style={styles.itemWrapper}>
            <View style={styles.sideWrapper}>
              <Icon name={'globe'} size={dp(50)} color={Color.TEXT_DARK} />
              <Text style={styles.languageText}>{i18n2('language')}</Text>
            </View>
            <View style={styles.sideWrapper}>
              <Text style={styles.settingLanguageText}>
                {currentLanguage?.language}
              </Text>
              <Icon
                name="arrow-forward"
                size={dp(50)}
                color={Color.TEXT_DARK}
              />
            </View>
          </View>
        </Pressable>
        <ActivityIndicator
          size="large"
          color={Color.TEXT_LIGHT}
          animating={isShowIndicator}
        />
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  itemWrapper: {
    height: dp(120),
    paddingHorizontal: dp(28),
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: Color.WHITE,
  },
  sideWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  languageText: {
    fontSize: dp(32),
    color: Color.TEXT_MAIN,
    marginLeft: dp(15),
  },
  settingLanguageText: {
    fontSize: dp(28),
    color: Color.TEXT_DARK,
    marginRight: dp(15),
  },
  themeView: {
    width: dp(40),
    height: dp(40),
    marginRight: dp(15),
  },
  themeItemView: {
    width: dp(70),
    height: dp(70),
    marginRight: dp(15),
    marginBottom: dp(15),
  },
  themeColorWrapper: {
    paddingHorizontal: dp(28),
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: Color.WHITE,
    paddingTop: dp(15),
  },
});