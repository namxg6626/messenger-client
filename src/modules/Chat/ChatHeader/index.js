import { Col, Row, Typography } from 'antd';
import { generateRandomColor } from '@utils/generator';
import styles from './styles.module.scss';
import { Header } from 'antd/lib/layout/layout';
import Avatar from 'antd/lib/avatar/avatar';
import { memo } from 'react';
import { shallowEqual } from 'react-redux';

const { Paragraph, Text } = Typography;

/**
 *
 * @param {{
 *  avatarString: string;
 *  chatTitle: string
 *  numberOfMembers: number
 * }} props
 * @returns {JSX.Element}
 */
export const UnmemoizedChatHeader = ({
  avatarString = '',
  chatTitle = '',
  numberOfMembers = 0,
}) => {
  return (
    <Header className={styles.header}>
      <Row justify='start' align='middle' gutter={16} style={{ height: '100%' }}>
        <Col>
          <Avatar style={{ backgroundColor: generateRandomColor() }} size='large'>
            {avatarString}
          </Avatar>
        </Col>
        <Col flex={{ grow: 1 }} className={styles.resetLineHeight}>
          <Paragraph className={styles.chatName}>{chatTitle}</Paragraph>
          <Text>{numberOfMembers} members</Text>
        </Col>
      </Row>
    </Header>
  );
};

export const ChatHeader = memo(UnmemoizedChatHeader, shallowEqual);
