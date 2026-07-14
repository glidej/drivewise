import styled from 'styled-components';

const colors = {
  accent: '#0f766e',
  attention: '#f59e0b',
  danger: '#b45309',
  ink: '#14213d',
  line: '#d9e2ec',
  muted: '#52616f',
  softMuted: '#627d98',
  surfaceSoft: '#f7f9fb',
};

export const LiveActivitySection = styled.section`
  background:
    linear-gradient(135deg, rgb(230 244 241 / 0.9), rgb(247 249 251 / 0.94)), ${colors.surfaceSoft};
  border: 1px solid rgb(153 216 206 / 0.75);
  border-radius: 0.65rem;
  display: grid;
  gap: 0.85rem;
  padding: 0.85rem;
`;

export const LiveHeader = styled.div`
  align-items: start;
  display: flex;
  gap: 1rem;
  justify-content: space-between;

  p,
  h4 {
    margin: 0;
  }

  p {
    color: ${colors.accent};
    font-size: 0.72rem;
    font-weight: 900;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  h4 {
    color: ${colors.ink};
    font-size: 1rem;
    margin-top: 0.2rem;
  }
`;

export const SocketDot = styled.span<{ $live: boolean }>`
  background: ${({ $live }) => ($live ? colors.accent : colors.attention)};
  border: 0.25rem solid rgb(255 255 255 / 0.9);
  border-radius: 999px;
  box-shadow: 0 0 0 0.25rem
    ${({ $live }) => ($live ? 'rgb(15 118 110 / 0.16)' : 'rgb(245 158 11 / 0.16)')};
  flex: 0 0 auto;
  height: 0.85rem;
  margin-top: 0.2rem;
  width: 0.85rem;
`;

export const MarketCallout = styled.p<{ $signal: string }>`
  background: rgb(255 255 255 / 0.82);
  border-left: 0.25rem solid
    ${({ $signal }) =>
      $signal === 'price-drop'
        ? '#16a34a'
        : $signal === 'high-demand'
          ? colors.attention
          : $signal === 'reserved'
            ? colors.danger
            : colors.accent};
  border-radius: 0.5rem;
  color: ${({ $signal }) => ($signal === 'price-drop' ? colors.accent : colors.muted)};
  font-weight: 800;
  line-height: 1.5;
  margin: 0;
  padding: 0.7rem 0.8rem;
`;

export const LiveMetrics = styled.dl`
  display: grid;
  gap: 0.55rem;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  margin: 0;

  div {
    background: rgb(255 255 255 / 0.72);
    border-radius: 0.5rem;
    padding: 0.65rem;
  }

  dt {
    color: ${colors.softMuted};
    font-size: 0.68rem;
    font-weight: 900;
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }

  dd {
    color: ${colors.ink};
    font-weight: 900;
    margin: 0.2rem 0 0;
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

export const ActivityToggle = styled.button`
  background: transparent;
  border: 0;
  color: ${colors.ink};
  cursor: pointer;
  font-weight: 900;
  justify-self: start;
  padding: 0;
  text-decoration: underline;
  text-decoration-color: rgb(15 118 110 / 0.4);
  text-underline-offset: 0.25rem;

  &:focus-visible {
    border-radius: 0.35rem;
    outline: 3px solid rgb(15 118 110 / 0.28);
    outline-offset: 3px;
  }
`;

export const ActivityFeed = styled.ol`
  display: grid;
  gap: 0.45rem;
  list-style: none;
  margin: 0;
  padding: 0;

  li {
    background: white;
    border: 1px solid rgb(217 226 236 / 0.8);
    border-radius: 0.5rem;
    display: grid;
    gap: 0.2rem;
    padding: 0.65rem;
  }
`;

export const ActivityFeedItem = styled.li<{ $kind: string }>`
  border-left: 0.25rem solid
    ${({ $kind }) =>
      $kind === 'price'
        ? '#16a34a'
        : $kind === 'hold'
          ? colors.attention
          : $kind === 'heartbeat'
            ? colors.softMuted
            : colors.accent};

  span {
    color: ${colors.ink};
    font-weight: 800;
  }

  small {
    color: ${colors.softMuted};
    font-weight: 800;
    text-transform: uppercase;
  }
`;
