import { useContext, useEffect, useState } from "react"
import styled, { keyframes } from "styled-components"
import { CardContext } from "../../../context/CardContext"
import { Link } from "react-router-dom"
import { ThemeButton } from "../../buttonChangeTheme/btnChangeTheme"
import { ThemeContext } from "../../../context/ToggleBtnContext"
import { type } from "@testing-library/user-event/dist/type"
import { PokedexScreen } from "./pokedex"

export const CardList = () => {

    const [cards, setCards] = useState({
        // Atributos do objeto 
        loaded_pokemons: [],
        pokemon_details: [],
        pokemon_types: [],

        // Contador para atualizar offset do loadMoreCards
        contador_cards: 0
        //Listando 10 pokemons: https://pokeapi.co/api/v2/pokemon?limit=10&offset=0 - A cada atualização da lista, incrementar o offset em 10 significa que, a partir do primeiro, cada vez que a página for atualizada, será pulado 10 pokemon's. Isso faz com que o GET não retorne pokemon's repetidos.
    })

    // Utilizando o contexto das cartas individuais
    const { selectedCard, setSelectedCard } = useContext(CardContext);

    const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0, activeStatus: false, card_id: null, card_name: null });

    const [isOpen, setIsOpen] = useState({
        isOpen: false
    })

    const [activeFilters, setActiveFilters] = useState({
        filtered_cards: [],
        filters: [],
        buttonState: []
    })

    useEffect(() => {
        async function fetchData() {
            const data = await getCards()
            setCards(cards => ({
                ...cards,
                loaded_pokemons: [...data],
                pokemon_details: [],
                contador_cards: 10
            }))

        }

        fetchData();
    }, [])

    // Usando a description_url para acessar o objeto card que fica dentro do retorno da função getCards()

    useEffect(() => {
        async function getObjectCard() {
            const objectData = await Promise.all(cards.loaded_pokemons.map(async (card) => {
                const response = await fetch(card.description_url);
                const data = await response.json();
                return await data;
            }))

            const filterTypes = objectData.flatMap(card => card.types.map(type => type.type.name))

            //Removendo duplicatas do array
            const uniqueTypes = [...new Set(filterTypes)]

            setCards(cards => ({
                ...cards,
                pokemon_details: [...objectData],
                pokemon_types: [...uniqueTypes]
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
        return setCards(cards => ({
            ...cards,
            contador_cards: cards.contador_cards + 10,
            loaded_pokemons: [...cards.loaded_pokemons, ...array_pokemons]
        }))

    }
    const handleTypes = (typeSelected) => {
        const filterState = async () => {
            const response = await cards.pokemon_details.flatMap(card => card.types.map(type => {
                if (type.type.name === typeSelected) {
                    return card
                }
                return null;
            }).filter(card => card !== null)
            );

            if (activeFilters.filters.some(filter => filter === typeSelected)) {
                console.log('achei o filtro dentro da activeFilters');
                //Removendo as ocorrências de dentro do array filtered_cards e filters
                //1 - Verificar quais objetos dentro de filtered_cards tem a ocorrencia do tipo; 2 - remover o tipo de dentro de 'filters'
                
                // const cardsToRemove = activeFilters.filtered_cards.filter(card => card.types.some(type => type.type.name  === typeSelected));
                // console.log('Cartas para remover: ', cardsToRemove);


                setActiveFilters(filters => ({
                    ...filters,
                    filtered_cards:filters.filtered_cards.filter(card => !card.types.some(type => type.type.name === typeSelected)),
                    filters:filters.filters.filter(filter => filter !== typeSelected)
                }))
                
            } else {
                // Salvar o estado do botão para ser possível "deselecionar" o filtro.
                const isTypePressed = activeFilters.filters.includes(typeSelected);
                console.log(isTypePressed)

                setActiveFilters(filters => ({
                    ...filters,
                    //Removendo duplicatas do array
                    filtered_cards: isTypePressed ? [...filters.filtered_cards] : [...new Set([...filters.filtered_cards, ...response])],
                    filters: isTypePressed ? [...filters.filters] : [...new Set([...filters.filters, typeSelected])]
                }))
            }
        }
        filterState();
    }
    const handleRenderCardClick = (card) => {    
        const selectedCard = {
            ...card,
            activeStatus: true,
            sprite: card.sprites.front_default
        }
        setSelectedCard(selectedCard)
    }
    const handleOnMouseMove = (e, card_id, card_name) => {
        const { clientX, clientY } = e;
        setTooltipPosition({
            top: clientY,
            left: clientX,
            activeStatus: true,
            card_id: card_id,
            card_name: card_name
        })
    }   
    const handleOnMouseLeave = () => {
        setTooltipPosition(({ activeStatus: false }));
    }
    function toggleClass(status) {
        console.log(status)
        if (status === true) {
            return setIsOpen({
                isOpen: false,
            })
        } else {
            return setIsOpen({
                isOpen: true
            })
        }
    }

    return (
        <Container className={`container ${selectedCard.activeStatus ? 'active' : ''}`}>
            <Header className={`${selectedCard.activeStatus ? 'active' : ''}`}>
                <img className="pokemon-logo" src="/images/pokemon-logo.png" alt="Logo" />
                <ThemeButton />
            </Header>
            <Div className={selectedCard.activeStatus ? 'active' : ''}>
                <BoardCards className="board-cards">
                    <ul className={`listed-cards ${selectedCard.activeStatus ? 'active' : ''}`}>
                        <button className={`load-more-cards ${selectedCard.activeStatus ? 'active' : ''}`} onClick={() => {
                            loadMoreCards();
                            console.log(cards.pokemon_details)
                            //console.log("Contador para mudar o offset da requisição GET" + cards.contador_cards)
                            //console.log(cards.pokemon_details)  
                        }}>Clique para carregar mais 10 Pokemon's</button>
                        {activeFilters?.filtered_cards?.length > 0 ? (activeFilters.filtered_cards.map((card) => {
                            return <li className="item" key={card.id} onMouseMove={(e) => handleOnMouseMove(e, card.id, card.name)} onMouseLeave={handleOnMouseLeave} onClick={() => handleRenderCardClick(card)}>
                                <img src={card.sprites.front_default} alt={card.name} />
                                <p className="pokemon-id">#{card.id}</p>
                                {tooltipPosition.activeStatus && (
                                    <Tooltip className={`${tooltipPosition.activeStatus ? 'active' : ''}`} style={{ top: tooltipPosition.top, left: tooltipPosition.left }}>
                                        {tooltipPosition.card_name}
                                    </Tooltip>
                                )}
                            </li>
                        })) : (cards.pokemon_details.map((card) => {
                            return <li className="item" key={card.id} onMouseMove={(e) => handleOnMouseMove(e, card.id, card.name)} onMouseLeave={handleOnMouseLeave} onClick={() => handleRenderCardClick(card)}>
                                <img src={card.sprites.front_default} alt={card.name} />
                                <p className="pokemon-id">#{card.id}</p>
                                {tooltipPosition.activeStatus && (
                                    <Tooltip className={`${tooltipPosition.activeStatus ? 'active' : ''}`} style={{ top: tooltipPosition.top, left: tooltipPosition.left }}>
                                        {tooltipPosition.card_name}
                                    </Tooltip>
                                )}
                            </li>
                        }))}
                    </ul>
                    <button className={`btn-open-filter ${selectedCard.activeStatus ? 'active' : ''}`} onClick={() => toggleClass(isOpen.isOpen)}>
                        Filter<br /> by Type
                        <ul className={`filter-cards ${isOpen.isOpen ? 'show-filter' : ''}`}
                            onClick={(e) => e.stopPropagation()}>
                            {cards?.pokemon_types?.length > 0 ? (
                                cards.pokemon_types.map((type, index) => (
                                    <li className={`type ${cards.pressed_btn_filter > 0 ? 'setStatusBotaoTrue' : ''}`} key={index} onClick={() => {
                                        handleTypes(type)
                                        console.log(activeFilters)
                                    }}>
                                        <a title="type">{type}</a>
                                    </li>
                                ))
                            ) : (
                                <li>Nenhum tipo disponível</li>
                            )}
                        </ul>
                    </button>
                    <div className={`modal-575 ${selectedCard.activeStatus ? 'active' : ''}`}>
                        <div className="x-shape" onClick={() => setSelectedCard({})}/>
                        <PokedexScreen/>
                    </div>
                </BoardCards>
                <ExibitionCard className={selectedCard.activeStatus ? 'active' : ''}>
                    <PokedexScreen/>
                </ExibitionCard>
            </Div>
        </Container>
    )
}

//Cada <li> de tipo vai passar por parametro o nome do tipo atraves do onClick e o sera feito o .map do array loaded_pokemons, procurando o pokemon do tipo e listando na tela. Ao não possuir nenhum filtro, deve exibir todas as cartas. 
//Styled-components

//Primeira página - Item Pokemon : estilizar :hover do pokemon exibindo o pokemon-id com uma transition, exibindo um balão de dialogo; ao clicar, aparecerá uma carta ao lado contendo o nome do pokemon e o botão more-details; 

const Container = styled.div`
    display:flex;
    flex-direction:column;
    width:100vw;
    min-height: 100vh;
    height:100%;
    font-family: 'Pixelify Sans',sans-serif;
    background-color: ${props => props.theme.background || 'lightgreen'};
    background-image: ${props => props.theme.backgroundImageMain};
    background-size:100% 100vh;

    
`
const Header = styled.header`
    display:flex;
    max-width:100vw;
    position:relative;

    .pokemon-logo {
        width:240px;
        margin: 0 auto;
    }

    .filter-cards {
        display:flex;
    }

    @media (max-width:830px){
        .pokemon-logo{
            width:180px;
        }
    }

    @media (max-width:575px){
        &.active {
            opacity:0;
        }
    }

`
const Div = styled.div`
    display:flex;
    justify-content:center;
    align-self:center;
    padding-top:20px;
    width:100%;
    height:100%;
    max-height:768px;
    position:relative;

`
const BoardCards = styled.div`
    display:grid;
    grid-template-areas: "open-filter" 
                        "listed-cards";
    z-index: 3;
    width:470px;
    align-items:center;
    position:relative;
    transform:translate(-200px,0);


    .listed-cards {
        position:relative;
        list-style-type:none;
        display:grid;
        grid-template-columns:repeat(5,1fr);
        grid-area: listed-cards;
        padding: 15px;
        border:1px solid black;
        background-color:${props => props.theme.background};
        width:470px;
        max-height: 340px;
        align-items:center;
        overflow-y:auto;
        scrollbar-width: thin; /* Define a largura da barra de rolagem como fina */
        scrollbar-color: #cfcfcf #ffffff; /* Define as cores do thumb e do trilho */
    }
    
    .item {
        display:flex;
        flex-direction:column;
        width:70px;
        max-height: 120px;
        background-color: white; // Cor do cartão
        font-size: 18px;
        border: 1px solid black;
        text-align:center;
        margin: 5px;
        padding:3px;
        border-radius: 4px;
    }

    .item:hover {
        //background-color:lightblue;
        border: 2px ridge white;
        box-shadow:0px 0px 3px white;
    }

    
    .item img{
        align-self:center;
        background-color:lightblue; // Fundo da imagem de cada card
        padding: 1px;
        width: 60px;
        height: auto;
    }

    .item li {
        background-color:lightblue;
        margin:0;
    }

    p.pokemon-id {
        margin:0;
    }

    .load-more-cards {
        display:flex;
        position:fixed;
        top:0;
        transform:translate(50%,0);
        justify-content:center;
        max-width:50%;
        width:100%;
        grid-area: button;
    }

    .btn-open-filter {
        width:70px;
        position:relative;
        background-color:${props => props.theme.background};
        border-color: ${props => props.theme.color};
        border-width:3px;
        border-radius:5px;
        padding:0px;
        transform: translate(20px, 0);
        color: ${props => props.theme.color};
    }

    .filter-cards {
        display:none;
        position:absolute;
        width:240px;
        grid-area: open-filter;
        background-color:white;
        list-style-type:none;
        padding:5px;
        margin:0 auto;
        left:100%;
        border-radius:5px;
    }

    .filter-cards.show-filter {
        display:flex;
        flex-wrap:wrap;
    }

    .filter-cards.show-filter li a {
        text-decoration:none;
        
    }

    .filter-cards.show-filter li::first-letter{
        text-transform: uppercase;
    }

    .filter-cards.show-filter li {
        margin:5px;
        padding:2px;
        border-radius:5px;
        background-color: lightgreen;
        text-align:center;
    }

    .modal-575 {
        opacity:0;
        display:none;
    }

    .modal-575.active {
        opacity:1;
        
    }
    

    @media (max-width:1024px){

        transform:translate(-100px,0);

        .listed-cards {
            grid-template-columns:repeat(4,1fr);
            width:400px;
        }
    
    }

    @media (max-width:830px){
        transform:translate(-20px,0);
        width:400px;
        .listed-cards {
            grid-template-columns:repeat(3,1fr);
            width:300px;
        }
    }

    @media (max-width:768px){
        .listed-cards {
            grid-template-columns:repeat(2,1fr);
            width:220px;
        }
    }

    @media (max-width:575px){
        display:flex;
        flex-direction:column;
        justify-content:center;
        transform:none;

        .listed-cards {
            width:240px;
            display:flex;
            flex-direction:column;
            margin: 0 auto;
            z-index:3;
            margin-top:80px;
        }

        .filter-cards.show-filter {
            bottom:100%;
            left:0;
            max-height:60px;
            overflow-y:auto;
            scrollbar-width: thin; /* Define a largura da barra de rolagem como fina */
            scrollbar-color: #cfcfcf #ffffff; /* Define as cores do thumb e do trilho */
        }

        .load-more-cards {
            transform:none;
            top:120px;
            width:120px;
        }

        .btn-open-filter {
            align-self:flex-start;
            position:absolute;
            top:0;
        }

        .modal-575.active {
            position:absolute;
            display:flex;
            flex-direction:column;
            width:100%;
            height:auto;
            text-align:center;
            top:0;
            padding:50px 0;
            background-color:rgba(0,0,0,0.75);
            border-radius:5px;

            .x-shape {
                position:absolute;
                width:50px;
                height:50px;
                cursor:pointer;
                z-index:3;
            }

            .x-shape::before, .x-shape::after {
                content:'';
                position:absolute;
                top:0;
                width:5px;
                height:100%;
                background-color:white;
            }

            .x-shape::before {
                transform: rotate(45deg); /* Rotaciona uma linha em 45 graus */
            }

            .x-shape::after {
              transform: rotate(-45deg); /* Rotaciona a outra linha em -45 graus */
            }
        }

        .listed-cards.active, .load-more-cards.active, .btn-open-filter.active {
            display:none;
        }

        
    }
`
const ExibitionCard = styled.div`
     // Exibição da card
    opacity: 0;
    z-index:2;
    position:relative;
    display:none;
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
        display:flex;
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
        &.active {
            display:none;
        }

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
    

    &.active {
        transform:translate(-100px,-200px)
    }

    &::after {
        content: '';
        color:black;
        position: fixed;
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

    &::first-letter {
        text-transform: uppercase;
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