import { useContext, useEffect, useState } from "react"
import styled, { keyframes } from "styled-components"
import { CardContext } from "../../../context/CardContext"
import { Link } from "react-router-dom"
import { ThemeButton } from "../../buttonChangeTheme/btnChangeTheme"
import { ThemeContext } from "../../../context/ToggleBtnContext"


export const CardList = () => {

    const [cards, setCards] = useState({
        // Atributos do objeto 
        loaded_pokemons: [],
        pokemon_details: [],
        // Contador para atualizar offset do loadMoreCards
        contador_cards: 0
        //Listando 10 pokemons: https://pokeapi.co/api/v2/pokemon?limit=10&offset=0 - A cada atualização da lista, incrementar o offset em 10 significa que, a partir do primeiro, cada vez que a página for atualizada, será pulado 10 pokemon's. Isso faz com que o GET não retorne pokemon's repetidos.
    })

    // Compartilhando o contexto das cartas individuais
    const { selectedCard, setSelectedCard } = useContext(CardContext);

    const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0, activeStatus: false, card_id: null, card_name: null });


    useEffect(() => {
        async function fetchData() {
            const data = await getCards()
            setCards({
                loaded_pokemons: [...data],
                pokemon_details: [],
                contador_cards: 10
            })

        }

        fetchData();
    }, [])


    // Usando a description_url para acessar o objeto card indiv que fica dentro do retorno da função getCards()

    useEffect(() => {
        async function getObjectCard() {
            const objectData = await Promise.all(cards.loaded_pokemons.map(async (card) => {
                const response = await fetch(card.description_url);
                const data = await response.json();
                //console.log("Nome : " + data.name)
                //console.log("Sprite : " + data.sprites.front_default)
                //console.log(data)
                return await data;
            }))
            setCards(cards => ({
                ...cards,
                pokemon_details: [...objectData]
            }))
        }
        getObjectCard();

    }, [cards.loaded_pokemons])



    async function getCards() {
        const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=10&offset=0')
        const data = await response.json()
        const array_pokemons = data.results.map((card) => ({
            name: card.name,
            description_url: card.url
        }));
        return array_pokemons
    }

    async function loadMoreCards() {

        const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=10&offset=${cards.contador_cards}`)
        const data = await response.json()
        console.log("cont: " + cards.contador_cards)
        const array_pokemons = data.results.map((card) => ({
            name: card.name,
            description_url: card.url
        }));
        console.log(array_pokemons);
        return setCards(cards => ({
            ...cards,
            contador_cards: cards.contador_cards + 10,
            loaded_pokemons: [...cards.loaded_pokemons, ...array_pokemons]
        }))

    }

    const handleRenderCardClick = (card) => {
        // Lista de movimentos (moves) data.moves[i].move.name e move.url
        // Lista de habilidades (abilities) - Nome e descrição - Acessar a url da habilidade e pegar o atributo - effect_entries : effect. Como os pokemon's possuem mais de uma habilidade, é necessário que este atributo receba um array [habilidade,descricao_da_habilidade]. data.abilities[i].ability.name e .ability.url
        // Tipo do pokemon (type) - https://pokeapi.co/api/v2/type/1/
        // Imagem do pokemon - data.sprites
        const card_url = cards.loaded_pokemons[card.id - 1].description_url
        const selectedCard = {
            ...card,
            activeStatus: true,
            sprite: card.sprites.front_default
        }
        //console.log(selectedCard)
        setSelectedCard(selectedCard)
    }

    const handleOnMouseMove = (e, card_id, card_name) => {
        const { clientX, clientY } = e;
        setTooltipPosition({
             top: clientY, 
             left: clientX, 
             activeStatus: true, 
             card_id: card_id, 
             card_name: card_name })
        //console.log('Name: ', card_name)
    }
    // Filtro de tipo de pokemon aqui na exibição
    const handleOnMouseLeave = () => {
        setTooltipPosition(({activeStatus: false}));
        //console.log('Mouse saiu da LI')
    }

    return (
        <>
            <Container className="container">
                <Header>
                    <img className="pokemon-logo" src="/images/pokemon-logo.png" alt="Logo" />
                    <ThemeButton />
                </Header>
                <Div>
                    <BoardCards className="board-cards">
                        <ul>
                            {cards.pokemon_details.map((card) => {
                                return (
                                    <>
                                        <li className="item" key={card.id} onMouseMove={(e) => handleOnMouseMove(e, card.id, card.name)} onMouseLeave={handleOnMouseLeave} onClick={() => handleRenderCardClick(card)}>
                                            <img src={card.sprites.front_default} alt={card.name} />
                                            <p>Pokémon #{card.id}</p>
                                            {tooltipPosition.activeStatus && (
                                                <Tooltip className={`${tooltipPosition.activeStatus ? 'active' : ''}`} style={{ top: tooltipPosition.top, left: tooltipPosition.left }}>
                                                    {tooltipPosition.card_name}
                                                </Tooltip>
                                            )}
                                        </li></>
                                )
                            })}
                        </ul>
                        <button onClick={() => {
                            loadMoreCards();
                            //console.log("Contador para mudar o offset da requisição GET" + cards.contador_cards)
                            console.log(cards.pokemon_details)
                        }}>Clique para carregar mais 10 Pokemon's</button>
                    </BoardCards>
                    <ExibitionCard className={selectedCard.activeStatus ? 'active' : ''}>
                        <img className="pokedex" src="/images/pngegg.png" alt="" />
                        <img className="img-zoom" src={selectedCard.sprite} alt={selectedCard.name} />
                        <p className="pokemon-name">{selectedCard.name}</p>
                        <div className="dialog-box">
                            <img src="/images/dialog-box.png" alt="Dialog box" />
                            <Link to={`/card/${selectedCard.id}`}>
                                <p className="box-link">Click for Details...</p>
                            </Link>
                        </div>
                    </ExibitionCard>
                </Div>
            </Container>
        </>
    )
}

//Styled-components

//Primeira página - Item Pokemon : estilizar :hover do pokemon exibindo o pokemon-id com uma transition, exibindo um balão de dialogo; ao clicar, aparecerá uma carta ao lado contendo o nome do pokemon e o botão more-details; 

const Container = styled.div`
    display:flex;
    flex-direction:column;
    min-height: 100vh;
    font-family: 'Pixelify Sans',sans-serif;
    background-color: ${props => props.theme.background || 'lightgreen'};
    background-size:cover;
`
const Header = styled.header`
    display:flex;
    justify-content:center;
    max-width:100vw;

    .pokemon-logo {
        width:240px;
    }

`
const Div = styled.div`


    display:grid;
    grid-template-columns: repeat(2,45%);
    justify-content:center;
    align-items:center;
    //gap:10px;
    flex-grow:1;

    @media (max-width:575px){
        grid-template-columns: 1fr;
    }

`
const ExibitionCard = styled.div`
     // Exibição da card
    opacity: 0;
    z-index:2;
    position:relative;
    display:flex;
    flex-direction:column;
    justify-content:center;
    align-items:center;
    
    .pokedex {
        position:absolute;
        width:550px;
        height:auto;
        z-index:1;
    }

    .img-zoom {    
        width:auto;
        height:auto;
    }

    p   {
            text-transform:capitalize;
            font-size:18px;
            margin:0;
            
    }

    .img-zoom,.pokemon-name {
        z-index:2;
        transform:translate(-20px,161px);
    }

    .pokemon-name {
        background-color:white;
        border: 2px solid black;
    }

    &.active {
        opacity: 1;
    }

    @media (max-width:575px){
        //card - 425px;
        &.active{
            opacity:0;
        };
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
            }
        a {
            text-decoration:none;
            color:inherit;
            transform: translate(00px,0px);
            z-index:3;
        }

        
    }

    
