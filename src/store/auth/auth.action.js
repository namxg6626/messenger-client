import AuthHttp from '@http/auth.http';

const authHttp = new AuthHttp();

const AuthActionsEnum = {
  LOADING: 'auth/LOADING',
  STOP_LOADING: 'auth/STOP_LOADING',

  FAILED: 'auth/FAILED',
  CLEAR_ERROR: 'auth/CLEAR_ERROR',

  LOGIN: 'auth/LOGIN',
  LOGOUT: 'auth/LOGOUT',
  RESTORE_TOKEN: 'auth/RESTORE_TOKEN',
};

export const authLoginAction = (data, remember) => ({
  type: AuthActionsEnum.LOGIN,
  payload: { data, remember },
});

export const authLogoutAction = () => ({
  type: AuthActionsEnum.LOGOUT,
});

export const authFailedAction = (error) => ({
  type: AuthActionsEnum.FAILED,
  payload: { error },
});

export const authStopLoadingAction = () => ({
  type: AuthActionsEnum.STOP_LOADING,
});

export const authLoadingAction = () => ({
  type: AuthActionsEnum.LOADING,
});

export const authRestoreToken = () => ({
  type: AuthActionsEnum.RESTORE_TOKEN,
});

export const authClearError = () => ({
  type: AuthActionsEnum.CLEAR_ERROR,
});

export const authLoginAsyncAction =
  (username, password, remember = false) =>
  (dispatch) => {
    dispatch(authLoadingAction());

    authHttp
      .login(username, password)
      .then((data) => {
        dispatch(authLoginAction(data, remember));
      })
      .catch((e) => dispatch(authFailedAction(e)))
      .finally(() => dispatch(authStopLoadingAction()));
  };

export const authSignUpAsyncAction =
  (username, displayname, password, remember = false) =>
  (dispatch) => {
    dispatch(authLoadingAction());

    authHttp
      .signUp(username, displayname, password)
      .then((data) => {
        dispatch(authLoginAsyncAction(username, password, remember));
      })
      .catch((e) => dispatch(authFailedAction(e)))
      .finally(() => dispatch(authStopLoadingAction()));
  };

export default AuthActionsEnum;
