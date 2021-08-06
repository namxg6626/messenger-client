import { useRef, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Divider, Row, Col, Button, Layout, Avatar, Typography } from 'antd';
import { SendOutlined } from '@ant-design/icons';
import { BaseInput } from '@components/index';

import { MessageCard } from '@components/index';
import { generateRandomColor } from 'src/utils';
import styles from './styles.module.scss';
import * as __mock__ from 'src/__mock__';

const { Header, Content } = Layout;
const { Paragraph, Text } = Typography;

export default function Chat() {
  const params = useParams();
  const [listOfMessagesHeight, setListOfMessagesHeight] = useState(0);
  const headerRef = useRef(null);
  const chatInputRef = useRef(null);

  const renderMockMessages = () => {
    return __mock__.messages.map(({ avatar, id, message }, i) => (
      <MessageCard key={id} avatar={avatar} message={message} me={i % 2 === 0} />
    ));
  };

  useEffect(() => {
    const handleResize = () => {
      const headerHeight = headerRef.current?.clientHeight || 0;
      const chatInputHeight = chatInputRef.current?.clientHeight || 0;
      const innerHeight = window.innerHeight;

      setListOfMessagesHeight(() => innerHeight - headerHeight - chatInputHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  console.log(`headerRef.current?.clientHeight`, headerRef.current?.clientHeight);

  return (
    <div className={styles.thisScreen}>
      <Header ref={headerRef} className={styles.header}>
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
      <div className={styles.listOfMessages} key='list-of-messages' aria-label='list-of-messages'>
        {renderMockMessages()}
      </div>
      <div
        ref={chatInputRef}
        className={styles.chatInputWrapper}
        key='chat-input'
        aria-label='chat-input'>
        <Divider className={styles.divider} />
        <Row gutter={16} className={styles.chatInput} align='middle'>
          <Col flex='1'>
            <BaseInput
              fullWidth
              placeholder='Nhập tin nhắn...'
              onChange={(e) => console.log(`e`, e.target.value)}
            />
          </Col>
          <Col>
            <Button type='primary' shape='round' icon={<SendOutlined />} />
          </Col>
        </Row>
      </div>
    </div>
  );
}
