import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.scss';

export const BaseInput = React.forwardRef(({ className, fullWidth, ...props }, ref) => {
  return (
    <input
      ref={ref}
      {...props}
      className={clsx(styles.baseInput, className, {
        [styles.fullWidth]: fullWidth,
      })}
    />
  );
});
