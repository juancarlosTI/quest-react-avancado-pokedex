import './App.css';
import styled, { keyframes } from 'styled-components';
import { AppRoutes } from './pages/routes';


function App() {
  return (
    <>
      <div>
          <AppRoutes />
      </div>
      {/* <P><Ponto>.</Ponto><Ponto>.</Ponto><Ponto>.</Ponto></P> */}
    </>
  );
}

export default App;

const PontoPisca = keyframes`
  0% {opacity: 0;}
  50% {opacity: 1;}
  100% {opacity: 0;}
`

const Ponto = styled.span`
  font-size: 72px;
  animation: ${PontoPisca} 1.5s infinite;
  &:nth-child(2){
    animation-delay: 0.5s;
  }
  &:nth-child(3){
    animation-delay: 1s;
  }
`

const P = styled.p`
  display:flex;
  justify-content:center;
  align-items: center;
`

