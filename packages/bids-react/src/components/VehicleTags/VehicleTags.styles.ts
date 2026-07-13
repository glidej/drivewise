import styled from 'styled-components';

import { colors } from '../../styles/colors';

export const Tags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;

  span {
    background: ${colors.accentSoft};
    border-radius: 999px;
    color: ${colors.accent};
    font-size: 0.78rem;
    font-weight: 900;
    padding: 0.45rem 0.7rem;
  }
`;
