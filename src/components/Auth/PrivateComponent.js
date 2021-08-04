import { useEffect, memo } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export const PrivateComponent = memo((props) => {
  const auth = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (!auth.token) {
      navigate('');
    }
  }, [auth, navigate]);

  return auth.token ? props.children : <Navigate to='/' />;
});
