import { ChatDesktop } from './layout';
import Chat from './pages/Chat';

const routes = [
  {
    path: 'messages',
    element: <ChatDesktop />,
    children: [
      {
        path: ':id',
        element: <Chat />,
      },
    ],
  },
];

export default routes;
