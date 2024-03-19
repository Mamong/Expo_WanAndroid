import { View, Text, StyleSheet, Pressable } from "react-native";
import Icon from '@expo/vector-icons/Ionicons';

import globalStyles from "@/styles/globalStyles";
import { LanguageOpt, getLanguageList, i18n, i18n2 } from "@/utils/Utility";
import { DEVICE_WIDTH, getRealDP as dp } from '../../utils/screenUtil';
import { Color } from "@/constants/Colors";
import { useAppDispatch, useAppSelector } from "@/store";
import { setLanguage } from "@/store/slices/user.slice";
import NavBar from "@/components/NavBar";


export default function LanguageScreen() {
    const language = useAppSelector((state) => state.user.language)
    const dispatch = useAppDispatch()

    const renderLanguageItem = (item: LanguageOpt) => <Pressable
        key={item.languageCode}
        onPress={() => dispatch(setLanguage(item.languageCode))}>
        {({ pressed }) =>
            <View style={[styles.itemWrapper, { opacity: pressed ? 0.5 : 1.0 }]}>
                <Text style={styles.languageText}>{item.language}</Text>
                {language === item.languageCode ? (
                    <Icon name={'checkmark'} size={dp(50)} color={Color.WX_GREEN} />
                ) : null}
            </View>
        }
    </Pressable>

    return (
        <>
            <NavBar options={{
                title: i18n2("language"),
            }} />
            <View style={globalStyles.container}>
                {getLanguageList().map(el => renderLanguageItem(el))}
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    itemWrapper: {
        height: dp(120),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: dp(28),
        backgroundColor: Color.WHITE,
        borderBottomWidth: dp(1),
        borderBottomColor: Color.SPLIT_LINE,
    },
    languageText: {
        fontSize: dp(30),
        color: Color.TEXT_MAIN,
    },
});