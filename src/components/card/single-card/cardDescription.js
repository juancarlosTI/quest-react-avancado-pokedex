// Lista de movimentos (moves) data.moves[i].move.name e move.url
// Lista de habilidades (abilities) - Nome e descrição - Acessar a url da habilidade e pegar o atributo - effect_entries : effect. Como os pokemon's possuem mais de uma habilidade, é necessário que este atributo receba um array [habilidade,descricao_da_habilidade]. data.abilities[i].ability.name e .ability.url
// Tipo do pokemon (type) - https://pokeapi.co/api/v2/type/1/
// Imagem do pokemon - data.sprites

import styled from "styled-components"
import { CardContext } from "../../../context/CardContext";
import { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import React from "react";


export const SingleCard = () => {
    const { selectedCard } = useContext(CardContext);
    const [abilities, setAbility] = useState([]);

    //Personalização da descrição das habilidades
    const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0, activeStatus: false, activeIndex: null });

    useEffect(() => {
        async function getAbilities() {
            const abilitiesData = await Promise.all(selectedCard.abilities.map(async (ability, index) => {
                const response = await fetch(ability.ability.url)
                const data = await response.json()
                const array_ability = await data.effect_entries.find(language => language.language.name === 'en');
                //Formatando o objeto para incluir o ability.ability.name - Nome da habilidade
                return { name: ability.ability.name, description: array_ability };
            }))
            setAbility(abilitiesData);
        }
        getAbilities();
    }, [selectedCard])


    const handleOnMouseMove = (e, index) => {
        const { clientX, clientY } = e;
        setTooltipPosition({ top: clientY, left: clientX, activeStatus: true, activeIndex: index })
    }
    // Filtro de tipo de pokemon aqui na exibição
    const handleOnMouseLeave = () => {
        setTooltipPosition({ activeStatus: false, activeIndex: null });
    }

    return (
        <>

            <Container>
                <Link className="btn-back" to='/'>Voltar para lista de pokémon's</Link>
                <Div>

                    <div className="pokemon-image">
                        <img src={selectedCard.sprite} alt={selectedCard.name} />
                        <div className="pokemon-info">
                            <p className="pokemon-name">
                                Name: <br />
                                {selectedCard.name}
                            </p>
                            
                            <ul>
                                <p className="pokemon-types">
                                    Types: <br />
                                </p>
                                {selectedCard.types.map((type, index) => (

                                    <React.Fragment key={type.type.name}>
                                        <li>
                                            {type.type.name}
                                            <br />
                                        </li>
                                    </React.Fragment>

                                ))}
                            </ul>
                        </div>

                    </div>

                    <Details>
                        <Moves>
                            <p className="listed-moves">Moves</p>
                            <ul>
                                {selectedCard.moves.map((move, index) => {
                                    return <li key={index}>{move.move.name}</li>
                                })}
                            </ul>
                        </Moves>
                        <Abilities>
                            <p className="listed-abilities">Abilities</p>
                            <ul>
                                {abilities.map((ability, index) => {
                                    return <li key={index} onMouseMove={(e) => {
                                        handleOnMouseMove(e, index)
                                    }} onMouseLeave={handleOnMouseLeave}>
                                        <p className="ability-name">{ability.name}</p>
                                        <Tooltip className={`${tooltipPosition.activeIndex === index && tooltipPosition.activeStatus ? 'active' : ''}`} style={{ top: tooltipPosition.top, left: tooltipPosition.left }}>
                                            <p className="ability-effect">{ability.description.effect}</p>
                                        </Tooltip>

                                    </li>
                                })}
                            </ul>
                        </Abilities>
                    </Details>
                </Div>
            </Container >
        </>

    )
}
const Container = styled.div`
    display:flex;
    width:100vw;
    height:100vh;
    justify-content:center;
    align-items:center;
    flex-direction:column;
    background: ${props => props.theme.backgroundImageDescription};
    background-size:cover;
    font-family: 'Pixelify Sans',sans-serif;

    .btn-back {
        background-color:white;
        padding:10px;
        margin-bottom:20px;
        border-radius:6px;
        border: 5px double black;
    }
`
const Div = styled.div`
    display:flex;
    justify-content:center;
    width: 1000px;
    height:350px;
    padding:25px;
    align-items:center;
    background-color:lightblue;
    gap:10px;
    
    border: 10px solid black;
    border-radius:6px;

    outline:5px solid black;
    outline-offset: -40px;
    
    .pokemon-image {
        display:flex;
        flex-direction:column;
        justify-content:center;
        align-items: center;
        background:white;
        border: 5px inset black;
        border-radius:6px;
        border-width:medium;
        margin-left:10px;
    }

    .pokemon-image img {
        width: 230px;
        height: 230px;
    }

    .pokemon-name{
        font-size:22px;
        align-self: center;
        text-transform:capitalize;
        margin:0;
    }

    .pokemon-types {
        display:flex;
        align-items:center;
        margin: 0;
        padding:5px 0px;
        padding-left:5px;
        margin-top:10px;
        font-size:12px;
        
    }

    .pokemon-info {
        display:flex;
        padding:5px;
    }
    
    .pokemon-info ul {
        list-style-type:none;
        padding-left:20px;
        margin:2px;
    }

    .pokemon-info ul li::first-letter{
        text-transform: uppercase;
    }

    @media (max-width:1024px){
        width: 800px;
        
        .pokemon-image img{
            width:180px;
            height:180px;
        }
    }

    @media (max-width:768px){
        width:580px;

        .pokemon-types {
            padding:5px;
        }
        .pokemon-types ul{
            
        }
    }

    @media (max-width:576px){
        width:270px;
        flex-direction:column;
        padding:10px;

        .pokemon-image {
            flex-direction: row;
            padding: 0 10px;
            margin:0;
            
        }

        .pokemon-image img {
            width:130px;
            height:130px;
        }

        .pokemon-name {
            font-size:14px;
        }

        .pokemon-info {
            flex-direction:column;
            padding:0;
        }

        .pokemon-info ul {
            display:flex;
            flex-direction:column;
            margin:0;
            padding:0;
            margin-top: 10px;
        }
    }
`
const Details = styled.div`
    display:grid;
    width:550px;
    height:250px;
    grid-template-columns: repeat(2,1fr);
    border: 5px inset black;
    border-width:medium;
    gap:10px;
    padding: 15px;
    margin-top:20px;
    border-radius:6px;
    align-items:center;
    background:white;
    
    @media (max-width:768px){
        display:flex;
        flex-direction:column;
        width:300px;
        height: 250px;
    }

    @media (max-width:576px){
        width:200px;
        height:90px;
        flex-direction:row;
    }
`
const Moves = styled.div`
    display:flex;
    flex-direction:column;
    width:250px;
    height:200px;
    overflow-y:auto;
    scrollbar-width: thin; /* Define a largura da barra de rolagem como fina */
    scrollbar-color: #cfcfcf #ffffff; /* Define as cores do thumb e do trilho */
    padding: 3px;
    align-items:center;
        

    ul {
        display:grid;
        grid-template-columns: repeat(2,1fr);
        list-style-type: none;
        padding: 0;
        margin: 0;
        gap: 10px;
    }

    li {
        width: 70px;
        text-align:center;
        align-self:center;
        border: 2px solid black;
        border-radius: 6px;
        padding: 5px;
        font-weight:600;
        word-break:break-word;
    }

    .listed-moves {
        font-size:22px;
        color: black;
        align-self:center;
    }

    li::first-letter {
        text-transform: uppercase;
    }

    li:hover {
        background-color:lightblue;
        color:white;
        box-shadow:0px 0px 3px blue;
        border: 2px solid white;

    }

    @media (max-width:576px){

        li { 
            width:35px;
            font-size:10px;
            padding:2px;
        }

        height: 100%;

        .listed-moves {
            font-size:14px;
        }
    }
`
const Abilities = styled.div`

    display:flex;
    flex-direction:column;
    width:250px;
    height:200px;   
    overflow-y:scroll;
    padding:3px;
    scrollbar-width: thin; /* Define a largura da barra de rolagem como fina */
    scrollbar-color: #cfcfcf #ffffff; /* Define as cores do thumb e do trilho */
    
    .listed-abilities {
        display:flex;
        font-size:22px;
        color:black;
        align-self:center;   
    }

    ul {
        display:flex;
        flex-direction:column;
        list-style-type:none;
        padding: 0;
        margin: 0;
        gap: 10px;
    }

    li {
        display:flex;
        font-weight:600;
        border: 2px solid black;
        border-radius: 6px;
        padding: 3px;
        margin-bottom: 2px;
        justify-content:center;
        align-items:center;
        text-transform:capitalize;
    }

    li:hover {
        box-shadow:0px 0px 3px blue;
        border: 2px solid white;

    }

    .ability-name {
        margin: 0;
    }

    @media (max-width:1024px){
        width:220px;
        height:170px;
    
    }

    @media (max-width:575px){
        width:150px;
        height:100%;

        .listed-abilities {
            font-size:14px;
        }
        
        .ability-name {
            font-size:10px;
            text-align:center;
        }

        li {
            flex-direction:column;
            padding:5px;
        }

    }

`
const Tooltip = styled.div`

    opacity: 0;
    display:none;
    pointer-events:none;
    text-transform:none;
    width:250px;
    padding:10px;
    word-wrap:break-word;
    background-color:white;   
    
    &.active {
        display:block;
        opacity:1;
        align-self:center;
    }

    @media (max-width:575px){

        width:100%;
        padding:0;
        .ability-effect{
            font-size:10px;
        }
    }

    
`