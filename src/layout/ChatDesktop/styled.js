import { Layout } from 'antd';
import styled from 'styled-components';

const { Sider } = Layout;

export const StyledSider = styled((props) => <Sider aria-label='styled-ant-sider' {...props} />)`
  height: 100vh;
  position: sticky;
  left: 0;
  top: 0;
  background-color: white;
`;
