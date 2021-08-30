import { useRef, useEffect, useContext, useState } from 'react';
import SocketContext from '@socket/SocketReactContext';
import { useParams } from 'react-router-dom';
import { Divider, Row, Col, Button, Layout, Avatar, Typography } from 'antd';
import { SendOutlined } from '@ant-design/icons';
import { BaseInput } from '@components/index';

import { MessageCard } from '@components/index';
import { generateRandomColor } from 'src/utils';
import styles from './styles.module.scss';
import * as __mock__ from 'src/__mock__';

import { useForm } from 'react-hook-form';

const { Header } = Layout;
const { Paragraph, Text } = Typography;

export default function Chat() {
  const params = useParams();
  const messageEndRef = useRef(null);
  const { socketService } = useContext(SocketContext);

  const [isSending, setIsSending] = useState(false);
  const { register, handleSubmit } = useForm({
    defaultValues: {
      message: '',
    },
  });

  const scrollToBottom = () => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleFormSubmit = ({ message }) => {
    const user = socketService.getUser();
    socketService.clientSendMessage(params.conversationId, user._id, message);
  };

  const renderMockMessages = () => {
    return __mock__.messages.map(({ avatar, id, message }, i) => (
      <>
        <MessageCard key={id} avatar={avatar} message={message} me={i % 2 === 0} />
        <MessageCard key={i} avatar={avatar} message={message} me={i % 2 === 0} />
      </>
    ));
  };

  useEffect(() => {
    scrollToBottom();

    const handleResize = () => {
      scrollToBottom();
    };
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <form autoComplete='off' onSubmit={handleSubmit(handleFormSubmit)}>
      <div className={styles.thisScreen}>
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
        <div className={styles.listOfMessages} key='list-of-messages' aria-label='list-of-messages'>
          {/* {renderMockMessages()} */}
          <div key='dummy-div-to-scroll' ref={messageEndRef} />
        </div>
        <div className={styles.chatInputWrapper} key='chat-input' aria-label='chat-input'>
          <Divider className={styles.divider} />
          <Row gutter={16} className={styles.chatInput} align='middle'>
            <Col flex='1'>
              <BaseInput fullWidth placeholder='Nhập tin nhắn...' {...register('message')} />
            </Col>
            <Col>
              <Button
                loading={isSending}
                htmlType='submit'
                type='primary'
                shape='round'
                icon={<SendOutlined />}
              />
            </Col>
          </Row>
        </div>
      </div>
    </form>
  );
}
