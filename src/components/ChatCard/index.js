// @flow
import { Row, Col, Avatar, Typography } from 'antd';
import { generateRandomColor } from '../../utils/generator';
import styles from './styles.module.scss';

const { Paragraph, Text } = Typography;

export function ChatCard() {
  return (
    <Row gutter={16} className={styles.chatCard} align='middle'>
      <Col span={5}>
        <Avatar size='large' style={{ backgroundColor: generateRandomColor() }}>
          K
        </Avatar>
      </Col>
      <Col span={19}>
        <Paragraph className={styles.chatName}>User name</Paragraph>
        <Text className={styles.lastMessage} ellipsis>
          lorem ipsum dolor sit amet lorem ipsum dolor sit amet
        </Text>
      </Col>
    </Row>
  );
}
