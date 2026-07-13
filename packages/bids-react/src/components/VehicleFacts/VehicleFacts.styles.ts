import styled from 'styled-components';

import { colors } from '../../styles/colors';

export const FactGrid = styled.dl`
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
