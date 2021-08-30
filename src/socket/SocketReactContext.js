import { createContext } from 'react';
import { SocketService } from './service';

/**
 * @typedef {Object} SocketContextType
 * @property {(socket: import('socket.io-client').Socket) => void} ctxSetSocket
 * @property {SocketService} socketService
 * @property {(socketService: SocketService) => any} ctxSetSocketService
 */
const initialContext = {
  socket: null,
  ctxSetSocket: (_socket) => null,
  socketService: new SocketService(),
  ctxSetSocketService: (_socketService) => null,
};

const SocketContext = createContext(initialContext);

export default SocketContext;
