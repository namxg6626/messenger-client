import { Route, Routes, Navigate, useRoutes } from 'react-router-dom';
import { ChatDesktop } from './layout';
import routes from './routes';

import 'antd/dist/antd.css'; // or 'antd/dist/antd.less'

function App() {
  // <Routes>
  //   <Route path='/messages' element={<ChatDesktop />} />
  //   <Navigate to='/messages' />
  // </Routes>

  const element = useRoutes(routes);

  return element;
}

export default App;
