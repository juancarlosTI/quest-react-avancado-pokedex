import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Exibition } from "./cardList"
import { Card } from "./singleCard"
import { CardProvider } from '../context/CardContext'

const AppRoutes = () => {
    return (
        <BrowserRouter>
            <CardProvider>
                <Routes>

                    <Route exact path="/" element={<Exibition />} />
                    <Route exact path="/card/:id" element={<Card />} />

                </Routes>
            </CardProvider>
        </BrowserRouter >
    )
}

export { AppRoutes }