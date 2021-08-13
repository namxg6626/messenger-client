import { memo, useEffect, useState } from 'react';
import { useRoutes } from 'react-router-dom';
import routes from './routes';
import 'antd/dist/antd.css'; // or 'antd/dist/antd.less'
import { useDispatch, useSelector } from 'react-redux';
import { authRestoreToken } from '@store/auth/auth.action';
import SocketContext from './socket/SocketReactContext';

const App = memo(() => {
  const element = useRoutes(routes);
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const [socket, setSocket] = useState(() => null);

  useEffect(() => {
    if (auth.storedToken) {
      dispatch(authRestoreToken());
    }
  }, [dispatch, auth.storedToken]);

  return (
    <SocketContext.Provider
      value={{
        ctxSetSocket: setSocket,
        socket,
      }}>
      {element}
    </SocketContext.Provider>
  );
});

export default App;
