import { useEffect, useState } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { useAppDispatch, useAppSelector } from './app/hooks';
import Main from './components/Main';
import Sidebar from './components/Sidebar';
import { openSidebar } from './features/taskSlice';
import { darkTheme, lightTheme } from './styles/defaultTheme';
import { GlobalStyles } from './styles/globalStyles';

const App = () => {
  const [theme, setTheme] = useState(darkTheme);
  const { isSidebarOpen } = useAppSelector(state => state.task);
  const dispatch = useAppDispatch();

  const toggleTheme = () => {
    setTheme(theme === darkTheme ? lightTheme : darkTheme);
  };

  useEffect(() => {
    // if window size is more than 425px and sidebar is false, set it to true
    if (window.innerWidth > 425 && !isSidebarOpen) {
      dispatch(openSidebar());
    }
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <AppContainer>
        {isSidebarOpen && <Sidebar toggleTheme={toggleTheme} theme={theme} />}
        <Main />
      </AppContainer>
    </ThemeProvider>
  );
};

const AppContainer = styled.div`
  display: flex;
  /* width: 100vw; */

  @media (max-width: 768px) {
  }
`;

export default App;
