// Lista de movimentos (moves) data.moves[i].move.name e move.url
// Lista de habilidades (abilities) - Nome e descrição - Acessar a url da habilidade e pegar o atributo - effect_entries : effect. Como os pokemon's possuem mais de uma habilidade, é necessário que este atributo receba um array [habilidade,descricao_da_habilidade]. data.abilities[i].ability.name e .ability.url
// Tipo do pokemon (type) - https://pokeapi.co/api/v2/type/1/
// Imagem do pokemon - data.sprites

import styled from "styled-components"
import { CardContext } from "../../../context/CardContext";
import { useContext, useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";



export const SingleCard = () => {
    const { selectedCard } = useContext(CardContext);
    const [abilities, setAbility] = useState([]);

    //Personalização da descrição das habilidades
    const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0, activeStatus: false});

    //Id para nomear o end-point /card/id
    const { id } = useParams;

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
        setTooltipPosition({ top: clientY, left: clientX, activeStatus: true })
        //console.log('Name: ', card_name)
    }
    // Filtro de tipo de pokemon aqui na exibição
    const handleOnMouseLeave = () => {
        setTooltipPosition({  activeStatus: false });
        //console.log('Mouse saiu da LI')
    }

    return (
        <>

            <Container>
                <Link className="btn-back" to='/'>Voltar para lista de pokémon's</Link>
                <Div>

                    <div className="pokemon-image">
                        <img src={selectedCard.sprite} alt={selectedCard.name} />
                        <p>{selectedCard.name}</p>
                    </div>

                    <Details>
                        <Moves>
                            <p>Moves</p>
                            <ul>
                                {selectedCard.moves.map((move) => {
                                    return (
                                        <>
                                            <li>{move.move.name}</li>
                                        </>
                                    )
                                })}
                            </ul>
                        </Moves>
                        <Abilities>
                            <p>Abilities</p>
                            <ul>
                                {abilities.map((ability, index) => {

                                    return (
                                        <>

                                            <li onMouseMove={(e) => {
                                                handleOnMouseMove(e,index)
                                            }} onMouseLeave={handleOnMouseLeave}>
                                                {ability.name}
                                                {selectedCard.activeStatus && (
                                                    <Tooltip className={`${tooltipPosition.activeStatus ? 'active' : ''}`} style={{ top: tooltipPosition.top, left: tooltipPosition.left }}>
                                                        {ability.description.effect}
                                                    </Tooltip>
                                                )}
                                            </li>

                                        </>
                                    )
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
    height:100vh;
    justify-content:center;
    align-items:center;
    flex-direction:column;
    background: ${props => props.theme.backgroundImageDescription};
    background-size:110% 120vh;
    background-repeat: no-repeat;
    //margin: 0 auto;
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
    width: 1080px;
    height:350px;
    padding:5px;
    align-items:center;
    background-color:lightblue;
    gap:100px;
    border: 20px solid black;
    outline:5px solid black;
    outline-offset: -40px;
    
    

    //border-radius:5px;
    //border-width:thick;
    
    .pokemon-image {
        display:flex;
        flex-direction:column;
        justify-content:center;
        align-items: center;
        background:white;
        border: 1px solid black;
        border-radius:5px;
        border-width:medium;
    }

    .pokemon-image img {
        width: 250px;
        height: 250px;
    }

    p {
        align-self: center;
    }
`
const Details = styled.div`
    display:grid;
    grid-template-columns: repeat(2,1fr);
    border: 5px inset black;
    gap:10px;
    padding: 25px;
    border-radius:6px;
    background:white;
`
const Moves = styled.div`
    display:flex;
    flex-direction:column;
    //flex-wrap: wrap;
    width:250px;
    height:200px;
    overflow-y:auto;
    padding: 3px;
    margin: 0 auto;
    //justify-content:center;

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

    p {

        color: black;
        align-self:center;
        
        //background-color:black;
    }

    li::first-letter {
        text-transform: uppercase;
    }
`
const Abilities = styled.div`

    display:flex;
    flex-direction:column;
    width:250px;
    height:200px;
    overflow-y:scroll;

    p {
        display:flex;
        color:black;
        align-self:center;
        //background-color:black;    
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
        justify-content:center;
        align-items:center;
        padding:10px;
        text-transform:capitalize;
    }

`
const Tooltip = styled.div`
    opacity: 0;
    display:none;
    //justify-content:center;
    pointer-events:none;
    text-transform:none;
    width:250px;
    padding:10px;
    word-wrap:break-word;
    //transform: translate(0,-110%);
    background-color:white;
    


    &.active {
        display:block;
        opacity:1;
        align-self:center;
    }

`