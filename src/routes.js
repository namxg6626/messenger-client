import { ChatDesktop } from './layout';
import Chat from './pages/Chat';
import Welcome from './pages/Welcome';

const routes = [
  {
    path: 'messages',
    element: <ChatDesktop />,
    children: [
      {
        path: ':id',
        element: <Chat />,
      },
      {
        path: '/',
        element: <Welcome />,
      },
    ],
  },
];

export default routes;
