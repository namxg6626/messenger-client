import { useContext, useEffect } from 'react';
import io from 'socket.io-client';
import SocketReactContext from './SocketReactContext';
import { useSelector } from 'react-redux';
import { SocketEventEnum } from './events';

export const useAuthenticatedSocket = () => {
  const { ctxSetSocket, socket } = useContext(SocketReactContext);
  const auth = useSelector((state) => state.auth);

  useEffect(() => {
    if (!socket) {
      const newSocket = io(process.env.REACT_APP_SOCKETIO_URI, {
        auth: {
          token: auth.token,
        },
      });

      ctxSetSocket(newSocket);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth.token, socket]);

  useEffect(() => {
    if (socket) {
      socket.on(SocketEventEnum.CONNECT_ERROR, (error) => {
        console.log(`error`, error);
      });

      socket.on(SocketEventEnum.ERROR, (e) => console.log(`e`, e));

      socket.on(SocketEventEnum.SV_SEND_CURR_USER, (e) => console.log(`curr user`, e));

      socket.on(SocketEventEnum.SV_SEND_USERS_ONLINE, (e) => console.log(`onlines`, e));
    }
  }, [socket]);

  return { socket, ctxSetSocket };
};
