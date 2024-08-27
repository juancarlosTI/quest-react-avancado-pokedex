import { createContext, useState } from "react"

export const MouseContext = createContext()

export const MouseProvider = ({children}) => {

    const [toolTipPosition, setTooltipPosition ] = useState({activeStatus:false})
    return (
        <MouseContext.Provider value={{toolTipPosition, setTooltipPosition}}>
            {children}
        </MouseContext.Provider>       
    )
    
}