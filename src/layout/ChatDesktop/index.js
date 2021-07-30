import { Layout, Typography, Row, Col, Divider } from 'antd';
import { StyledSider } from './styled';
import { ChatCard, BaseInput } from '@components/index';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import * as __mock__ from 'src/__mock__';

import styles from './styles.module.scss';

export function ChatDesktop() {
  const navigate = useNavigate();
  const params = useParams();

  console.log(`params`, params);

  const _renderMockConversations = () => {
    return __mock__.conversations.map((conversation) => (
      <Col span={24}>
        <ChatCard
          from={conversation.from}
          avatar={conversation.avatar}
          lastMessage={conversation.lastMessage}
          onClick={() => navigate('/messages/' + conversation._id)}
        />
      </Col>
    ));
  };

  return (
    <Layout>
      <StyledSider className={styles.siderScroll}>
        <div className={styles.siderHead}>
          <Typography.Title level={3}>Chats</Typography.Title>
          <Row>
            <Col span={24}>
              <BaseInput
                className={styles.baseInput}
                fullWidth
                placeholder='Tìm kiếm người dùng hoặc nhóm..'
              />
            </Col>
          </Row>
          <Divider />
        </div>
        <Row gutter={16}>{_renderMockConversations()}</Row>
      </StyledSider>
      <Divider className={styles.dividerVertical} type='vertical' />
      <Layout>
        <Outlet />
      </Layout>
    </Layout>
  );
}
