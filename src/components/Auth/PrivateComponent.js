import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { authRestoreToken } from '@store/auth/auth.action';

export function PrivateComponent(props) {
  const auth = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(authRestoreToken());
  }, [dispatch]);

  return auth.token ? props.children : <Navigate to='' />;
}
