import styled from 'styled-components';

import { VehicleBidSummary } from '../../types';

const colors = {
  accent: '#0f766e',
  accentSoft: '#e6f4f1',
  attention: '#f59e0b',
  danger: '#b45309',
  ink: '#14213d',
  line: '#d9e2ec',
  muted: '#52616f',
  softMuted: '#627d98',
  surfaceSoft: '#f7f9fb',
};

const shadow = '0 1rem 2.5rem rgb(20 33 61 / 0.1)';

export const ResultCard = styled.article<{ $highlighted: boolean }>`
  background: linear-gradient(135deg, rgb(255 255 255 / 0.96), rgb(247 249 251 / 0.9)), white;
  border: 1px solid ${({ $highlighted }) => ($highlighted ? 'rgb(245 158 11 / 0.45)' : colors.line)};
  border-radius: 0.75rem;
  box-shadow: 0 0.2rem 0.75rem rgb(20 33 61 / 0.05);
  display: grid;
  grid-template-columns: minmax(220px, 0.38fr) minmax(0, 1fr);
  isolation: isolate;
  overflow: hidden;
  position: relative;
  transition:
    border-color 180ms ease,
    box-shadow 180ms ease,
    transform 180ms ease;

  &::before {
    background: linear-gradient(180deg, ${colors.accent}, #34d399);
    content: '';
    inset: 0 auto 0 0;
    opacity: ${({ $highlighted }) => ($highlighted ? 1 : 0)};
    position: absolute;
    transition: opacity 180ms ease;
    width: 0.35rem;
    z-index: 2;
  }

  &:hover {
    border-color: rgb(15 118 110 / 0.42);
    box-shadow: ${shadow};
    transform: translateY(-2px);

    img {
      transform: scale(1.035);
    }
  }

  &:focus-within {
    outline: 3px solid rgb(15 118 110 / 0.28);
    outline-offset: 3px;
  }

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

export const ResultMedia = styled.div`
  background: ${colors.ink};
  min-height: 15rem;
  overflow: hidden;
  position: relative;

  &::after {
    background:
      linear-gradient(180deg, rgb(20 33 61 / 0), rgb(20 33 61 / 0.78)),
      linear-gradient(90deg, rgb(15 118 110 / 0.2), rgb(20 33 61 / 0));
    content: '';
    inset: 0;
    pointer-events: none;
    position: absolute;
  }

  img {
    height: 100%;
    object-fit: cover;
    transform: scale(1);
    transition: transform 220ms ease;
    width: 100%;
  }

  @media (max-width: 900px) {
    min-height: 0;

    img {
      aspect-ratio: 16 / 9;
    }
  }
`;

export const ResultBadge = styled.span`
  background: rgb(255 255 255 / 0.92);
  border-radius: 999px;
  color: ${colors.ink};
  display: inline-flex;
  font-size: 0.78rem;
  font-weight: 900;
  left: 0.85rem;
  line-height: 1;
  padding: 0.45rem 0.7rem;
  position: absolute;
  top: 0.85rem;
  z-index: 1;
`;

export const ResultMediaMeta = styled.span`
  background: rgb(20 33 61 / 0.78);
  border-radius: 999px;
  bottom: 0.85rem;
  color: white;
  display: inline-flex;
  font-size: 0.78rem;
  font-weight: 900;
  left: 0.85rem;
  line-height: 1;
  padding: 0.45rem 0.7rem;
  position: absolute;
  right: 0.85rem;
  width: fit-content;
  z-index: 1;
`;

export const ResultBody = styled.div`
  display: grid;
  gap: 1rem;
  padding: clamp(1rem, 2vw, 1.25rem);
