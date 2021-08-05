import { useState } from 'react';
import { Layout, Row, Col, Divider, Dropdown, Menu, Modal } from 'antd';
import { StyledSider } from './styled';
import { ChatCard, BaseInput, AppAvatar } from '@components/index';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import * as __mock__ from 'src/__mock__';

import styles from './styles.module.scss';
import { authLogoutAction } from '@store/auth/auth.action';
import {
  ExclamationCircleOutlined,
  HomeOutlined,
  HomeTwoTone,
  LogoutOutlined,
} from '@ant-design/icons';

export function ChatDesktop() {
  const navigate = useNavigate();
  const { data = {} } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const handleLogoutClick = () => {
    setIsLogoutModalOpen(true);
  };

  const handleLogoutModalOk = () => {
    dispatch(authLogoutAction());
  };

  const handleLogoutModalCancel = () => {
    setIsLogoutModalOpen(false);
  };

  const handleHomeClick = () => {
    navigate('/messages');
  };

  const _renderMockConversations = () => {
    return __mock__.conversations.map((conversation) => (
      <Col key={conversation._id} span={24}>
        <ChatCard
          from={conversation.from}
          avatar={conversation.avatar}
          lastMessage={conversation.lastMessage}
          onClick={() => navigate('/messages/' + conversation._id)}
        />
      </Col>
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
          <Divider />
        </div>
        <Row gutter={16}>{_renderMockConversations()}</Row>
      </StyledSider>
      <Divider className={styles.dividerVertical} type='vertical' />
      <Layout>
        <Outlet />
      </Layout>
    </Layout>
  );
}
