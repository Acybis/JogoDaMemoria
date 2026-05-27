const gameBoard = document.getElementById('game-board');
const movesDisplay = document.getElementById('moves');
const restartBtn = document.getElementById('restart-btn');
const winModal = document.getElementById('win-modal');
const finalMovesDisplay = document.getElementById('final-moves');
const playAgainBtn = document.getElementById('play-again-btn');

// Pares de Pergunta (Azul) e Resposta (Amarela)
// Focados no conteúdo de NPV
const fonoData = [
    { id: 1, text: "Você sabe o que é o NPV?", type: "question" },
    { id: 1, text: "A sigla NPV significa Núcleo de Prevenção à Violência. Dispositivos voltados à proteção e ao acolhimento dos usuários e trabalhadores do território.", type: "answer" },
    
    { id: 2, text: "Qual o objetivo do NPV?", type: "question" },
    { id: 2, text: "Enfrentar situações de violência, principalmente por meio de ações preventivas, especialmente contra mulheres, crianças e pessoas idosas em situação de vulnerabilidade.", type: "answer" },
    
    { id: 3, text: "Quais profissionais de saúde podem participar dos NPVs?", type: "question" },
    { id: 3, text: "Enfermeiros, médicos, agentes comunitários de saúde (ACS), assistentes sociais, psicólogos, fonoaudiólogos, terapeutas ocupacionais e fisioterapeutas.", type: "answer" },
    
    { id: 4, text: "Onde posso encontrar um NPV para que eu possa participar?", type: "question" },
    { id: 4, text: "Os NPVs estão presentes em toda a Rede Municipal de Saúde de São Paulo, incluindo as 470 Unidades Básicas de Saúde (UBSs).", type: "answer" },
    
    { id: 5, text: "Como acontece a composição da equipe dos NPVs?", type: "question" },
    { id: 5, text: "Aproveita profissionais já presentes no território, estruturados em equipe multiprofissional, frequentemente articulados com a Estratégia Saúde da Família (SF) e o eMulti (NASF).", type: "answer" },
    
    { id: 6, text: "Quando as equipes do NPV podem ser acionadas?", type: "question" },
    { id: 6, text: "Diante de casos de violência, para organizar o atendimento de maneira integral, articulando os diversos aspectos do cuidado do paciente.", type: "answer" }
];

let cards = [];
let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;
let moves = 0;
let matchesCounter = 0;

function initGame() {
    gameBoard.innerHTML = '';
    moves = 0;
    matchesCounter = 0;
    movesDisplay.innerText = moves;
    winModal.classList.add('hidden');
    hasFlippedCard = false;
    lockBoard = false;
    firstCard = null;
    secondCard = null;

    // Embaralhar cartas
    cards = [...fonoData].sort(() => Math.random() - 0.5);

    // Criar elementos no DOM
    cards.forEach(cardData => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('card');
        cardElement.dataset.id = cardData.id;

        const cardFront = document.createElement('div');
        cardFront.classList.add('card-face', 'card-front');

        const cardBack = document.createElement('div');
        cardBack.classList.add('card-face', 'card-back');
        cardBack.classList.add(cardData.type); // Adiciona cor azul ou amarela
        cardBack.innerText = cardData.text;

        cardElement.appendChild(cardFront);
        cardElement.appendChild(cardBack);

        cardElement.addEventListener('click', flipCard);
        gameBoard.appendChild(cardElement);
    });
}

function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return;

    this.classList.add('flipped');

    if (!hasFlippedCard) {
        // Primeiro clique
        hasFlippedCard = true;
        firstCard = this;
        return;
    }

    // Segundo clique
    secondCard = this;
    moves++;
    movesDisplay.innerText = moves;
    checkForMatch();
}

function checkForMatch() {
    let isMatch = firstCard.dataset.id === secondCard.dataset.id;

    if (isMatch) {
        disableCards();
    } else {
        unflipCards();
    }
}

function disableCards() {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);
    
    firstCard.classList.add('matched');
    secondCard.classList.add('matched');

    matchesCounter++;
    resetBoard();
    
    // Checa se Venceu
    if (matchesCounter === fonoData.length / 2) {
        setTimeout(showWinScreen, 500);
    }
}

function unflipCards() {
    lockBoard = true;

    setTimeout(() => {
        firstCard.classList.remove('flipped');
        secondCard.classList.remove('flipped');
        resetBoard();
    }, 1200); // 1.2 segundos para memorizar
}

function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
}

function showWinScreen() {
    finalMovesDisplay.innerText = moves;
    winModal.classList.remove('hidden');
}

// Event Listeners
restartBtn.addEventListener('click', initGame);
playAgainBtn.addEventListener('click', initGame);

// Iniciar primeiro jogo
initGame();