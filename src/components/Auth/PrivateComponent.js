import { useEffect, memo } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { authRestoreToken } from '@store/auth/auth.action';

export const PrivateComponent = memo((props) => {
  const auth = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const dispatch = useDispatch();

  useEffect(() => {
    if (!auth.token) {
      navigate('');
    }
  }, [auth, navigate]);

  return auth.token ? props.children : <Navigate to='/' />;
});
