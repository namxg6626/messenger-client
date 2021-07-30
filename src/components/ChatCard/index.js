// @flow
import { Row, Col, Avatar, Typography } from 'antd';
import { generateRandomColor } from '../../utils/generator';
import styles from './styles.module.scss';
import PropTypes from 'prop-types';

import { getShortName } from '@utils/getters';

const { Paragraph, Text } = Typography;

export function ChatCard({ lastMessage = '', avatar = '', from = '', onClick = () => null }) {
  return (
    <Row gutter={16} className={styles.chatCard} align='middle'>
      <Col span={5}>
        <Avatar src={avatar} size='large' style={{ backgroundColor: generateRandomColor() }}>
          {getShortName(from).toUpperCase()}
        </Avatar>
      </Col>
      <Col span={19}>
        <Paragraph className={styles.chatName} ellipsis>
          {from}
        </Paragraph>
        <Text className={styles.lastMessage} ellipsis>
          {lastMessage}
        </Text>
      </Col>
    </Row>
  );
}

ChatCard.propTypes = {
  lastMessage: PropTypes.string,
  avatar: PropTypes.string,
  onClick: PropTypes.func,
  from: PropTypes.string,
};
