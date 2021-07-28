import { getInitialState } from '@utils/index';
import AuthActionsEnum from './auth.action';

const initialState = {
  ...getInitialState(),
  storedToken: '', // store in localStorage only, not for fetching
  token: '', // fetching only,  will be initialized by storedToken
};

const authReducer = (state = initialState, action) => {
  const { payload = {} } = action;

  switch (action.type) {
    case AuthActionsEnum.LOADING:
      return {
        ...state,
        isLoading: true,
      };

    case AuthActionsEnum.STOP_LOADING:
      return {
        ...state,
        isLoading: false,
      };

    case AuthActionsEnum.FAILED:
      return {
        ...state,
        error: payload.error,
      };

    case AuthActionsEnum.CLEAR_ERROR:
      return {
        ...state,
        error: '',
      };

    case AuthActionsEnum.LOGIN:
      return {
        ...state,
        data: action.payload.data,
        storedToken: action.payload.remember ? action.payload.data.jwt || '' : '',
        token: action.payload.data.jwt || '',
        error: '',
      };

    case AuthActionsEnum.LOGOUT:
      return initialState;

    case AuthActionsEnum.RESTORE_TOKEN:
      return {
        ...state,
        token: state.storedToken,
      };

    default:
      return state;
  }
};

export default authReducer;
