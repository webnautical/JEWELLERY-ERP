import { configureStore, combineReducers, createAction } from '@reduxjs/toolkit';
import { AuthAPI } from '../api/auth/AuthAPI';
import { UserAPI } from '../api/UserAPI';
import { RdAPI } from '../api/RdAPI';
import chatReducer from '../api/chatSlice';
import { setupListeners } from '@reduxjs/toolkit/query';
import { RatesAPI } from '../api/Ratesapi';

export const resetAllState = createAction('RESET_ALL');

const appReducer = combineReducers({
  chat: chatReducer,
  [AuthAPI.reducerPath]: AuthAPI.reducer,
  [UserAPI.reducerPath]: UserAPI.reducer,
  [RdAPI.reducerPath]: RdAPI.reducer,
  [RatesAPI.reducerPath]: RatesAPI.reducer,
});

const rootReducer = (state, action) => {
  if (action.type === resetAllState.type) {
    state = undefined;
  }
  return appReducer(state, action);
};

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(AuthAPI.middleware)
      .concat(UserAPI.middleware)
      .concat(RdAPI.middleware)
      .concat(RatesAPI.middleware)
});

setupListeners(store.dispatch)