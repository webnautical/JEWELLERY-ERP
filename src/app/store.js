import { configureStore, combineReducers, createAction } from '@reduxjs/toolkit';
import { AuthAPI } from '../api/auth/AuthAPI';
import { UserAPI } from '../api/UserAPI';
import { RdAPI } from '../api/RdAPI';
import globalReducer from '../api/globalSlice';
import { setupListeners } from '@reduxjs/toolkit/query';
import { RatesAPI } from '../api/Ratesapi';
import { SalesAPI } from '../api/SalesAPI';
import { CostingAPI } from '../api/CostingAPI';
import { AdminAPI } from '../api/AdminAPI';
import { CommonAPI } from '../api/CommonAPI';

export const resetAllState = createAction('RESET_ALL');

const appReducer = combineReducers({
  global: globalReducer,
  [AuthAPI.reducerPath]: AuthAPI.reducer,
  [UserAPI.reducerPath]: UserAPI.reducer,
  [RdAPI.reducerPath]: RdAPI.reducer,
  [RatesAPI.reducerPath]: RatesAPI.reducer,
  [SalesAPI.reducerPath]: SalesAPI.reducer,
  [CostingAPI.reducerPath]: CostingAPI.reducer,
  [AdminAPI.reducerPath]: AdminAPI.reducer,
  [CommonAPI.reducerPath]: CommonAPI.reducer,
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
      .concat(SalesAPI.middleware)
      .concat(CostingAPI.middleware)
      .concat(AdminAPI.middleware)
      .concat(CommonAPI.middleware)
});

setupListeners(store.dispatch)