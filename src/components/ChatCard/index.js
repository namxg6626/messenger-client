// @flow
import { memo } from 'react';
import { Row, Col, Avatar, Typography } from 'antd';
import { generateRandomColor } from '../../utils/generator';
import styles from './styles.module.scss';
import PropTypes from 'prop-types';

import { getShortName } from '@utils/getters';
import clsx from 'clsx';

import equal from 'deep-equal';
import _ from 'lodash';

const { Paragraph, Text } = Typography;

export const ChatCard = memo(
  ({ lastMessage = '', avatar = '', from = '', isSelected = false, onClick = () => null }) => {
    return (
      <Row
        onClick={onClick}
        gutter={16}
        className={clsx(styles.chatCard, {
          [styles.isChatCardSelected]: isSelected,
          [styles.chatCardHover]: !isSelected,
        })}
        align='middle'>
        <Col span={5}>
          <Avatar src={avatar} size='large' style={{ backgroundColor: generateRandomColor() }}>
            {getShortName(from).toUpperCase()}
          </Avatar>
        </Col>
        <Col span={19}>
          <Paragraph
            className={clsx(styles.chatName, { [styles.chatNameSelected]: isSelected })}
            ellipsis>
            {from}
          </Paragraph>
          <Text
            className={clsx(styles.lastMessage, { [styles.chatNameSelected]: isSelected })}
            ellipsis>
            {lastMessage}
          </Text>
        </Col>
      </Row>
    );
  },
  (pre, next) => {
    const isEqual = equal(_.omit(pre, 'onClick'), _.omit(next, 'onClick'));
    return isEqual;
  },
);

ChatCard.propTypes = {
  lastMessage: PropTypes.string,
  avatar: PropTypes.string,
  onClick: PropTypes.func,
  from: PropTypes.string,
  isSelected: PropTypes.bool,
};
