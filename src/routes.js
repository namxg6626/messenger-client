import { PrivateComponent } from './components';
import { ChatDesktop } from './layout';
import Auth from './pages/Auth';
import Chat from './pages/Chat';
import Welcome from './pages/Welcome';

const routes = [
  {
    path: 'messages',
    element: (
      <PrivateComponent>
        <ChatDesktop />
      </PrivateComponent>
    ),
    children: [
      {
        path: ':conversationId',
        element: <Chat />,
      },
      {
        path: '/',
        element: <Welcome />,
      },
    ],
  },
  {
    path: '',
    element: <Auth />,
  },
];

export default routes;
