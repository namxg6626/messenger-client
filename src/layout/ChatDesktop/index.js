import { useState, useEffect, useRef } from 'react';

import { Layout, Row, Col, Divider, Dropdown, Menu, Modal, Tabs, Typography, Button } from 'antd';
import { StyledSider } from './styled';
import { ChatCard, BaseInput, AppAvatar } from '@components/index';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import * as __mock__ from 'src/__mock__';

import styles from './styles.module.scss';
import { authLogoutAction } from '@store/auth/auth.action';
import {
  CommentOutlined,
  ExclamationCircleOutlined,
  HomeTwoTone,
  LogoutOutlined,
  RocketOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { useAuthenticatedSocket } from '@socket/hooks';

import { v4 } from 'uuid';

const { TabPane } = Tabs;
const TAB_KEYS = {
  CONVERSATIONS: '1',
  CONTACTS: '2',
  CONVERSATIONS_TEST: '3',
};

export function ChatDesktop() {
  const navigate = useNavigate();
  const { data = {} } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { socket, ctxSetSocket, socketService } = useAuthenticatedSocket();
  const isConnected = !!socket?.connected;
  const headerRef = useRef(null);

  // socket
  const [listOnlines, setListOnlines] = useState([]);
  const [user, setUser] = useState({});
  const [selectedChat, setSelectedChat] = useState('');
  const [conversations, setConversations] = useState([]);
  const [isJoining, setIsJoining] = useState(false);

  // functionalities
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [tabPaneHeight, setTabPaneHeight] = useState(0);
  const [tabKey, setTabKey] = useState(TAB_KEYS.CONVERSATIONS);

  // -handler
  const handleLogoutClick = () => {
    setIsLogoutModalOpen(true);
  };

  const handleLogoutModalOk = () => {
    dispatch(authLogoutAction());
    socket.disconnect();
    ctxSetSocket(null);
  };

  const handleLogoutModalCancel = () => {
    setIsLogoutModalOpen(false);
  };

  const handleHomeClick = () => {
    navigate('/messages');
  };

  const handleChatCardClick = (idChat) => {
    setSelectedChat(idChat);
    navigate('/messages/' + idChat);
  };

  const handleContactClick = (contactId) => {
    setIsJoining(true);
    socketService.clientCreatePrivateConversation(`private ${user._id} - ${contactId}`, contactId);
  };

  // -useEffect
  useEffect(() => {
    if (socket) {
      socketService.clientFetchUser((user) => setUser(user));
      socketService.clientFetchOnlines((users) => setListOnlines(users));
      socketService.clientFetchConversations((conversations) => setConversations(conversations));
      socketService.onReceiveCurrentConversation((conversation) => {
        console.log(`conversation`, conversation);
        setIsJoining(false);
        navigate('/messages/' + conversation._id);
      });
    }
  }, [isConnected, navigate, socket, socketService]);

  useEffect(() => {
    if (!tabPaneHeight && headerRef.current) {
      setTabPaneHeight(headerRef?.current?.clientHeight);
    }
  }, [tabPaneHeight]);

  // -renderer

  const _renderMockConversations = () => {
    return __mock__.conversations.map((conversation) => {
      const isSelected = conversation._id === selectedChat;
      return (
        <Col key={conversation._id} span={24}>
          <ChatCard
            isSelected={isSelected}
            from={conversation.from}
            avatar={conversation.avatar}
            lastMessage={conversation.lastMessage}
            onClick={() => handleChatCardClick(conversation._id)}
          />
        </Col>
      );
    });
  };

  const _renderConversations = () => {
    if (!conversations.length)
      return (
        <Row
          align='middle'
          style={{ height: `calc(100vh - ${tabPaneHeight}px)` }}
          className={styles.emptyConversationPane}>
          <Col span={24}>
            <Row justify='center' className={styles.emptyConversationRow}>
              <Col>
                <RocketOutlined className={styles.emptyConversationIcon} />
              </Col>
            </Row>
            <Row justify='center'>
              <Col>
                <Typography.Title style={{ textAlign: 'center' }} level={5} type='secondary'>
                  Opps! Bạn chưa có cuộc trò chuyện nào
                </Typography.Title>
                <Typography.Paragraph style={{ textAlign: 'center' }} type='secondary'>
                  Bấm nút bên dưới để xem ai đang hoạt động nhé
                </Typography.Paragraph>
              </Col>
            </Row>
            <Row justify='center'>
              <Col>
                <Button onClick={() => setTabKey(TAB_KEYS.CONTACTS)} type='primary'>
                  Khám phá liên lạc
                </Button>
              </Col>
            </Row>
          </Col>
        </Row>
      );

    return conversations.map((conversation) => {
      const isSelected = conversation._id === selectedChat;
      return (
        <ChatCard
          key={conversation._id || v4()}
          isSelected={isSelected}
          from={conversation.title}
          avatar={conversation.avatar}
          lastMessage={conversation?.newMessage?.content}
          onClick={() => handleChatCardClick(conversation._id)}
        />
      );
    });
  };

  const _renderContacts = () => {
    return listOnlines
      .filter((online) => online._id !== data.userId)
      .map((online) => (
        <Row
          onClick={() => handleContactClick(online._id)}
          className={styles.contactRow}
          align='middle'
          key={online._id || v4()}
          gutter={16}>
          <Col>
            <AppAvatar size='small' alt={online.displayname} />
          </Col>
          <Col>
            <Typography.Text>{online.displayname}</Typography.Text>
          </Col>
        </Row>
      ));
  };

  const _renderJoining = () => {
    return 'loading...';
  };

  const menu = (
    <Menu>
      <Menu.Item icon={<HomeTwoTone />} onClick={handleHomeClick}>
        Home
      </Menu.Item>
      <Menu.Item>2nd menu item</Menu.Item>
      <Menu.Divider />
      <Menu.Item icon={<LogoutOutlined />} onClick={handleLogoutClick}>
        Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <Layout>
      <Modal
        title={
          <div>
            <ExclamationCircleOutlined /> Đăng xuất
          </div>
        }
        visible={isLogoutModalOpen}
        onOk={handleLogoutModalOk}
        onCancel={handleLogoutModalCancel}>
        <p>
          Bạn muốn đăng xuất khỏi tài khoản <b>{data.displayname}</b>?
        </p>
      </Modal>
      <StyledSider ref={headerRef} className={styles.siderScroll}>
        <div className={styles.siderHead}>
          <Row gutter={16} align='middle' className={styles.avatarSection}>
            <Col>
              <Dropdown arrow trigger={['click']} overlay={menu}>
                <AppAvatar
                  size='small'
                  alt={data.displayname}
                  src={data.avatar}
                  className={styles.appAvatar}
                />
              </Dropdown>
            </Col>
            <Col>
              <b className={styles.avatarDisplayname}>{data.displayname}</b>
              <i className={styles.bio}>Celebrating</i>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <BaseInput
                className={styles.baseInput}
                fullWidth
                placeholder='Tìm kiếm người dùng hoặc nhóm..'
              />
            </Col>
          </Row>
          {/* <Divider /> */}
        </div>
        <Tabs activeKey={tabKey} onChange={(key) => setTabKey(key)}>
          <TabPane
            style={{ minHeight: '100%' }}
            tab={
              <span>
                <CommentOutlined />
                Trò chuyện
              </span>
            }
            key={TAB_KEYS.CONVERSATIONS}>
            {_renderConversations()}
          </TabPane>
          <TabPane
            tab={
              <span>
                <UserOutlined />
                Liên lạc
              </span>
            }
            key={TAB_KEYS.CONTACTS}>
            {_renderContacts()}
          </TabPane>
        </Tabs>
        {/* <Row gutter={16}>{_renderConversations()}</Row> */}
      </StyledSider>
      <Divider className={styles.dividerVertical} type='vertical' />
      <Layout>{isJoining ? _renderJoining() : <Outlet />}</Layout>
    </Layout>
  );
}
