import { createContext, useState } from "react";

export const CardContext = createContext();

//Provedor do contexto

export const CardProvider = ({children}) => {
    const [selectedCard, setSelectedCard] = useState({});
    return (
        <CardContext.Provider value={{selectedCard,setSelectedCard}}>
            {children}
        </CardContext.Provider>
    )
}