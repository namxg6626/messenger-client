import { css } from 'styled-components';
import { colors } from '../../assets/variables/colors';

export const commonInputStyles = css`
  .ant-input-wrapper * {
    background-color: ${colors.grayLighter};
    color: ${colors.textSecondary} !important;
  }

  border-radius: 2rem;
`;
