import { Switch, Route, Redirect } from 'react-router-dom';
import { ChatDesktop } from './layout';
import 'antd/dist/antd.css'; // or 'antd/dist/antd.less'

function App() {
  return (
    <Switch>
      <Route path='/messages' component={ChatDesktop} />
      <Redirect to='/messages' />
    </Switch>
  );
}

export default App;
