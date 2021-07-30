import { combineReducers } from 'redux';
import authReducer from './auth/auth.reducer';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const persistAuthConfig = {
  key: 'auth',
  whitelist: ['storedToken', 'data'],
  storage,
};

export default combineReducers({
  auth: persistReducer(persistAuthConfig, authReducer),
});
