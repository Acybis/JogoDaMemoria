const gameBoard = document.getElementById('game-board');
const movesDisplay = document.getElementById('moves');
const restartBtn = document.getElementById('restart-btn');
const winModal = document.getElementById('win-modal');
const finalMovesDisplay = document.getElementById('final-moves');
const playAgainBtn = document.getElementById('play-again-btn');
const rulesModal = document.getElementById('rules-modal');
const startGameBtn = document.getElementById('start-game-btn');

// Fechar regras e começar o jogo
startGameBtn.addEventListener('click', () => {
    rulesModal.classList.add('hidden');
});

// Pares de Pergunta (Azul) e Resposta (Amarela)
// Focados no conteúdo de NPV
const fonoData = [
    { id: 1, text: "Você sabe o que é o NPV?", type: "question" },
    { id: 1, text: "A sigla NPV significa Núcleo de Prevenção à Violência. Os NPVs são dispositivos que a Secretaria Municipal da Saúde dispõe voltados à proteção e ao acolhimento dos usuários e trabalhadores do território, que vivenciem alguma situação de vulnerabilidade.", type: "answer" },
    
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

    // Separar perguntas e respostas, e embaralhar cada grupo independentemente
    const questions = fonoData.filter(card => card.type === 'question').sort(() => Math.random() - 0.5);
    const answers = fonoData.filter(card => card.type === 'answer').sort(() => Math.random() - 0.5);

    // Intercalar para que as Perguntas fiquem na coluna 1 e as Respostas na coluna 2
    cards = [];
    for (let i = 0; i < questions.length; i++) {
        cards.push(questions[i]);
        cards.push(answers[i]);
    }

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
    // Permite expandir e encolher caso já esteja combinada
    if (this.classList.contains('matched')) {
        if (!this.classList.contains('expanded')) {
            centerCard(this);
        }
        this.classList.toggle('expanded');
        return;
    }

    if (lockBoard) {
        // Permite clicar na própria tela gigante para fechar mais rápido se quiser
        if (this.classList.contains('expanded')) {
            this.classList.remove('expanded');
        } else if (this === firstCard || this === secondCard) {
            centerCard(this);
            this.classList.add('expanded');
        }
        return;
    }

    // Clicar na mesma carta vira/expande novamente
    if (this === firstCard) {
        if (!this.classList.contains('expanded')) {
            centerCard(this);
        }
        this.classList.toggle('expanded');
        return;
    }

    centerCard(this);
    this.classList.add('flipped', 'expanded'); // Aumenta de tamanho imediatamente para leitura

    if (!hasFlippedCard) {
        // Primeiro clique
        hasFlippedCard = true;
        firstCard = this;
        return;
    }

    // Segundo clique
    firstCard.classList.remove('expanded'); // Recolhe a primeira carta para dar espaço à segunda
    secondCard = this;
    moves++;
    movesDisplay.innerText = moves;
    checkForMatch();
}

function centerCard(card) {
    const rect = card.getBoundingClientRect();
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const cardCenterX = rect.left + rect.width / 2;
    const cardCenterY = rect.top + rect.height / 2;
    
    const translateX = centerX - cardCenterX;
    const translateY = centerY - cardCenterY;
    
    card.style.setProperty('--tx', `${translateX}px`);
    card.style.setProperty('--ty', `${translateY}px`);
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
    lockBoard = true;

    // Fica 2s com a segunda carta gigante na tela para o jogador ler. Depois recolhe e bate o sucesso verde!
    setTimeout(() => {
        firstCard.classList.remove('expanded');
        secondCard.classList.remove('expanded');
        
        // Adiciona a classe que inicia a animação de "Correto" pulando verde
        firstCard.classList.add('matched');
        secondCard.classList.add('matched');

        matchesCounter++;
        resetBoard();
        
        // Checa se Venceu
        if (matchesCounter === fonoData.length / 2) {
            setTimeout(showWinScreen, 1500);
        }
    }, 2200); 
}

function unflipCards() {
    lockBoard = true;

    // Fica 2s gigante lendo; se errou, ela recolhe e ambas desviram
    setTimeout(() => {
        firstCard.classList.remove('flipped', 'expanded');
        secondCard.classList.remove('flipped', 'expanded');
        resetBoard();
    }, 2200);
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