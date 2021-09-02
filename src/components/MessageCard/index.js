import { memo } from 'react';
import { Row, Col, Typography } from 'antd';
import { AppAvatar } from '@components/index';
import clsx from 'clsx';
import PropTypes from 'prop-types';

import styles from './styles.module.scss';

const { Paragraph } = Typography;

/**
 * @property **me**: your message or not
 */
const MemoizedMessageCard = ({ avatar = '', message = '', me = false, ...props }) => {
  const renderOthers = () => (
    <Row className={styles.thisMessageCard} gutter={16} wrap='nowrap'>
      <Col>
        <AppAvatar alt={avatar} />
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
        <AppAvatar alt={avatar} />
      </Col>
    </Row>
  );

  return (
    <Row justify={me ? 'end' : 'start'} {...props}>
      <Col>{me ? renderMe() : renderOthers()}</Col>
    </Row>
  );
};

export const MessageCard = memo(MemoizedMessageCard);

MessageCard.whyDidYouRender = {
  trackAllPureComponents: true,
};

MemoizedMessageCard.propTypes = {
  avatar: PropTypes.string,
  message: PropTypes.string,
  me: PropTypes.bool.isRequired,
};
