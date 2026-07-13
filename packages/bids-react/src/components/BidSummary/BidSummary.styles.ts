import styled from 'styled-components';

import { colors } from '../../styles/colors';

export const Summary = styled.section<{ $status: string }>`
  background: ${colors.surfaceSoft};
  border: 1px solid rgb(217 226 236 / 0.9);
  border-left: 0.35rem solid
    ${({ $status }) =>
      $status === 'winning'
        ? colors.success
        : $status === 'outbid'
          ? colors.danger
          : $status === 'countered'
            ? colors.attention
            : colors.accent};
  border-radius: 0.65rem;
  display: grid;
  gap: 0.85rem;
  padding: 0.85rem;
`;

export const Header = styled.div`
  align-items: start;
  display: flex;
  gap: 1rem;
  justify-content: space-between;

  p,
  h4 {
    margin: 0;
  }

  p {
    color: ${colors.softMuted};
    font-size: 0.72rem;
    font-weight: 900;
    text-transform: uppercase;
  }

  h4 {
    color: ${colors.ink};
    font-size: 1rem;
    margin-top: 0.2rem;
  }
`;

export const StatusPill = styled.strong`
  background: ${colors.accentSoft};
  border-radius: 999px;
  color: ${colors.accent};
  font-size: 0.78rem;
  padding: 0.45rem 0.7rem;
  white-space: nowrap;
`;

export const Guidance = styled.p<{ $urgent: boolean }>`
  background: ${({ $urgent }) => ($urgent ? '#fff7ed' : 'rgb(230 244 241 / 0.75)')};
  border-radius: 0.5rem;
  color: ${({ $urgent }) => ($urgent ? colors.danger : colors.accent)};
  font-weight: 800;
  margin: 0;
  padding: 0.7rem 0.8rem;
`;
