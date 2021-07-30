import { useParams } from 'react-router-dom';
import { Divider, Row, Col, Button, Layout, Avatar, Typography } from 'antd';
import { SendOutlined } from '@ant-design/icons';
import { BaseInput } from '@components/index';

import { generateRandomColor } from 'src/utils';
import styles from './styles.module.scss';

const { Header, Content } = Layout;
const { Paragraph, Text } = Typography;

export default function Chat() {
  const params = useParams();
  console.log(`params`, params);

  return (
    <>
      <Header className={styles.header}>
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
      </Header>
      <Content className={styles.content}>
        <div
          className={styles.listOfMessages}
          key='list-of-messages'
          aria-label='list-of-messages'></div>
        <Divider />
        <div key='chat-input' aria-label='chat-input'>
          <Row gutter={16} className={styles.chatInput} align='middle'>
            <Col flex='1'>
              <BaseInput
                fullWidth
                placeholder='Enter message here...'
                onChange={(e) => console.log(`e`, e.target.value)}
              />
            </Col>
            <Col>
              <Button type='primary' shape='round' icon={<SendOutlined />} />
            </Col>
          </Row>
        </div>
      </Content>
    </>
  );
}
