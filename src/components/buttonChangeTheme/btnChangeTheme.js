import { useContext } from "react"
import { ThemeContext, themes } from '../../context/ToggleBtnContext'
import styled from "styled-components";



export const ThemeButton = () => {
    const { theme, setTheme } = useContext(ThemeContext);

    return (
        <Button onClick={() => {
            setTheme(theme === themes.light ? themes.dark : themes.light)
            console.log(theme)
        }}>Change Theme <br/></Button>
    )
}

const Button = styled.button`
    position:absolute;
    display:flex;
    justify-content:center;
    align-self:center;
    right:50px;
    background-color:${props => props.theme.background};
    border-width: 3px;
    border-color:  ${props => props.theme.color};
    border-radius:5px;
    padding:10px;
    font-family: 'Pixelify Sans',sans-serif;
    font-size:12px;
    color: ${props => props.theme.color};

    @media (max-width:575px){
        width:60px;
    }

    @media (max-width:320px){
        right:15px;
    }
    
`