import { memo } from 'react';
import { Row, Col, Avatar, Typography } from 'antd';
import { AppAvatar } from '@components/index';
import clsx from 'clsx';
import PropTypes from 'prop-types';

import styles from './styles.module.scss';

import equal from 'deep-equal';

const { Paragraph } = Typography;

/**
 * @property **me**: your message or not
 */
export const MessageCard = memo(
  ({ avatar = '', message = '', me = false }) => {
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
          <Paragraph className={clsx(styles.messagePara, styles.myMessagePara)}>
            {message}
          </Paragraph>
        </Col>
        <Col>
          <AppAvatar alt={avatar} />
        </Col>
      </Row>
    );

    return (
      <Row justify={me ? 'end' : 'start'}>
        <Col>{me ? renderMe() : renderOthers()}</Col>
      </Row>
    );
  },
  (pre, next) => {
    const isEqual = equal(pre, next);
    return isEqual;
  },
);

MessageCard.propTypes = {
  avatar: PropTypes.string,
  message: PropTypes.string,
  me: PropTypes.bool.isRequired,
};
