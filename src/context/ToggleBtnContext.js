import { createContext, useContext } from "react";
import { useState } from "react";
import { ThemeProvider as StyledProvider } from "styled-components";

export const themes = {
    light: {
        color: '#000000',
        background: 'lightblue',
        backgroundImageMain: "url('/images/background-dia.jpg')",
        backgroundImageDescription:"url('/images/green-field.jpg')"
    },
    dark: {
        color: '#ffffff',
        background: '#000045',
        backgroundImageMain: "url('/images/night-sky-3.jpg')",
        backgroundImageDescription:"url('/images/night-sky-3.jpg')"
    }
}

export const ThemeContext = createContext({})

export const ThemeProvider = (props) => {
    const [theme, setTheme] = useState(themes.dark)

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            <StyledProvider theme={theme}>
                {props.children}
            </StyledProvider>

        </ThemeContext.Provider>
    )


}