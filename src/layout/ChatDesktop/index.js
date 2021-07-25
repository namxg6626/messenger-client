import { Layout, Typography, Avatar, Row, Col } from 'antd';
import { StyledSider, StyledHeader, StyledContent } from './styled';
import { ChatCard, BaseInput } from '@components/index';
import { Outlet } from 'react-router-dom';

import styles from './styles.module.scss';
import { generateRandomColor } from '../../utils/generator';

const { Text, Paragraph } = Typography;
export function ChatDesktop() {
  return (
    <Layout>
      <StyledSider>
        <Typography.Title level={3}>Chats</Typography.Title>
        <BaseInput
          className={styles.baseInput}
          fullWidth
          placeholder='Tìm kiếm người dùng hoặc nhóm..'
        />
        <Row>
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
