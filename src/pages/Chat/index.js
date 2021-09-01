import { useRef, useEffect, useContext, useState, useMemo, useCallback, memo } from 'react';
import SocketContext from '@socket/SocketReactContext';
import { useParams } from 'react-router-dom';

import { Divider, Row, Col, Button, Layout, Avatar, Typography } from 'antd';

import { SendOutlined } from '@ant-design/icons';

import { BaseInput } from '@components/index';
import { MessagesList, ChatHeader } from '@modules/Chat';

import _ from 'lodash';
import { useForm } from 'react-hook-form';
import { generateRandomColor } from 'src/utils';
import MessageHttp from '@http/message.http';

import '@models/index';
import styles from './styles.module.scss';

const Chat = () => {
  const params = useParams();
  const messageEndRef = useRef(null);
  const messageHttp = useMemo(() => new MessageHttp(), []);
  const { socketService } = useContext(SocketContext);

  /** @type {[Message[], (messages: Messages[]) => any]} */
  const [messages, setMessages] = useState([]);

  const [isSending, setIsSending] = useState(false);
  const { register, handleSubmit, reset } = useForm();

  // -handler

  const scrollToBottom = () => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleFormSubmit = ({ message }) => {
    const user = socketService.getUser();
    socketService.clientSendMessage(params.conversationId, user._id, message);
    setIsSending(true);
    reset({
      message: '',
    });
  };

  // -useEffect

  const handleReceiveMessage = useCallback(({ conversation, fromUser, message }) => {
    setMessages((curr) => [...curr, _.omit(message, 'createdAt', 'updatedAt')]);
  }, []);

  const handleReceiveOwnMessage = useCallback(({ conversation, fromUser, message }) => {
    setMessages((curr) => [...curr, _.omit(message, 'createdAt', 'updatedAt')]);
    setIsSending(false);
  }, []);

  useEffect(() => {
    socketService.onReceiveJustSentMessage(handleReceiveOwnMessage);

    socketService.onReceiveOthersMessage(handleReceiveMessage);

    return () => {
      socketService.destroyListener(handleReceiveMessage);
      socketService.destroyListener(handleReceiveOwnMessage);
    };
  }, [handleReceiveMessage, handleReceiveOwnMessage, socketService]);

  useEffect(() => {
    // messageHttp
    //   .getMessageByConversationId(params.conversationId, 0)
    //   .then((data) => console.log(`data`, data));
  }, [messageHttp, params.conversationId]);

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
        <ChatHeader avatarString={'K'} chatTitle={'Demo'} numberOfMembers={2} />
        <div className={styles.listOfMessages} key='list-of-messages' aria-label='list-of-messages'>
          <MessagesList messages={messages} />
          <div key='dummy-div-to-scroll' ref={messageEndRef} />
        </div>
        <div className={styles.chatInputWrapper} key='chat-input' aria-label='chat-input'>
          <Divider className={styles.divider} />
          <Row gutter={16} className={styles.chatInput} align='middle'>
            <Col flex='1'>
              <BaseInput
                fullWidth
                placeholder='Nhập tin nhắn...'
                {...register('message', { required: 'Bạn chưa nhập tin nhắn' })}
              />
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
};

export default memo(Chat, () => true);

Chat.whyDidYouRender = {
  trackAllPureComponents: true,
};
