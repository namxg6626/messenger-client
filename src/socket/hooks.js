import { useContext } from 'react';
import io from 'socket.io-client';
import SocketReactContext from './SocketReactContext';
import { useSelector } from 'react-redux';
import { SocketEventEnum } from './events';

export const useAuthenticatedSocket = () => {
  const { ctxSetSocket, socket } = useContext(SocketReactContext);
  const auth = useSelector((state) => state.auth);

  const newSocket = io(process.env.REACT_APP_SOCKETIO_URI, {
    auth: {
      token: auth.token,
    },
  });

  if (!socket) {
    ctxSetSocket(newSocket);
  }

  console.log(`newSocket`, newSocket);

  newSocket.on(SocketEventEnum.CONNECT_ERROR, (error) => {
    console.log(`error`, error);
  });

  newSocket.on(SocketEventEnum.ERROR, (e) => console.log(`e`, e));

  return socket;
};
