import { Typography, Avatar, Row, Col } from 'antd';
import styles from './styles.module.scss';

const { Title } = Typography;

export default function Welcome() {
  return (
    <div className={styles.thisScreen}>
      <Row gutter={16} align='middle'>
        <Col>
          <Avatar size='large' className={styles.avatar}>
            <span className={styles.avatarString}>LV</span>
          </Avatar>
        </Col>
        <Col>
          <Title level={1} className={styles.welcome}>
            Welcome!
          </Title>
          <Title level={1} className={styles.userName}>
            Le Van Nam
          </Title>
        </Col>
      </Row>
    </div>
  );
}
