import { useEffect } from 'react';
import { useRoutes } from 'react-router-dom';

import { useDispatch } from 'react-redux';
import { authRestoreToken } from './store/auth/auth.action';

import routes from './routes';
import 'antd/dist/antd.css'; // or 'antd/dist/antd.less'

function App() {
  // <Routes>
  //   <Route path='/messages' element={<ChatDesktop />} />
  //   <Navigate to='/messages' />
  // </Routes>

  const element = useRoutes(routes);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(authRestoreToken());
  }, []);

  return element;
}

export default App;
