import { useContext } from "react";
import { CardContext } from "../../../context/CardContext";
import { Link } from "react-router-dom";
import styled from "styled-components";

export const PokedexScreen = () => {

    const { selectedCard, setSelectedCard } = useContext(CardContext);
    
    return (
        <ExibitionCard>
            <img className="pokedex" src="/images/pokedex.png" alt="Pokedéx" />
            <img className="img-zoom" src={selectedCard.sprite} alt={selectedCard.name} />
            <p className="pokemon-name">{selectedCard.name}</p>
            <div className="dialog-box">
                <img src="/images/dialog-box.png" alt="Dialog box" />
                <Link to={`/card/${selectedCard.id}`}>
                    <p className="box-link">Click for Details...</p>
                </Link>
            </div>
        </ExibitionCard>
    )
}

const ExibitionCard = styled.div`
     // Exibição da card

    opacity: 1;
    z-index:2;
    position:relative;
    display:flex;
    flex-direction:column;
    justify-content:center;
    align-items:center;
    
    .pokedex {
        position:absolute;
        width:auto;
        height:auto;
        z-index:1;
    }

    .img-zoom {    
        width:auto;
        height:auto;
    }

    p   {
            margin:0;
    }

    .img-zoom,.pokemon-name {
        z-index:2;
        transform:translate(-20px,161px);
    }

    .pokemon-name {
        font-size:18px;
        background-color:white;
        border: 2px solid black;
    }

    .pokemon-name::first-letter{
        text-transform: uppercase;
    }

    &.active {
        opacity: 1;
    }

    @media(max-width:830px){
        .pokedex {
            width:300px;
            height:400px;
        }
    }

    @media(max-width:768px){
        transform:translate(-50px,0);
    }

    @media(max-width:575px){

        transform:none;
    }

    .dialog-box{
        display:flex;
        padding: 20px;
        position:relative;
        transform: translate(90px,-190px);
        font-size:32px;
        z-index:2;
        justify-content:center;
        align-items:center;
        font-size:18px;
        

        img {
            width:140px;
            height:250px;
            z-index: 0;
            }

        .box-link {
            display:flex;
            align-items:center;
            text-align:center;
            width:110px;
            height:110px;
            z-index:0;
            position:absolute;
            transform: translate(-125px,-70px);
            word-break: break-word;
            }

        a {
            text-decoration:none;
            color:inherit;
            z-index:3;
        }

        @media (max-width:830px){
            img {
                
            }
        }
        
    }

    

    

    
`