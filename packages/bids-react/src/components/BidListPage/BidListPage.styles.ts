import styled from 'styled-components';

import { colors } from '../../styles/colors';

export const Page = styled.main`
  display: grid;
  gap: 1.5rem;
`;

export const Hero = styled.section`
  background:
    linear-gradient(90deg, rgb(20 33 61 / 0.92), rgb(15 118 110 / 0.76)),
    url('https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=1600&q=80')
      center / cover;
  border-radius: 0.75rem;
  color: white;
  padding: clamp(1.5rem, 5vw, 3rem);

  p {
    color: #d9fbf4;
    font-size: 0.78rem;
    font-weight: 900;
    margin: 0;
    text-transform: uppercase;
  }

  h1 {
    font-size: clamp(2.2rem, 6vw, 4.25rem);
    line-height: 1;
    margin: 0.45rem 0 0.75rem;
    max-width: 11ch;
  }

  span {
    color: #d9fbf4;
    display: block;
    line-height: 1.7;
    max-width: 64ch;
  }
`;

export const Panel = styled.section`
  display: grid;
  gap: 1rem;

  header {
    align-items: center;
    display: flex;
    justify-content: space-between;
  }

  header p {
    color: ${colors.accent};
    font-size: 0.78rem;
    font-weight: 900;
    margin: 0;
    text-transform: uppercase;
  }

  h2 {
    color: ${colors.ink};
    margin: 0;
  }
`;

export const CardList = styled.div`
  display: grid;
  gap: 1rem;
`;

export const RetryButton = styled.button`
  background: ${colors.accent};
  border: 0;
  border-radius: 0.5rem;
  color: white;
  cursor: pointer;
  font-weight: 900;
  padding: 0.7rem 1rem;
`;