`;

export const ResultTitle = styled.div`
  align-items: start;
  display: grid;
  gap: 1rem;
  grid-template-columns: minmax(0, 1fr) auto;

  h3 {
    color: ${colors.ink};
    font-size: clamp(1.2rem, 2vw, 1.55rem);
    line-height: 1.1;
    margin: 0;
  }

  p {
    color: ${colors.muted};
    font-size: 0.78rem;
    font-weight: 800;
    letter-spacing: 0.08em;
    margin: 0 0 0.25rem;
    text-transform: uppercase;
  }

  span {
    color: ${colors.softMuted};
    display: inline-block;
    font-size: 0.9rem;
    margin-top: 0.35rem;
  }

  strong {
    color: ${colors.accent};
    font-size: clamp(1.25rem, 2.4vw, 1.55rem);
    line-height: 1;
    white-space: nowrap;
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;

    strong {
      justify-self: start;
    }
  }
`;

export const VehicleFacts = styled.dl`
  display: grid;
  gap: 0.75rem;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  margin: 0;

  div {
    background: ${colors.surfaceSoft};
    border: 1px solid rgb(217 226 236 / 0.75);
    border-radius: 0.5rem;
    min-width: 0;
    padding: 0.75rem;
  }

  dt {
    color: ${colors.softMuted};
    font-size: 0.72rem;
    font-weight: 900;
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }

  dd {
    color: ${colors.ink};
    font-weight: 800;
    margin: 0.25rem 0 0;
    overflow-wrap: anywhere;
  }

  @media (max-width: 1100px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

export const BidSummarySection = styled.section<{ $status: VehicleBidSummary['status'] }>`
  background: ${colors.surfaceSoft};
  border: 1px solid rgb(217 226 236 / 0.9);
  border-left: 0.35rem solid
    ${({ $status }) =>
      $status === 'winning'
        ? '#16a34a'
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

export const BidSummaryHeader = styled.div`
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
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  h4 {
    color: ${colors.ink};
    font-size: 1rem;
    margin-top: 0.2rem;
  }

  strong {
    background: ${colors.accentSoft};
    border-radius: 999px;
    color: ${colors.accent};
    display: inline-flex;
    font-size: 0.78rem;
    font-weight: 900;
    line-height: 1;
    padding: 0.45rem 0.7rem;
    white-space: nowrap;
  }

  @media (max-width: 640px) {
    display: grid;
  }
`;

export const BidMetrics = styled.dl`
  display: grid;
  gap: 0.55rem;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  margin: 0;

  div {
    background: white;
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

export const BidGuidance = styled.p<{ $status: VehicleBidSummary['status'] }>`
  background: ${({ $status }) =>
    $status === 'outbid'
      ? 'rgb(254 243 199 / 0.82)'
      : $status === 'countered'
        ? 'rgb(255 247 237 / 0.92)'
        : 'rgb(230 244 241 / 0.75)'};
  border-radius: 0.5rem;
  color: ${({ $status }) =>
    $status === 'outbid' || $status === 'countered' ? colors.danger : colors.accent};
  font-weight: 800;
  margin: 0;
  padding: 0.7rem 0.8rem;
`;

export const TagRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;

  span {
    background: ${colors.accentSoft};
    border-radius: 999px;
    color: ${colors.accent};
    display: inline-flex;
    font-size: 0.78rem;
    font-weight: 900;
    line-height: 1;
    padding: 0.45rem 0.7rem;
  }
`;

export const DetailsLink = styled.a`
  align-items: center;
  color: ${colors.ink};
  display: inline-flex;
  font-weight: 900;
  justify-self: start;
  position: relative;
  text-decoration: none;

  &::after {
    background: ${colors.accent};
    bottom: -0.2rem;
    content: '';
    height: 0.14rem;
    left: 0;
    position: absolute;
    transform: scaleX(0.28);
    transform-origin: left;
    transition: transform 160ms ease;
    width: 100%;
  }

  &:hover::after,
  &:focus-visible::after {
    transform: scaleX(1);
  }

  &:focus-visible {
    border-radius: 0.35rem;
    outline: 3px solid rgb(15 118 110 / 0.28);
    outline-offset: 3px;
  }
`;
