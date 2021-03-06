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

import { Divider, Row, Col, Button } from 'antd';

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
  const [shouldScrollToMiddle, setShouldScrollToMiddle] = useState(false);
  const [shouldScrollFirstTime, setShouldScrollFirstTime] = useState(true);
  const [page, setPage] = useState(1);

  const messageHttp = useMemo(() => new MessageHttp(), []);
  const client = useQueryClient();
  const QUERY_KEY = useMemo(
    () => [MESSAGES_QUERY_KEY, { conversationId: params.conversationId }],
    [params.conversationId],
  );
  /**
   * @type {{ data: Message[] }}
   */
  const { data: messages, isFetching: isQueryFetching } = useQuery(
    QUERY_KEY,
    () => messageHttp.getMessageByConversationId(params.conversationId, 1),
    {
      placeholderData: [],
      refetchOnWindowFocus: false,
      onSuccess: () => {
        if (shouldScrollFirstTime) {
          setShouldScrollToBottom(() => true);
          setShouldScrollFirstTime(() => false);
        }
      },
    },
  );
  const mutation = useMutation(
    ({ conversationId = '', page = 1 }) => {
      return messageHttp.getMessageByConversationId(conversationId, page);
    },
    {
      onSuccess: (data) => {
        client.setQueryData(QUERY_KEY, (old) => {
          const newMessages = data.concat(old);
          const removedDuplicateMessages = _.uniqBy(newMessages, (m) => m._id);
          setShouldScrollToMiddle(true);
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
      listRef.current.scrollTo(null, 250);
    }
  };

  const handleFormSubmit = ({ message }) => {
    socketService.clientSendMessage(params.conversationId, user._id, message);
    setIsSending(true);
    reset({ message: '' });
    setShouldScrollToBottom(true);
  };

  // -useEffect

  const handleReceiveMessage = useCallback(
    ({ conversation, fromUser, message }) => {
      console.log(`others`, message);
      client.setQueryData(QUERY_KEY, (old) =>
        _.uniqBy(
          _.orderBy(old.concat(message), (m) => m.createdAt, 'asc'),
          (m) => m._id,
        ),
      );
      setIsSending(false);
    },
    [QUERY_KEY, client],
  );

  const handleReceiveOwnMessage = useCallback(
    ({ conversation, fromUser, message }) => {
      console.log(`own`, message);

      client.setQueryData(QUERY_KEY, (old) =>
        _.uniqBy(
          _.orderBy(old.concat(message), (m) => m.createdAt, 'asc'),
          (m) => m._id,
        ),
      );
      setIsSending(false);
    },
    [QUERY_KEY, client],
  );

  const handleReachTop = (e) => {
    if (e?.target?.parentElement?.scrollTop === 0 && !mutation.isLoading && messages.length) {
      mutation.mutate({
        conversationId: params.conversationId,
        page: page + 1,
      });
    }
  };

  const _renderLoading = () => (
    <Row justify='center'>
      <Col>
        <LoadingOutlined style={{ fontSize: 36 }} spin />
      </Col>
    </Row>
  );

  useEffect(() => {
    if (typeof messages?.length === 'number') {
      const currentPage = Math.ceil(messages.length / PAGE_LIMIT);
      setPage(currentPage || 1);
    }
  }, [messages?.length]);

  useEffect(() => {
    socketService.onReceiveJustSentMessage(handleReceiveOwnMessage);
    socketService.onReceiveOthersMessage(handleReceiveMessage, params.conversationId);

    return () => {
      socketService.destroyListener(handleReceiveMessage);
      socketService.destroyListener(handleReceiveOwnMessage);
    };
  }, [handleReceiveMessage, handleReceiveOwnMessage, params.conversationId, socketService]);

  useEffect(() => {
    const handleResize = () => {
      setShouldScrollToBottom(true);
    };
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useLayoutEffect(() => {
    if (shouldScrollToBottom) {
      scrollToBottom();
      _.debounce(() => setShouldScrollToBottom(false), 100);
    }
  }, [shouldScrollToBottom, messages]);

  useLayoutEffect(() => {
    if (shouldScrollToMiddle) {
      scrollToMiddle();
      _.debounce(() => setShouldScrollToMiddle(false), 100);
    }
  }, [shouldScrollToMiddle, messages]);

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
          {mutation.isLoading && _renderLoading()}
          {isQueryFetching && _renderLoading()}
          <MessagesList messages={messages} />
          <div aria-label='dummy-bottom' key='dummy-bottom' ref={messageEndRef} />
        </div>
        <div className={styles.chatInputWrapper} key='chat-input' aria-label='chat-input'>
          <Divider className={styles.divider} />
          <Row gutter={16} className={styles.chatInput} align='middle'>
            <Col flex='1'>
              <BaseInput
                fullWidth
                placeholder='Nh???p tin nh???n...'
                {...register('message', { required: 'B???n ch??a nh???p tin nh???n' })}
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
