import { useEffect } from "react";
import { Text, Alert, Share, View, Image, StyleSheet, Pressable } from "react-native";
import { DrawerContentScrollView, DrawerItem, DrawerItemList } from "@react-navigation/drawer";
import { useRouter } from "expo-router";
import { Ionicons } from '@expo/vector-icons';

import { DEVICE_WIDTH, getRealDP as dp } from '../utils/screenUtil';
import { DrawerDataProps, getDrawerData, i18n, i18n2, showToast } from "@/utils/Utility";
import { useAppDispatch, useAppSelector } from "@/store";
import images from "@/assets";
import { Color } from "@/constants/Colors";
import { useLazyLogoutQuery } from "@/services/user.service";
import { setUserInfo } from "@/store/slices/user.slice";
import { downloadUrl } from "@/constants/Consts";

async function onShare() {
  try {
    await Share.share({
      message: i18n2('share_app_desc',{'url':downloadUrl}),
    });
  } catch (error: any) {
    alert(error.message);
  }
}


const renderHeader = (props: any) => {
  const { navigation, userInfo, themeColor, router } = props;
  const isLogin = useAppSelector((state) => state.user.isLogin)

  return (
    <Pressable
      disabled={isLogin}
      onPress={() => { router.navigate('/user/login') }}>
      <View style={[styles.topContainer, { backgroundColor: themeColor }]}>
        <View>
          {isLogin ? (
            <Image
              source={images.logoIcon}
              style={styles.logo}
              resizeMode={'cover'}
            />
          ) : (
            <View style={styles.myPhoto}>
              <Ionicons
                name='person'
                size={dp(150)}
                color={Color.ICON_GRAY}
              />
            </View>
          )}
          <Text style={styles.loginText}>
            {isLogin && userInfo.username
              ? userInfo.username
              : i18n2("tips_not_loggin")}
          </Text>
        </View>
        <Pressable style={({ pressed }) => [
          {
            opacity: pressed ? 0.5 : 1.0,
          }]}
          onPress={() => navigation.closeDrawer()}>
          <View style={styles.closeIconWrapper}>
            <Ionicons name='close' size={dp(50)} color={Color.WHITE} />
          </View>
        </Pressable>
      </View>
    </Pressable>
  );
}

export default function CustomDrawerContent(props: any) {
  const { isLogin, userInfo, themeColor } = useAppSelector((state) => state.user)

  const router = useRouter();
  const dispatch = useAppDispatch()
  const [logoutUser, { data, isFetching, isSuccess, isError, error }] = useLazyLogoutQuery()

  const onPress = (item: DrawerDataProps) => {
    if (!isLogin) {
      if (['/collection', '/coin-detail'].includes(item.route)) {
        router.navigate('/user/login')
        return
      }
    }


    if (item.route == 'share') {
      onShare()
    } else if (item.route == 'logout') {
      logout()
    } else {
      router.navigate(item.route as any)
    }
  }

  function logout() {
    Alert.alert(
      i18n2('tips'),
      `${i18n2("logout_confirm")}？`,
      [
        { text: i18n2('cancel'), onPress: () => { } },
        {
          text: i18n2('confirm'), onPress: () => {
            logoutUser()
          }
        },
      ],
      { cancelable: false },
    );
  }
  useEffect(() => {
    if (isError && error) {
      if ('status' in error) {
        // you can access all properties of `FetchBaseQueryError` here
        const errMsg = 'error' in error ? error.error : JSON.stringify(error.data)
        showToast(errMsg)

      } else if (error.message) {
        // you can access all properties of `SerializedError` here
        showToast(error.message)
      }
    }

    if (isSuccess) {
      dispatch(setUserInfo(null))
    }
  }, [isFetching]);

  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView contentContainerStyle={{ paddingTop: 0 }} {...props}>
        {/* <DrawerItemList {...props} /> */}
        {renderHeader({ userInfo, themeColor, navigation: props.navigation, router })}
        {
          getDrawerData().map(item => {
            if (!isLogin && item.route == 'logout') {
              return null
            }
            return <DrawerItem key={item.title}
              label={item.title}
              icon={() => <Ionicons name={item.iconName} size={dp(40)} color={Color.TEXT_DARK} />}
              onPress={() => onPress(item)} />
          })
        }
      </DrawerContentScrollView>
    </View>
  )
}


const styles = StyleSheet.create({
  topContainer: {
    height: dp(450),
    paddingTop: dp(130),
    paddingHorizontal: dp(28),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  myPhoto: {
    backgroundColor: Color.WHITE,
    width: dp(200),
    height: dp(200),
    borderRadius: dp(100),
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: dp(200),
    height: dp(200),
    borderRadius: dp(100),
    borderWidth: dp(3),
    borderColor: Color.WHITE,
  },
  loginText: {
    fontSize: dp(40),
    color: Color.WHITE,
    fontWeight: 'bold',
    marginTop: dp(40),
    marginLeft: dp(15),
  },
  drawerItem: {
    height: dp(100),
    paddingLeft: dp(28),
    flexDirection: 'row',
    alignItems: 'center',
  },
  drawerTitleText: {
    fontSize: dp(28),
    color: Color.TEXT_MAIN,
    marginLeft: dp(50),
    marginBottom: dp(5),
  },
  closeIconWrapper: {
    width: dp(60),
    height: dp(60),
    borderRadius: dp(30),
    justifyContent: 'center',
    alignItems: 'center',
  },
});
