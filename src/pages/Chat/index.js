import {
  useRef,
  useEffect,
  useContext,
  useState,
  useMemo,
  useCallback,
  useLayoutEffect,
  memo,
} from 'react';
import SocketContext from '@socket/SocketReactContext';
import { useParams, useLocation } from 'react-router-dom';

import { Divider, Row, Col, Button, Skeleton } from 'antd';

import { LoadingOutlined, SendOutlined } from '@ant-design/icons';

import { BaseInput } from '@components/index';
import { MessagesList, ChatHeader } from '@modules/Chat';

import MessageHttp from '@http/message.http';
import { useMutation, useQuery, useQueryClient } from 'react-query';

import _ from 'lodash';
import { useForm } from 'react-hook-form';
import '@models/index';
import styles from './styles.module.scss';
import { getConversationName } from '@utils/getters';

const MESSAGES_QUERY_KEY = 'messages';
const PAGE_LIMIT = 20;

const Chat = (props) => {
  const params = useParams();
  const location = useLocation();

  const messageEndRef = useRef(null);
  const listRef = useRef(null);
  const { socketService } = useContext(SocketContext);
  const user = useMemo(() => socketService.getUser(), [socketService]);

  const [shouldScrollToBottom, setShouldScrollToBottom] = useState(false);
  const [page, setPage] = useState(1);

  const messageHttp = useMemo(() => new MessageHttp(), []);
  const client = useQueryClient();
  /**
   * @type {{ data: Message[] }}
   */
  const { data: messages } = useQuery(
    MESSAGES_QUERY_KEY,
    () => messageHttp.getMessageByConversationId(params.conversationId, 1),
    {
      placeholderData: [],
      refetchOnWindowFocus: false,
    },
  );
  const mutation = useMutation(
    ({ conversationId = '', page = 1 }) => {
      return messageHttp.getMessageByConversationId(conversationId, page);
    },
    {
      onSuccess: (data) => {
        client.setQueryData(MESSAGES_QUERY_KEY, (old) => {
          const newMessages = data.concat(old);
          const removedDuplicateMessages = newMessages.reduce((acc, curr) => {
            if (!acc.some((v) => v._id === curr._id)) {
              acc.push(curr);
            }

            return acc;
          }, []);

          console.log(`removedDuplicateMessages.length`, removedDuplicateMessages.length);
          scrollToMiddle();

          return removedDuplicateMessages;
        });
        setPage((p) => p + 1);
      },
    },
  );

  /**
   * @type {Conversation}
   */
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const matchedConversation = useMemo(() => location.state, [location.state._id]);

  /** @type {[Message[], (messages: Messages[]) => any]} */

  const [isSending, setIsSending] = useState(false);
  const { register, handleSubmit, reset } = useForm();

  // -handler

  const scrollToBottom = () => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToMiddle = () => {
    if (listRef.current) {
      listRef.current.scrollTo(null, 100);
    }
  };

  const handleFormSubmit = ({ message }) => {
    socketService.clientSendMessage(params.conversationId, user._id, message);
    setIsSending(true);
    reset({
      message: '',
    });
    setShouldScrollToBottom(true);
  };

  // -useEffect

  const handleReceiveMessage = useCallback(
    ({ conversation, fromUser, message }) => {
      client.setQueryData(MESSAGES_QUERY_KEY, (old) =>
        _.orderBy(old.concat(message), (m) => m.createdAt, 'asc'),
      );
      setIsSending(false);
    },
    [client],
  );

  const handleReceiveOwnMessage = useCallback(
    ({ conversation, fromUser, message }) => {
      client.setQueryData(MESSAGES_QUERY_KEY, (old) =>
        _.orderBy(old.concat(message), (m) => m.createdAt, 'asc'),
      );
      setIsSending(false);
    },
    [client],
  );

  const handleReachTop = (e) => {
    if (e?.target?.parentElement?.scrollTop === 0 && !mutation.isLoading) {
      mutation.mutate({
        conversationId: params.conversationId,
        page: page + 1,
      });
    }
  };

  useEffect(() => {
    const currentPage = Math.ceil(messages.length / PAGE_LIMIT);
    setPage(currentPage);
  }, [messages.length]);

  useEffect(() => {
    socketService.onReceiveJustSentMessage(handleReceiveOwnMessage);

    socketService.onReceiveOthersMessage(handleReceiveMessage);

    return () => {
      socketService.destroyListener(handleReceiveMessage);
      socketService.destroyListener(handleReceiveOwnMessage);
    };
  }, [handleReceiveMessage, handleReceiveOwnMessage, socketService]);

  useEffect(() => {
    const handleResize = () => {
      setShouldScrollToBottom(true);
    };
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useLayoutEffect(() => {
    if (shouldScrollToBottom) {
      console.log(`shouldScrollToBottom`, shouldScrollToBottom);
      scrollToBottom();
      setShouldScrollToBottom(false);
    }
  }, [shouldScrollToBottom, messages]);

  return (
    <form autoComplete='off' onSubmit={handleSubmit(handleFormSubmit)}>
      <div className={styles.thisScreen}>
        <ChatHeader
          avatarString={getConversationName(matchedConversation, user._id)}
          chatTitle={getConversationName(matchedConversation, user._id)}
          numberOfMembers={matchedConversation.members.length}
        />
        <div
          ref={listRef}
          onWheelCapture={handleReachTop}
          className={styles.listOfMessages}
          key='list-of-messages'
          aria-label='list-of-messages'>
          {mutation.isLoading && (
            <Row justify='center'>
              <Col>
                <LoadingOutlined style={{ fontSize: 36 }} spin />
              </Col>
            </Row>
          )}
          <MessagesList onReachTop={() => console.log('hi')} messages={messages} />
          <div aria-label='dummy-bottom' key='dummy-bottom' ref={messageEndRef} />
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
