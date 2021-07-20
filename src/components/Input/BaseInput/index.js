import clsx from 'clsx';
import styles from './styles.module.scss';

export function BaseInput({ className, fullWidth, ...props }) {
  return (
    <input
      {...props}
      className={clsx(styles.baseInput, className, {
        [styles.fullWidth]: fullWidth,
      })}
    />
  );
}
