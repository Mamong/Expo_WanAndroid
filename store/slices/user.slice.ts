import { Color } from '@/constants/Colors'
import LanguageUtil from '@/localization/LanguageUtil'
import AuthUtil from '@/utils/AuthUtil'
import { LanguageOpt } from '@/utils/Utility'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'

interface UserState {
  isLogin: boolean,
  userInfo: UserInfo | null,
  token: string
  status: 'loading' | 'failed' | 'idle',
  themeColor: string,
  language: LanguageOpt['languageCode']
}

const initialState = {
  isLogin: false,
  userInfo: null,
  token: '',
  status: 'idle',
  themeColor: Color.THEME, // 用户设置APP主题色
  language: 'zhHans', // APP默认语言
} satisfies UserState as UserState

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserInfo: (state, action: PayloadAction<UserInfo | null>) => {
      state.userInfo = action.payload
      if (action.payload == null) AuthUtil.removeCookie()//state.token = ''
      state.isLogin = !!action.payload
    },
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload
    },
    setThemeColor: (state, action: PayloadAction<string>) => {
      state.themeColor = action.payload
    },
    setLanguage: (state, action: PayloadAction<UserState["language"]>) => {
      state.language = action.payload
      LanguageUtil.locale = action.payload;
      AuthUtil.saveAppLanguage(action.payload)
    },
  },
  extraReducers: builder => {
    builder
      .addCase(setTokenAsync.pending, (state, action) => {
        state.status = 'loading'
      })
      .addCase(setTokenAsync.rejected, (state, action) => {
        state.status = 'failed'
      })
      .addCase(setTokenAsync.fulfilled, (state, action) => {
        state.status = 'idle'
      })
  },
})

export const setTokenAsync = createAsyncThunk(
  'user/setTokenAsync',
  async (token: string, { dispatch, getState }) => {
    try {
      await AsyncStorage.setItem('token', token)
      dispatch(setToken(token))
      return true
    } catch (err) {
      return false
    }
  }
)

export const { setUserInfo, setToken, setThemeColor, setLanguage } = userSlice.actions

export default userSlice.reducer