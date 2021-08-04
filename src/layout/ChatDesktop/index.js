import { useState } from 'react';
import { Layout, Row, Col, Divider, Dropdown, Menu, Button } from 'antd';
import { StyledSider } from './styled';
import { ChatCard, BaseInput, AppAvatar } from '@components/index';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import * as __mock__ from 'src/__mock__';

import styles from './styles.module.scss';

export function ChatDesktop() {
  const navigate = useNavigate();
  const { data = {} } = useSelector((state) => state.auth);

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
      <Menu.Item key='0'>
        <a href='https://www.antgroup.com'>1st menu item</a>
      </Menu.Item>
      <Menu.Item key='1'>
        <a href='https://www.aliyun.com'>2nd menu item</a>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key='3'>3rd menu item</Menu.Item>
    </Menu>
  );

  return (
    <Layout>
      <StyledSider className={styles.siderScroll}>
        <div className={styles.siderHead}>
          <Dropdown arrow trigger={['click']} overlay={menu}>
            <AppAvatar
              size='small'
              alt={data.displayname}
              src={data.avatar}
              className={styles.appAvatar}
            />
          </Dropdown>
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
