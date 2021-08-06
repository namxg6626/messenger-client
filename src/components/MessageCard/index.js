import { Row, Col, Avatar, Typography } from 'antd';
import PropTypes from 'prop-types';

import styles from './styles.module.scss';

const { Paragraph } = Typography;

export function MessageCard({ avatar = '', message = '', me = false }) {
  const renderOthers = () => (
    <Row className={styles.thisMessageCard} gutter={16} wrap='nowrap'>
      <Col>
        <Avatar src={avatar} />
      </Col>
      <Col>
        <Paragraph className={styles.messagePara}>{message}</Paragraph>
      </Col>
    </Row>
  );

  return (
    <Row justify={me ? 'end' : 'start'}>
      <Col>{me ? null : renderOthers()}</Col>
    </Row>
  );
}

MessageCard.propTypes = {
  avatar: PropTypes.string,
  message: PropTypes.string,
  me: PropTypes.bool.isRequired,
};
