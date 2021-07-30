import { Typography, Avatar, Row, Col } from 'antd';
import { useSelector } from 'react-redux';

import { getShortName } from '@utils/getters';

import styles from './styles.module.scss';

const { Title } = Typography;

export default function Welcome() {
  const { data = {} } = useSelector((state) => state.auth);

  return (
    <div className={styles.thisScreen}>
      <Row gutter={16} align='middle'>
        <Col>
          <Avatar size='large' className={styles.avatar}>
            <span className={styles.avatarString}>{getShortName(data.displayname)}</span>
          </Avatar>
        </Col>
        <Col>
          <Title level={1} className={styles.welcome}>
            Welcome!
          </Title>
          <Title level={1} className={styles.userName}>
            {data.displayname}
          </Title>
        </Col>
      </Row>
    </div>
  );
}
