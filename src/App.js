import { memo, useEffect, useState } from 'react';
import { useRoutes } from 'react-router-dom';
import routes from './routes';
import 'antd/dist/antd.css'; // or 'antd/dist/antd.less'
import { useDispatch, useSelector } from 'react-redux';
import { authRestoreToken } from '@store/auth/auth.action';
import SocketContext from './socket/SocketReactContext';
import { SocketService } from '@socket/service';

const App = memo(() => {
  const element = useRoutes(routes);
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const [socket, setSocket] = useState(() => null);
  const [socketService, setSocketService] = useState(() => new SocketService());

  useEffect(() => {
    if (auth.storedToken) {
      dispatch(authRestoreToken());
    }
  }, [dispatch, auth.storedToken]);

  return (
    <SocketContext.Provider
      value={{
        socket,
        ctxSetSocket: setSocket,
        socketService,
        ctxSetSocketService: setSocketService,
      }}>
      {element}
    </SocketContext.Provider>
  );
});

export default App;
