import { Layout, Typography, Row, Col } from 'antd';
import { StyledSider } from './styled';
import { ChatCard, BaseInput } from '@components/index';
import { Outlet } from 'react-router-dom';
import * as __mock__ from 'src/__mock__';

import styles from './styles.module.scss';

export function ChatDesktop() {
  const _renderMockConversations = () => {
    return __mock__.conversations.map((conversation) => (
      <Col span={24}>
        <ChatCard
          from={conversation.from}
          avatar={conversation.avatar}
          lastMessage={conversation.lastMessage}
          onClick={() => console.log(`conversation._id`, conversation._id)}
        />
      </Col>
    ));
  };

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
          {_renderMockConversations()}
        </Row>
      </StyledSider>
      <Layout>
        <Outlet />
      </Layout>
    </Layout>
  );
}
