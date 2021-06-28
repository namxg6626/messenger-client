import { Layout } from 'antd';
import styled from 'styled-components';
import { colors } from '../../assets/variables/colors';

const { Sider, Header, Content } = Layout;
const siderWidth = '340px';

export const StyledSider = styled((props) => <Sider aria-label='styled-ant-sider' {...props} />)`
  position: sticky;
  left: 0;
  top: 0;

  height: 100vh;
  padding: 1rem 2rem;
  width: ${siderWidth} !important;
  min-width: ${siderWidth} !important;
  max-width: ${siderWidth} !important;

  overflow: hidden;
  background-color: ${colors.grayLight};
`;

export const StyledHeader = styled((props) => <Header aria-label='styled-ant-header' {...props} />)`
  height: 80px;
  background-color: ${colors.white};
  border-bottom: 1px solid ${colors.grayLighter} !important;
`;

export const StyledContent = styled((props) => (
  <Content aria-label='styled-ant-content' {...props} />
))`
  display: flex;
  flex-direction: column;
  background-color: ${colors.white};
`;
