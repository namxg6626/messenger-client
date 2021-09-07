import { useState, useEffect, useRef } from 'react';

import {
  Layout,
  Row,
  Col,
  Divider,
  Dropdown,
  Menu,
  Modal,
  Tabs,
  Typography,
  Button,
  Empty,
  Checkbox,
  Input,
  Form,
} from 'antd';
import { StyledSider } from './styled';
import { ChatCard, BaseInput, AppAvatar } from '@components/index';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

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
import { getConversationName } from '@utils/getters';

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
  const params = useParams();

  /** @type {[User[], (users: User[]) => any]} */
  const [listOnlines, setListOnlines] = useState([]);

  /** @type {[User, (user: User) => any]} */
  const [user, setUser] = useState({});

  /** @type {[Conversation[], (conversation: Conversation[]) => any]} */
  const [conversations, setConversations] = useState([]);

  const [selectedChat, setSelectedChat] = useState('');
  const [isCreatingGroupChat, setIsCreatingGroupChat] = useState(false);
  const [form] = Form.useForm();

  // functionalities
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isCreateGroupChatModalOpen, setIsCreateGroupChatModalOpen] = useState(false);
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

  const handleCreateGroupFormFinished = (v) => {
    setIsCreatingGroupChat(true);
    socketService.clientCreateGroupConversation(v.title, v.members);
  };

  const handleCreateGroupChatOk = () => {
    form.submit();
  };

  const handleCreateGroupChatCancel = () => {
    setIsCreateGroupChatModalOpen(false);
  };

  const handleHomeClick = () => {
    navigate('/messages');
  };

  /**
   *
   * @param {Conversation} conversation
   */
  const handleChatCardClick = (conversation) => {
    setSelectedChat(conversation._id);
    navigate('/messages/' + conversation._id, { state: conversation });
  };

  const handleContactClick = (contactId) => {
    socketService.clientCreatePrivateConversation(`private ${user._id} - ${contactId}`, contactId);
  };

  // -useEffect
  useEffect(() => {
    if (socket) {
      socketService.clientFetchUser((user) => setUser(user));
      socketService.clientFetchOnlines((users) => setListOnlines(users));
      socketService.clientFetchConversations((cons) => {
        cons.forEach((con) => {
          socketService.clientJoinRoom(con._id);
        });
        setConversations(cons);
      });
      socketService.onReceiveAllAvailableConversations((cons) => {
        // filter conversations that include current user
        const newCons = cons.filter((con) => con.members.some((mem) => mem._id === user._id));

        newCons.forEach((con) => {
          socketService.clientJoinRoom(con._id);
        });
        setConversations(newCons);
      });
      socketService.onReceiveCurrentConversation((conversation) => {
        navigate('/messages/' + conversation._id, { state: conversation });
        setIsCreatingGroupChat(false);
        setIsCreateGroupChatModalOpen(false);
      });
    }

    return () => {
      socketService.destroyAllListeners();
    };
  }, [isConnected, navigate, socket, socketService, user._id, params.conversationId]);

  useEffect(() => {
    if (!tabPaneHeight && headerRef.current) {
      setTabPaneHeight(headerRef?.current?.clientHeight);
    }
  }, [tabPaneHeight]);

  // -renderer

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
      const conversationName = getConversationName(conversation, user._id);

      return (
        <ChatCard
          key={conversation._id || v4()}
          isSelected={isSelected}
          from={conversationName}
          avatar={conversation.avatar}
          lastMessage={conversation?.newMessage?.content}
          onClick={() => handleChatCardClick(conversation)}
        />
      );
    });
  };

  const _renderEmptyContacts = () => (
    <Empty
      image='https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg'
      description={<Typography.Text type='secondary'>Không có ai hoạt động :(</Typography.Text>}
    />
  );

  const _renderChoosingMember = () => {
    const listOnlinesExcludeMe = listOnlines.filter((online) => online._id !== data.userId);

    if (!listOnlinesExcludeMe.length) {
      return _renderEmptyContacts();
    }

    return (
      <Form form={form} onFinish={handleCreateGroupFormFinished}>
        <Form.Item
          name='title'
          label='Tên cuộc trò chuyện'
          rules={[{ required: true, message: 'Bạn chưa nhập tên cuộc trò chuyện' }]}>
          <Input placeholder='Tên cuộc trò chuyện' />
        </Form.Item>
        <Form.Item name='members' label='Danh sách thành viên'>
          <Checkbox.Group
            options={listOnlinesExcludeMe.map((o) => ({
              label: o.displayname,
              value: o._id,
            }))}
          />
        </Form.Item>
      </Form>
    );
  };

  const _renderContacts = () => {
    const listOnlinesExcludeMe = listOnlines.filter((online) => online._id !== data.userId);

    if (!listOnlinesExcludeMe.length) {
      return (
        <Row
          align='middle'
          justify='center'
          style={{ height: `calc(100vh - ${tabPaneHeight}px)` }}
          className={styles.emptyConversationPane}>
          <Col>{_renderEmptyContacts()}</Col>
        </Row>
      );
    }

    return listOnlinesExcludeMe
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
      <Modal
        title={
          <div>
            <ExclamationCircleOutlined /> Tạo nhóm chat
          </div>
        }
        visible={isCreateGroupChatModalOpen}
        confirmLoading={isCreatingGroupChat}
        onOk={handleCreateGroupChatOk}
        onCancel={handleCreateGroupChatCancel}>
        {_renderChoosingMember()}
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
            <Row justify='space-between'>
              <Col>
                <Button type='default' onClick={() => setIsCreateGroupChatModalOpen(true)}>
                  Tạo cuộc trò chuyện nhóm
                </Button>
              </Col>
            </Row>
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
      <Layout>
        <Outlet />
      </Layout>
    </Layout>
  );
}
