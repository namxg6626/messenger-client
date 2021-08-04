import { memo, useEffect } from 'react';
import { useRoutes } from 'react-router-dom';

import routes from './routes';
import 'antd/dist/antd.css'; // or 'antd/dist/antd.less'
import { useDispatch, useSelector } from 'react-redux';
import { authRestoreToken } from '@store/auth/auth.action';

const App = memo(() => {
  const element = useRoutes(routes);
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

  useEffect(() => {
    if (auth.storedToken) {
      dispatch(authRestoreToken());
    }
  }, [dispatch, auth.storedToken]);

  return element;
});

export default App;
