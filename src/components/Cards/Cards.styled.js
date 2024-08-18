import styled from "styled-components";

export const OpenAllCardsImages = styled.span`
  cursor: pointer;
  transition: opacity 0.3s;
  opacity: ${props => (props.$isEpiphany ? "0.4" : "1")};
`;
