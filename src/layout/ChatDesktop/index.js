import { Layout, Typography, Input, Avatar, Row, Col } from 'antd';
import { StyledSider, StyledHeader, StyledContent } from './styled';
import { AvatarChat, ChatCard } from '../../components';
import styles from './styles.module.scss';

import { generateRandomColor } from '../../utils/generator';

const { Text, Paragraph } = Typography;
export function ChatDesktop() {
  const isGroupChat = true;

  return (
    <Layout>
      <StyledSider>
        <Typography.Title level={3}>Chats</Typography.Title>
        <Input.Search placeholder='Tìm kiếm người dùng hoặc nhóm...' size='middle' />
        {/* <div className={styles.listOnlineVertically}>
          <AvatarChat />
          <AvatarChat />
          <AvatarChat />
          <AvatarChat />
        </div> */}
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
        <StyledHeader>
          <Row justify='start' align='middle' gutter={16} style={{ height: '100%' }}>
            <Col>
              <Avatar style={{ backgroundColor: generateRandomColor() }} size='large'>
                K
              </Avatar>
            </Col>
            <Col flex={{ grow: 1 }} className={styles.resetLineHeight}>
              <Paragraph className={styles.chatName}>Demo Chat Name</Paragraph>
              <Text>35 members</Text>
            </Col>
          </Row>
        </StyledHeader>
        <StyledContent></StyledContent>
      </Layout>
    </Layout>
  );
}
