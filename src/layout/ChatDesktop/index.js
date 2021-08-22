import { useState, useEffect } from 'react';

import { Layout, Row, Col, Divider, Dropdown, Menu, Modal, Tabs, Typography } from 'antd';
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
import { SocketEventEnum } from '@socket/events';

import { v4 } from 'uuid';

const { TabPane } = Tabs;

export function ChatDesktop() {
  const navigate = useNavigate();
  const { data = {} } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { socket, ctxSetSocket } = useAuthenticatedSocket();
  const isConnected = !!socket?.connected;

  // socket
  const [listOnlines, setListOnlines] = useState([]);
  const [user, setUser] = useState({});
  const [selectedChat, setSelectedChat] = useState('');
  const [conversations, setConversations] = useState([]);

  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

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

  // -useEffect
  useEffect(() => {
    if (socket) {
      socket?.emit(SocketEventEnum.CLIENT_GET_CONVERSATIONS);

      socket?.on(SocketEventEnum.SV_SEND_CURR_USER, (e) => setUser(e));
      socket?.on(SocketEventEnum.SV_SEND_USERS_ONLINE, (e) => {
        setListOnlines(e);
      });
      socket?.on(SocketEventEnum.SV_SEND_CONVERSATIONS_OF_USER, (data) =>
        setConversations(() => data),
      );
    }
  }, [isConnected, socket]);

  console.log(`listOnlines`, listOnlines);

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
        <Row justify='center' className={styles.emptyConversationRow}>
          <Col span={24}>
            <RocketOutlined className={styles.emptyConversationIcon} />
          </Col>
        </Row>
      );

    return conversations.map((conversation) => {
      const isSelected = conversation._id === selectedChat;
      return (
        <ChatCard
          key={conversation._id || v4()}
          isSelected={isSelected}
          from={conversation.from}
          avatar={conversation.avatar}
          lastMessage={conversation.lastMessage}
          onClick={() => handleChatCardClick(conversation._id)}
        />
      );
    });
  };

  const _renderContacts = () => {
    return listOnlines
      .filter((online) => online._id !== data.userId)
      .map((online) => (
        <Row className={styles.contactRow} align='middle' key={online._id || v4()} gutter={16}>
          <Col>
            <AppAvatar size='small' alt={online.displayname} />
          </Col>
          <Col>
            <Typography.Text>{online.displayname}</Typography.Text>
          </Col>
        </Row>
      ));
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
      <StyledSider className={styles.siderScroll}>
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
        <Tabs defaultActiveKey={1}>
          <TabPane
            tab={
              <span>
                <CommentOutlined />
                Trò chuyện
              </span>
            }
            key={1}>
            {_renderConversations()}
          </TabPane>
          <TabPane
            tab={
              <span>
                <UserOutlined />
                Liên lạc
              </span>
            }
            key={3}>
            {_renderContacts()}
          </TabPane>
          <TabPane tab='Trò chuyện test' key={2}>
            {_renderMockConversations()}
          </TabPane>
        </Tabs>
        {/* <Row gutter={16}>{_renderConversations()}</Row> */}
      </StyledSider>
      <Divider className={styles.dividerVertical} type='vertical' />
      <Layout>
        <Outlet />
      </Layout>
    </Layout>
  );
}
