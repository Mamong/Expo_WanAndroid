import { configureStore, combineReducers, Action } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import { TypedUseSelectorHook, useSelector, useDispatch } from 'react-redux';

import { persistStore, persistReducer } from 'redux-persist';

import AsyncStorage from '@react-native-async-storage/async-storage'
//import { createBlacklistFilter } from 'redux-persist-transform-filter'
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2'
import apiSlice from '../services/api';
import userReducer from './slices/user.slice';

const persistConfig = {
  key: 'root',
  version: 1,
  storage:AsyncStorage,
  transforms:[],
  stateReconciler: autoMergeLevel2
  //blacklist: []
};

const rootReducer = combineReducers({
  user: userReducer,
  [apiSlice.reducerPath]: apiSlice.reducer,
})

//https://github.com/rt2zz/redux-persist/issues/1140
export type RootState = ReturnType<typeof rootReducer>;

const persistedReducer = persistReducer<RootState, Action>(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware => getDefaultMiddleware({
    serializableCheck: false,
    immutableCheck: { warnAfter: 200 },
  }).concat(apiSlice.middleware),

});

setupListeners(store.dispatch)

export const persistor = persistStore(store);

//export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<any>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;