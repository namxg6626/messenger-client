import { Row, Col, Avatar, Typography } from 'antd';
import clsx from 'clsx';
import PropTypes from 'prop-types';

import styles from './styles.module.scss';

const { Paragraph } = Typography;

/**
 * @property **me**: your message or not
 */
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

  const renderMe = () => (
    <Row className={styles.thisMessageCard} gutter={16} wrap='nowrap'>
      <Col>
        <Paragraph className={clsx(styles.messagePara, styles.myMessagePara)}>{message}</Paragraph>
      </Col>
      <Col>
        <Avatar src={avatar} />
      </Col>
    </Row>
  );

  return (
    <Row justify={me ? 'end' : 'start'}>
      <Col>{me ? renderMe() : renderOthers()}</Col>
    </Row>
  );
}

MessageCard.propTypes = {
  avatar: PropTypes.string,
  message: PropTypes.string,
  me: PropTypes.bool.isRequired,
};
