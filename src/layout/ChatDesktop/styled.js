import { Layout } from 'antd';
import styled from 'styled-components';
import { colors } from '../../assets/variables/colors';

const { Sider } = Layout;
const siderWidth = '400px';

export const StyledSider = styled((props) => <Sider aria-label='styled-ant-sider' {...props} />)`
  position: sticky;
  left: 0;
  top: 0;

  height: 100vh;
  padding: 0rem 2rem 1rem 2rem;
  width: ${siderWidth} !important;
  min-width: ${siderWidth} !important;
  max-width: ${siderWidth} !important;

  background-color: ${colors.grayLight};
`;
