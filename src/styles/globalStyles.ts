import { createGlobalStyle } from 'styled-components';
import styled from 'styled-components';

export const GlobalStyles = createGlobalStyle`
*{
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}
    body {
        font-family: 'Plus Jakarta Sans', sans-serif;
        background: ${({ theme }) => theme.background};
        color: ${({ theme }) => theme.textColor};
        
        
        
        
    }
`;

export const HeadingXL = styled.div``;

export const HeadingL = styled.h1``;

export const HeadingM = styled.h2``;

export const HeadingS = styled.h3``;
