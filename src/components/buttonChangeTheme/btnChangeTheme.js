import { useContext } from "react"
import { ThemeContext, themes } from '../../context/ToggleBtnContext'




export const ThemeButton = () => {
    const { theme, setTheme } = useContext(ThemeContext);

    return (
        <button onClick={() => {
            setTheme(theme === themes.light ? themes.dark : themes.light)
            console.log(theme)
        }}>Value</button>
    )
}