`
const BoardCards = styled.div`
    display:flex;
    flex-direction:column;
    justify-content:center;
    z-index: 3;

    ul {
        list-style-type:none;
        display:grid;
        grid-template-columns:repeat(5,1fr);
        justify-content:center;
        margin: 0;
        padding: 15px;
        border:1px solid black;
        flex-wrap:wrap;
        height: 400px;
        overflow-y:scroll;
        scrollbar-width: thin; /* Define a largura da barra de rolagem como fina */
        scrollbar-color: #888 #ffffff; /* Define as cores do thumb e do trilho */
        gap:10px;
    }
    
    .item {
        //position:relative;
        display:flex;
        flex-direction:column;
        max-width: 120px;
        height:160px;
        max-height: 160px;
        background-color: white; // Cor do cartão
        font-size: 18px;
        border: 1px solid black;
        text-align:center;
        //margin: 10px;
        padding:3px;
        border-radius: 4px;
        text-transform: capitalize;

    }
    
    .item img{
        background-color:lightblue; // Fundo da imagem de cada card
        padding: 1px;
        width: auto;
        height: auto;
    }

    .item li p {
        background-color:lightblue;
    }
    
    @media (max-width:1280px){
        ul {
            grid-template-columns:repeat(4,1fr);
        }
        
    }

     @media (max-width:1000px){
        ul {
            grid-template-columns:repeat(3,1fr);
        }
    
    }
    
    @media (max-width:768px){
        ul {
            grid-template-columns:repeat(2,1fr);
        }
    }

    @media (max-width:575px){
        //card - 425px;
        ul {
            grid-template-columns: 1fr;
            margin: 0 auto;
        }
    }



`
const Tooltip = styled.div`
    width:130px;
    position:fixed;
    background-color: white;
    border: 5px solid black;
    color:black;
    padding:5px;
    border-radius:5px;
    white-space:no-wrap;
    pointer-events:none;
    transform: translate(20%,-100%);
    // transition: opacity 1s ease, transform 1s ease;
    // opacity: 0;

    // &.active {
    //     opacity: 1;
    //     transform: translate(-50%, -110%);
    // }

    &::after {
        content: '';
        color:black;
        position: absolute;
        left:16px;
        bottom: 5px; /* Ajuste para colocar a seta na parte inferior */
        transform: translate(-100%);
        rotate: 0deg;
        border-width: 10px;
        border-style: dotted;
        border-color: transparent transparent transparent black; /* Define a cor da seta */
        //Adicionando uma animação para a seta
        animation: moveUpDown 1.5s ease-in-out infinite
    }

    
    
    @keyframes moveUpDown {
        0%, 100% {
            transform: translateX(-50%) translateY(0); /* Posição inicial e final */
        }
        50% {
            transform: translateX(-50%) translateX(-5px); /* Movimento para cima */
        }
    }
`
