import styled from 'styled-components';

const colors = {
  ink: '#14213d',
  line: '#d9e2ec',
  softText: '#d9fbf4',
};

export const BidsPageShell = styled.div`
  display: grid;
  gap: 1.5rem;
`;

export const BidsHero = styled.section`
  background:
    linear-gradient(90deg, rgb(20 33 61 / 0.92), rgb(15 118 110 / 0.76)),
    url('https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=1600&q=80')
      center/cover;
  border-radius: 0.75rem;
  color: white;
  padding: clamp(1.5rem, 5vw, 3rem);

  h1 {
    font-size: clamp(2.2rem, 6vw, 4.25rem);
    line-height: 1;
    margin: 0.45rem 0 0.75rem;
    max-width: 11ch;
  }

  p:not(:first-child) {
    color: ${colors.softText};
    line-height: 1.7;
    margin: 0;
    max-width: 64ch;
  }
`;

export const Eyebrow = styled.p`
  color: inherit;
  font-size: 0.78rem;
  font-weight: 900;
  letter-spacing: 0.08em;
  margin: 0;
  text-transform: uppercase;
`;

export const BidsPanel = styled.section`
  display: grid;
  gap: 1rem;
`;

export const BidsHeading = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;

  h2 {
    color: ${colors.ink};
    margin: 0.25rem 0 0;
  }
`;

export const BidCardList = styled.div`
  display: grid;
  gap: 1rem;
`;

export const EmptyPanel = styled.div`
  background: white;
  border: 1px solid ${colors.line};
  border-radius: 0.75rem;
  padding: 1.5rem;
`;
