# Quest React Avançado - Pokedex

O seguinte projeto utiliza de uma API RESTful (https://pokeapi.co/) para listar uma lista de cartas e as características individuais de cada carta.

# Funcionalidades

1. cardList.js  
a) getCards() - faz uma requisição GET para a API e retorna um array que armazena as cartas simples.    
b) loadMoreCards()  - faz uma requisição GET para a API , utilizando uma variável para alterar o off-set da requisição e captar as cartas posteriores. ( Não utilizar o off-set resulta em uma requisição GET que retorna as mesmas cartas da lista de cartas da API.)    
c) handleRenderCardClick() - abre uma seção da página inicial, que renderiza uma pré-visualização da imagem do pokémon, junto a uma pokedéx.

2. cardDescription.js  
   a) getAbilities() - 

# Ferramentas utilizadas

useState - React 
useContext- React
styled-components - React - Para modularizar cada peça de código css com seu respectivo componente.

# Decisões adotadas

Centralizações - Foi um assunto muito revisado (talvez o mais revisado), pois cada técnica de centralização ajuda ou atrapalha o contexto das responsividades. Ao final, o contexto que o componente foi inserido ditou qual técnica seria utilizada para que, posteriormente, quando fosse feita a responsividade, não precisasse muito código para implementar as medias-queries.

Media-queries - Posicionamento e tamanho das div's que possuiam mídia (fotos) foram o foco. 

Compartilhamento de recursos - 
    - No decorrer do desenvolvimento do projeto, houve a necessidade  do compartilhamento de estados entre os componentes. Utilizei do API Context para fazer um arquivo que armazenaria o estado de uma carta selecionada ( que é escolhida para ser exibida na pokedex ). Concluí que para essa aplicação, não seria imprescindível o compartilhamento de todas as cartas, somente a que foi escolhida para ser detalhada, assim , o contexto CardContext.js recebe o estado que vai ser compartilhado a partir da função handleRenderCardClick(). De acordo com a carta escolhida na página inicial, seu estado é compartilhado com a página de detalhes. Estruturei um objeto dentro da função handleRenderCardClick() com uma atributo a mais (activeStatus), para ser utilizado em outro momento, para estilização junto com o mouse. 

Filtragem dos tipos - Para contornar os problemas de duplicação de cartas (que acontece pelo fato de um pokémon pode ter mais de um 'type'), foi utilizado um filtro de ocorrências, limitando a ocorrência da carta dentro do array que exibe as cartas filtradas, para evitar problemas de chaves primárias duplicadas.


Modularização - Dividi a página por seções, que utilizaram o styled-components para utilizar as div's (separadas por classe) que faziam parte de cada seção e seção em si. Simplificou a manutenção, principalmente na hora de fazer a responsividade das @media-queries menores (768px,575px). Não consegui fazer o contexto para compartilhar o estado [tooltipPosition]. Ao passar o objeto estruturado para o contexto que não contém uma estrutura prévia, o 'tooltip.activeStatus' presente dentro das tag's <li> de listagem das cartas não consegue ser interpretado. 

Página inicial '/' 
    - Ao abrir a página, já é carregado as 10 primeiras cartas. Para que se tenha acesso aos atributos individuais de cada carta, é necessário que sejam feito 2 fetchs. O primeiro vai ser responsável por trazer uma carta com 2 atributos simples (name, description_url) e foi salvo em um atributo (loaded_pokemons) que faz parte do estado [cards]. O segundo é responsável por abrir cada objeto de [cards.loaded_pokemons] , para conseguir ter acesso aos demais atributos a partir do description_url. Portanto, para mantêr a organização e não ter uma complexidade grande na substituição das cartas simples (name, description_url) por cartas complexas ( que possuem todos os atributos detalhados ), criei um novo array (pokemon_details), que possui todas as cartas com detalhes complexos (type, moves, abilities, sprites...). Dessa forma, a partir da listagem do array [pokemon_details] é realizada a exibição das imagens frontais de cada carta (o que não seria possível com as cartas simples).

    - A incrementação automática do array [pokemons_details] é realizada utilizando o array de dependências com o atributo loaded_pokemons, que atualiza o estado a cada click no botão loadMoreCards(), responsável por incrementar as cartas listadas. 

    - Quando a carta é clicada, é aberto a direita da lista, uma pokedex que aumenta a imagem do pokémon e exibe o nome. Além disso, o ato de clicar irá acionar uma função (setSelectedCard) que estabelecerá a carta como a carta escolhida para ser detalhada. O estado selectedCard, é um contexto que é atualizado a partir desse click, que irá salvar o detalhamento da carta em questão e deixará pronto para ser utilizado em alguma outra página. Ao clicar no balão de diálogo da pokedex, o usuário é redirecionado para a página detalhada do pokémon escolhido utilizando o contexto que foi atualizado anteriormente.
    
Página detalhada '/card/{id}' 
    - Exibe os atributos do objetos (fotos, movimentos, habilidades) na forma de lista.  

Design - A listagem foi o foco do design. O cursor do mouse interage com a listagem das cartas na página principal, que exibe o nome das cartas, e nas listas de detalhamento de movimento e habilidades . Quanto as listas de detalhamentos, o mouse interage com a lista de movimentos de forma simples, alterando a cor da <li> e as <li>'s da lista de habilidade se abrem quando o cursor está na sua área. 



# Como utilizar - Passo a passo
