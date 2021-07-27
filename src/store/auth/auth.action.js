import * as AuthServices from './auth.service';

const AuthActionsEnum = {
  LOADING: 'auth/LOADING',
  STOP_LOADING: 'auth/STOP_LOADING',
  FAILED: 'auth/FAILED',
  LOGIN: 'auth/LOGIN',
  LOGOUT: 'auth/LOGOUT',
  RESTORE_TOKEN: 'auth/RESTORE_TOKEN',
};

export const authLoginAction = (data, remember) => ({
  type: AuthActionsEnum.LOGIN,
  payload: { data, remember },
});

export const authFailedAction = (error) => ({
  type: AuthActionsEnum.FAILED,
  payload: { error },
});

export const authStopLoadingAction = () => ({
  type: AuthActionsEnum.STOP_LOADING,
});

export const authRestoreToken = () => ({
  type: AuthActionsEnum.RESTORE_TOKEN,
});

export const authLoginAsyncAction =
  (username, password, remember = false) =>
  async (dispatch) => {
    AuthServices.login(username, password)
      .then((data) => dispatch(authLoginAction(data, remember)))
      .catch((e) => dispatch(authFailedAction(e)))
      .finally(() => dispatch(authStopLoadingAction()));
  };

export default AuthActionsEnum;
