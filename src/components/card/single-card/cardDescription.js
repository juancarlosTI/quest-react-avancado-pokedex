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

    //Id para nomear o end-point /card/id
    const { id } = useParams;

    useEffect(() => {
        async function getAbilities() {
            const abilitiesData = await Promise.all(selectedCard.abilities.map(async (ability, index) => {
                const response = await fetch(ability.ability.url)
                const data = await response.json()
                const array_ability = await data.effect_entries.find(language => language.language.name === 'en');
                //Formatando o objeto para incluir o ability.ability.name - Nome da habilidade
                return {name: ability.ability.name , description: array_ability};
            }))
            setAbility(abilitiesData);
        }
        getAbilities();
    }, [selectedCard])





    // async function getAbility(){
    //     const response = await getAbilities();
    //     const data = await fetch('https://pokeapi.co/api/v2/ability/66/');
    //     const descriptionAbility = await data.json()
    //     console.log(response.effect_entries[0].effect)
    //     return await descriptionAbility
    // }

    //getAbility();
    console.log(abilities)

    return (
        <>
            <Link to='/'>Voltar para lista de pokémon's</Link>
            <Container>

                <Div>
                    <p>Description of the Pokemon card.</p>
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

                                            <li>{index} - {ability.name} <br/> {ability.description.effect} / </li>

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
    width:50vw;
    height:100vh;
    //justify-content:center;
    margin: 0 auto;
`
const Div = styled.div`
    display:flex;
    //flex-direction:column;
    //grid-template-colums: repeat(2,1fr);
    justify-content:center;
    width: 720px;
    align-items:center;
    
    .pokemon-image {
        display:flex;
        flex-direction:column;
        justify-content:center;
        align-items: center;
    }

    .pokemon-image img {
        width: 250px;
        height: 250px;
    }

    p {
        align-self: center;
        //Então é assim que usa isso ;D
    }

`
const Details = styled.div`
    display:grid;
    grid-template-columns: repeat(2,1fr);
    border: 1px solid black;
    gap:10px;
    padding: 5px;
    border-radius:6px;
`
const Moves = styled.div`
    display:flex;
    flex-direction:column;
    //flex-wrap: wrap;
    width:250px;
    height:200px;
    overflow-y:auto;
    padding: 3px;
    //justify-content:center;

    ul {
        display:grid;
        grid-template-columns: repeat(2,1fr);
        list-style-type: none;
        padding: 0;
        gap: 10px;
    }

    li {
        border: 1px solid black;
        border-radius: 6px;
        padding: 3px;
    }

    p {
        color: white;
        align-self:center;
        background-color:black;
    }
`
const Abilities = styled.div`
    display:flex;
    flex-direction:column;
    width:250px;
    height:200px;
    overflow-y:auto;
    p {
        color:white;
        align-self:center;
        background-color:black;    
    }

    ul {
        display:flex;
        flex-direction:column;
        list-style-type:none;
        padding: 0;
        gap: 10px;
    }

    li {
        border: 1px solid black;
        border-radius: 6px;
        padding: 3px;
    }
`