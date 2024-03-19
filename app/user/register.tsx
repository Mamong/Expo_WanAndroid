import { useEffect, useState } from 'react';
import { View, Text, ScrollView, TextInput, StyleSheet, Pressable } from 'react-native'
import { useRouter } from 'expo-router'
import Icon from '@expo/vector-icons/Ionicons';

import NavBar from '@/components/NavBar'
import { i18n, i18n2, showToast } from '@/utils/Utility'
import { DEVICE_WIDTH, getRealDP as dp } from '../../utils/screenUtil';
import { Color } from '@/constants/Colors';
import { useAppDispatch, useAppSelector } from '@/store';
import { useRegisterMutation } from '@/services/user.service';
import { setUserInfo } from '@/store/slices/user.slice';

export default function RegisterScreen() {
    const [userName, setUserName] = useState('')
    const [password, setPassword] = useState('')
    const [isSecure, setIsSecure] = useState(false)
    const [passwordAgain, setPasswordAgain] = useState('')
    const [isSecureAgain, setIsSecureAgain] = useState(false)

    const router = useRouter()
    const dispatch = useAppDispatch()
    const themeColor = useAppSelector((state) => state.user.themeColor)

    const [registerUser, { data, isLoading, isSuccess, isError, error }] = useRegisterMutation()

    const toRegister = () => {
        if (userName === '') {
            showToast(i18n2('tips_username_empty'));
        } else if (password === '') {
            showToast(i18n2('tips_pwd_empty'));
        } else if (passwordAgain === '') {
            showToast(i18n2('tips_pwd_confirm_empty'));
        } else {
            registerUser(
                {
                    username: userName,
                    password: password,
                    repassword: passwordAgain,
                }
            )
        }
    }
    useEffect(() => {

        if (error) {
            if ('status' in error) {
                // you can access all properties of `FetchBaseQueryError` here
                const errMsg = 'error' in error ? error.error : JSON.stringify(error.data)
                showToast(errMsg)

            } else if (error.message) {
                // you can access all properties of `SerializedError` here
                showToast(error.message)
            }
        }

        if (isSuccess && data) {
            dispatch(setUserInfo(data))
            showToast(i18n2('login'))
            router.navigate('/(drawer)/(tabs)/')
        }
    }, [isSuccess, isError]);


    return (
        <View style={styles.container}>
            <NavBar options={{ title: i18n2('register') }} />
            <ScrollView keyboardShouldPersistTaps="handled">
                <View style={styles.content}>
                    <View style={styles.textInputWrapper}>
                        <Icon name={'person'} size={dp(50)} color={themeColor} />
                        <TextInput
                            style={styles.textInput}
                            autoFocus
                            placeholder={i18n2('login_userName')}
                            placeholderTextColor={Color.TEXT_LIGHT}
                            autoCapitalize={'none'}
                            value={userName}
                            onChangeText={text => {
                                setUserName(text)
                            }}
                        />
                    </View>
                    <View style={styles.textInputWrapper}>
                        <Icon name={'lock-closed'} size={dp(50)} color={themeColor} />
                        <TextInput
                            style={styles.textInput}
                            placeholder={i18n2('login_pwd')}
                            placeholderTextColor={Color.TEXT_LIGHT}
                            autoCapitalize={'none'}
                            value={password}
                            secureTextEntry={isSecure}
                            onChangeText={text => {
                                setPassword(text)
                            }}
                        />
                        <Pressable
                            style={styles.eye}
                            onPress={() => {
                                setIsSecure(state => !state)
                            }}>
                            <Icon
                                name={isSecure ? 'eye' : 'eye-off'}
                                size={dp(50)}
                                color={themeColor}
                            />
                        </Pressable>
                    </View>
                    <View style={styles.textInputWrapper}>
                        <Icon name={'lock-closed'} size={dp(50)} color={themeColor} />
                        <TextInput
                            style={styles.textInput}
                            placeholder={i18n2('register_confirm_pwd')}
                            placeholderTextColor={Color.TEXT_LIGHT}
                            autoCapitalize={'none'}
                            value={passwordAgain}
                            secureTextEntry={isSecureAgain}
                            onChangeText={text => {
                                setPasswordAgain(text)
                            }}
                        />
                        <Pressable
                            style={styles.eye}
                            onPress={() => {
                                setIsSecureAgain(state => !state)
                            }}>
                            <Icon
                                name={isSecureAgain ? 'eye' : 'eye-off'}
                                size={dp(50)}
                                color={themeColor}
                            />
                        </Pressable>
                    </View>
                    <Pressable
                        onPress={toRegister}
                        style={({ pressed }) => [
                            styles.register,
                            {
                                opacity: pressed ? 0.6 : 1.0,
                                backgroundColor: themeColor
                            }
                        ]}>
                        <Text style={styles.registerText}>{i18n2('register')}</Text>
                    </Pressable>
                    <Pressable onPress={() => {
                        router.navigate({
                            pathname: "/user/login"
                        })
                    }}>
                        <Text style={[
                            styles.login,
                            { color: themeColor }
                        ]}>
                            <Text style={{ color: Color.TEXT_LIGHT }}>
                                {i18n2('register_to_login')}
                            </Text>
                            {i18n2('login')}
                        </Text>
                    </Pressable>
                </View>
            </ScrollView>
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Color.WHITE,
    },
    content: {
        flex: 1,
        alignItems: 'center',
        paddingTop: dp(100),
    },
    textInputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    textInput: {
        width: DEVICE_WIDTH * 0.7,
        height: dp(80),
        margin: dp(20),
        borderColor: Color.ICON_GRAY,
        borderBottomWidth: dp(1),
        paddingLeft: dp(5),
        paddingRight: dp(50),
        color: Color.TEXT_MAIN,
    },
    register: {
        width: DEVICE_WIDTH * 0.7,
        marginTop: dp(60),
        padding: dp(30),
        borderRadius: dp(50),
    },
    registerText: {
        color: 'white',
        textAlign: 'center',
        fontSize: dp(32),
    },
    eye: {
        position: 'absolute',
        right: dp(20),
        backgroundColor: Color.WHITE,
        padding: dp(5),
    },
    login: {
        marginTop: dp(40),
        fontSize: dp(28),
    },
});