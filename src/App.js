import './App.css';
import styled, { keyframes } from 'styled-components';
import { AppRoutes } from './pages/routes';
import { ThemeProvider, ThemeContext } from './context/ToggleBtnContext'
import { useContext } from 'react';
import { MouseProvider } from './context/MouseMoveContext';

function App() {
  const { theme } = useContext(ThemeContext);
  return (

    <>
      <div>
        <MouseProvider>
          <ThemeProvider>
            <AppRoutes />
          </ThemeProvider>
        </MouseProvider>

      </div>  
    </>
  );
}

export default App;
