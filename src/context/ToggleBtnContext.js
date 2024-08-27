import { createContext, useContext } from "react";
import { useState } from "react";

export const themes = {
    light: {
        color: '#000000',
        background:'lightblue',
        backgroundImage: "url('/images/background-dia.jpg')",
        backgroundSize:"cover"
    },
    dark: {
        color:'#ffffff',
        background: '#000000',
        backgroundImage: "url('/images/night-sky.jpg')",
        backgroundSize:"cover"
    }
}

export const ThemeContext = createContext({})

export const ThemeProvider = (props) => {
    const [theme,setTheme] = useState(themes.light)

    return (
        <ThemeContext.Provider value={{theme,setTheme}}>
            {props.children}
        </ThemeContext.Provider>
    )
    

}