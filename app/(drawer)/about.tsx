import { View, Text, Image, StyleSheet } from 'react-native'
import { router } from 'expo-router'

import images from '@/assets'
import NavBar from '@/components/NavBar'
import { Color } from '@/constants/Colors'
import { useAppSelector } from '@/store'
import globalStyles from '@/styles/globalStyles'
import { i18n, i18n2 } from '@/utils/Utility'
import { getRealDP as dp } from '../../utils/screenUtil';
import { csdnStr, gitHubStr, qqEmail } from '@/constants/Consts'

export default function AboutScreen() {
  const themeColor = useAppSelector((state) => state.user.themeColor)

  return (
    <View style={globalStyles.container}>
      <NavBar />
      <View style={styles.content}>
        <Image style={styles.logo} source={images.logoIcon} />
        <Text style={styles.desc}>
          {i18n2('about_desc')}
        </Text>
        <View style={styles.item}>
          <Text style={styles.itemText}>
            {i18n2('about_email')}：
            <Text style={{ color: themeColor }}>{qqEmail}</Text>
          </Text>
        </View>
        <View style={styles.item}>
          <Text style={styles.itemText}>
            CSDN：
            <Text
              style={[styles.underlineText, { color: themeColor }]}
              onPress={() => {
                router.navigate({
                  pathname: '/webview',
                  params: {
                    title: 'CSDN',
                    url: csdnStr,
                  }
                });
              }}>
              {csdnStr}
            </Text>
          </Text>
        </View>
        <View style={styles.item}>
          <Text style={styles.itemText}>
            GitHub：
            <Text
              style={[styles.underlineText, { color: themeColor }]}
              onPress={() => {
                router.navigate({
                  pathname: '/webview',
                  params: {
                    title: 'GitHub',
                    url: gitHubStr,
                  }
                });
              }}>
              {gitHubStr}
            </Text>
          </Text>
        </View>
        <Text style={styles.bottomText}>
          {i18n2('about_bottom')}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    backgroundColor: Color.WHITE,
    alignItems: "stretch",
    paddingVertical: dp(150),
  },
  logo: {
    width: dp(180),
    height: dp(180),
    borderRadius: dp(90),
    marginBottom: dp(50),
    alignSelf: "center"
  },
  desc: {
    fontSize: dp(30),
    color: Color.TEXT_MAIN,
    marginTop: dp(20),
    marginBottom: dp(100),
    textAlign: "center"
  },
  blogStyle: {
    width: dp(200),
    height: dp(200),
    borderRadius: dp(100),
    backgroundColor: '#FF7256',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: dp(20),
    marginHorizontal: dp(20),
  },
  githubStyle: {
    width: dp(200),
    height: dp(200),
    borderRadius: dp(100),
    backgroundColor: '#5F9EA0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: dp(20),
    marginHorizontal: dp(20),
  },
  item: {
    paddingHorizontal: dp(50),
    marginBottom: dp(50),
  },
  itemText: {
    fontSize: dp(30),
    color: Color.TEXT_MAIN,
  },
  bottomText: {
    position: 'absolute',
    bottom: 0,
    alignSelf: "center",
    marginVertical: dp(50),
    paddingHorizontal: dp(28),
    fontSize: dp(26),
    color: Color.TEXT_MAIN,
  },
  underlineText: {
    textDecorationLine: 'underline',
  },
});