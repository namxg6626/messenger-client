import React from 'react';
import Avatar from 'antd/lib/avatar/avatar';
import { getShortName } from '@utils/getters';
import styles from './styles.module.scss';

import PropTypes from 'prop-types';
import clsx from 'clsx';

export function AppAvatar({ src = '', alt = '', size = 'small', className = undefined, ...props }) {
  return (
    <Avatar
      {...props}
      src={src}
      size='large'
      className={clsx(styles.avatar, styles[size], className)}>
      <span className={styles.avatarString}>{getShortName(alt)}</span>
    </Avatar>
  );
}

AppAvatar.propTypes = {
  src: PropTypes.string,
  alt: PropTypes.string,
  size: PropTypes.oneOf(['small', 'large']),
  className: PropTypes.string,
  btnProps: PropTypes.object,
};
