import { Layout } from 'antd';
import { StyledSider } from './styled';

const { Content, Header } = Layout;

export function ChatDesktop() {
  return (
    <Layout>
      <Header>
        <p style={{ color: 'white' }}>Header</p>
      </Header>
      <Layout>
        <StyledSider>
          <p style={{ color: 'white' }}>StyledSider</p>
        </StyledSider>
        <Content>
          <p>Content</p>
        </Content>
      </Layout>
    </Layout>
  );
}
