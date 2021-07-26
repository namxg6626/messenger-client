import { Layout, Typography, Row, Col } from 'antd';
import { StyledSider } from './styled';
import { ChatCard, BaseInput } from '@components/index';
import { Outlet } from 'react-router-dom';

import styles from './styles.module.scss';

export function ChatDesktop() {
  return (
    <Layout>
      <StyledSider>
        <Typography.Title level={3}>Chats</Typography.Title>
        <Row>
          <Col span={24}>
            <BaseInput
              className={styles.baseInput}
              fullWidth
              placeholder='Tìm kiếm người dùng hoặc nhóm..'
            />
          </Col>
          <Col span={24}>
            <ChatCard />
          </Col>
          <Col span={24}>
            <ChatCard />
          </Col>
          <Col span={24}>
            <ChatCard />
          </Col>
          <Col span={24}>
            <ChatCard />
          </Col>
          <Col span={24}>
            <ChatCard />
          </Col>
        </Row>
      </StyledSider>
      <Layout>
        <Outlet />
      </Layout>
    </Layout>
  );
}
