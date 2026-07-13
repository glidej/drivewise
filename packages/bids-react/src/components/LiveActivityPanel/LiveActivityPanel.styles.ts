import styled from 'styled-components';

import { colors } from '../../styles/colors';

export const Activity = styled.section`
  background: linear-gradient(135deg, rgb(230 244 241 / 0.9), rgb(247 249 251 / 0.94));
  border: 1px solid #99d8ce;
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

export const Dot = styled.span<{ $live: boolean }>`
  background: ${({ $live }) => ($live ? colors.accent : colors.attention)};
  border-radius: 50%;
  height: 0.85rem;
  width: 0.85rem;
`;

export const Callout = styled.p`
  background: rgb(255 255 255 / 0.82);
  border-left: 0.25rem solid ${colors.accent};
  border-radius: 0.5rem;
  color: ${colors.muted};
  font-weight: 800;
  margin: 0;
  padding: 0.7rem 0.8rem;
`;

export const Toggle = styled.button`
  background: none;
  border: 0;
  color: ${colors.ink};
  cursor: pointer;
  font-weight: 900;
  justify-self: start;
  padding: 0;
  text-decoration: underline;
  text-underline-offset: 0.25rem;
`;

export const Feed = styled.ol`
  display: grid;
  gap: 0.45rem;
  list-style: none;
  margin: 0;
  padding: 0;

  li {
    background: white;
    border: 1px solid ${colors.line};
    border-radius: 0.5rem;
    display: grid;
    padding: 0.65rem;
  }

  small {
    color: ${colors.softMuted};
    text-transform: uppercase;
  }
`;
