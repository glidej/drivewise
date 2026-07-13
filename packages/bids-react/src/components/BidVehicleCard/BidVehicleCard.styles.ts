import styled from 'styled-components';

import { colors } from '../../styles/colors';

export const Card = styled.article<{ $highlighted: boolean; $marketSignal: string }>`
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
    background: ${({ $marketSignal }) =>
      $marketSignal === 'price-drop'
        ? `linear-gradient(180deg, ${colors.success}, ${colors.accent})`
        : $marketSignal === 'reserved'
          ? `linear-gradient(180deg, ${colors.attention}, ${colors.danger})`
          : `linear-gradient(180deg, ${colors.accent}, #34d399)`};
    content: '';
    inset: 0 auto 0 0;
    opacity: ${({ $highlighted, $marketSignal }) =>
      $highlighted || $marketSignal === 'price-drop' || $marketSignal === 'reserved' ? 1 : 0};
    position: absolute;
    width: 0.35rem;
    z-index: 2;
  }

  &:hover {
    border-color: rgb(15 118 110 / 0.42);
    box-shadow: 0 1rem 2.5rem rgb(20 33 61 / 0.1);
    transform: translateY(-2px);
  }

  &:focus-within {
    outline: 3px solid rgb(15 118 110 / 0.28);
    outline-offset: 3px;
  }

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

export const Media = styled.div`
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
    transition: transform 220ms ease;
    width: 100%;
  }

  ${Card}:hover & img {
    transform: scale(1.035);
  }

  @media (max-width: 900px) {
    min-height: 0;

    img {
      aspect-ratio: 16 / 9;
    }
  }
`;

export const Badge = styled.span`
  background: rgb(255 255 255 / 0.92);
  border-radius: 999px;
  color: ${colors.ink};
  font-size: 0.78rem;
  font-weight: 900;
  left: 0.85rem;
  padding: 0.45rem 0.7rem;
  position: absolute;
  top: 0.85rem;
  z-index: 1;
`;

export const MediaMeta = styled(Badge)`
  background: rgb(20 33 61 / 0.78);
  bottom: 0.85rem;
  color: white;
  right: 0.85rem;
  top: auto;
  width: fit-content;
`;

export const Body = styled.div`
  display: grid;
  gap: 1rem;
  padding: clamp(1rem, 2vw, 1.25rem);
`;

export const Title = styled.div`
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
  }
`;

export const DetailsButton = styled.button`
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
