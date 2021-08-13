import { createContext } from 'react';

const SocketContext = createContext({ ctxSetSocket: null, socket: null });

export default SocketContext;
