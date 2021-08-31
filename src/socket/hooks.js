import { useContext, useEffect } from 'react';
import io from 'socket.io-client';
import SocketReactContext from './SocketReactContext';
import { useSelector } from 'react-redux';
import { SocketEventEnum } from './events';
import { config } from 'src/constants/config';
import equal from 'deep-equal';

export const useAuthenticatedSocket = () => {
  const { ctxSetSocket, socket, socketService } = useContext(SocketReactContext);
  const auth = useSelector((state) => state.auth, equal);

  useEffect(() => {
    if (!socket) {
      const newSocket = io(config.SOCKETIO_URI, {
        auth: {
          token: auth.token,
        },
      });

      ctxSetSocket(newSocket);
      socketService.setSocket(newSocket);
      socketService.clientFetchUser();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth.token, socket]);

  useEffect(() => {
    if (socket) {
      socket.on(SocketEventEnum.CONNECT_ERROR, (error) => {
        console.log(`error`, error);
      });

      socket.on(SocketEventEnum.ERROR, (e) => console.log(`e`, e));

      console.log(`socket`, socket);
    }
  }, [socket]);

  return { socket, ctxSetSocket, socketService };
};
