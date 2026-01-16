const express = require("express");
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const db = require('./queries')

/* Set up constants */
const suits = ["clubs", "diamonds", "hearts", "spades"];
const values = [
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "jack",
  "queen",
  "king",
  "ace",
];
const maxBet = 20000;

// Game sessions storage (in production, use Redis or database)
const gameSessions = new Map();

function createDeck() {
  const deck = [];
  for (let suit of suits) {
    for (let value of values) {
      const card = {
        suit: suit,
        value: value,
        img: `/png/cards/${value}_of_${suit}.png`,
        name: `${value} of ${suit}`,
      };
      deck.push(card);
    }
  }
  shuffleDeck(deck);
  return deck;
}

function dealDeck(deck) {
  playerHand = [];
  dealerHand = [];
  isBusted = false;

  gameDeck = createDeck();

  playerHand.push(deck.pop());
  playerHand.push(deck.pop());
  dealerHand.push(deck.pop());
  dealerHand.push(deck.pop());

  setDealerScore();

  return { playerHand: playerHand, dealerHand: dealerHand };
}

function drawCard(deck) {
  playerHand.push(deck.pop());
  return playerHand;
}

function shuffleDeck(deck) {
  // Durstenfeld shuffle algorithm
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
}

function handleAces(aceCount) {
  if (aceCount > 1) {
    for (let i = aceCount; i > 0; i--) {
      playerScore -= 11;
    }
  }
}

function setDealerScore() {
  dealerScore = getScore(dealerHand);
}

function getScore(hand) {
  let score = 0;
  hand.forEach((card) => {
    const value = card.value;

    if (value === "jack" || value === "queen" || value === "king") {
      score += 10;
    } else if (value === "ace") {
      // If adding 11 would take the total above 21, add 1 instead
      score += 11;
    } else {
      score += parseInt(value);
    }
  });
  return score;
}

function didWin() {
  return (playerScore > dealerScore && playerScore <= 21) || dealerScore > 21;
}

app.get("/api/deck/new", (req, res) => {
  let response = {
    casino: casino,
    chips: playerChips,
    earnings: earnings,
    gameDeck: gameDeck,
    maxBet: maxBet,
  };
  res.json(response);
});

app.post("/api/deck/deal", (req, res) => {
  currentBet = req.body.currentBet;
  const hand = dealDeck(gameDeck);
  hand === null
    ? res.status(500).send({ errorMessage: "Error Occured " })
    : res.json(hand);
});

app.get("/api/stay", (req, res) => {
  while (dealerScore < 16) {
    dealerHand.push(gameDeck.pop());
    setDealerScore();
  }

  let response = {
    alertMessage: "",
    chips: playerChips,
    dealerHand: dealerHand,
    playerHand: playerHand,
    win: false,
  };

  if (didWin()) {
    response.win = true;
    response.alertMessage = "You win!";
    playerChips += currentBet;
    response.chips = playerChips;
    res.json(response);
  } else {
    response.alertMessage = "You lose!";
    playerChips -= currentBet;
    response.chips = playerChips;
    res.json(response);
  }
});

app.get("/api/deck/hit", (req, res) => {
  let hand = [];
  let aceCount = 0;
  let returnStr = {
    bust: isBusted,
    playerHand: playerHand,
    dealerHand: dealerHand,
  };

  if (!isBusted) {
    hand = drawCard(gameDeck);
    playerScore = 0;
    hand.forEach((card) => {
      const value = card.value;

      if (value === "jack" || value === "queen" || value === "king") {
        playerScore += 10;
      } else if (value === "ace") {
        // If adding 11 would take the total above 21, add 1 instead
        playerScore += 11;
        aceCount += 1;
      } else {
        playerScore += parseInt(value);
      }
    });
  }
  console.log(playerScore);
  handleAces(aceCount);
  console.log("after ace = " + playerScore);
  if (playerScore > 21 || isBusted) {
    console.log("bust");
    playerScore = 0;
    dealerScore = 0;
    returnStr.bust = true;
    res.json(returnStr);
  } else {
    res.json(returnStr);
    isBusted = false;
  }
});

app.get('/', (req, res) => {
  res.json({ message: 'Server is running!', status: 'OK' });
});

// Game API Endpoints
app.post('/api/game/start', (req, res) => {
  try {
    const sessionId = Math.random().toString(36).substring(7);
    const gameDeck = createDeck();

    // Deal initial hands
    const playerHand = [gameDeck.pop(), gameDeck.pop()];
    const dealerHand = [gameDeck.pop(), gameDeck.pop()];

    const gameState = {
      sessionId,
      deck: gameDeck,
      playerHand,
      dealerHand,
      playerScore: calculateScore(playerHand),
      dealerScore: calculateScore([dealerHand[0]]), // Only count dealer's visible card
      gamePhase: 'playing',
      isBusted: false,
      dealerRevealed: false
    };

    gameSessions.set(sessionId, gameState);

    res.json({
      sessionId,
      playerHand,
      dealerHand: [dealerHand[0], { name: 'hidden' }], // Hide dealer's second card
      playerScore: gameState.playerScore
    });
  } catch (error) {
    console.error('Error starting game:', error);
    res.status(500).json({ error: 'Failed to start game' });
  }
});

app.post('/api/game/hit', (req, res) => {
  try {
    const { sessionId } = req.body;
    const gameState = gameSessions.get(sessionId);

    if (!gameState || gameState.gamePhase !== 'playing') {
      return res.status(400).json({ error: 'Invalid game session' });
    }

    // Draw a card
    const newCard = gameState.deck.pop();
    gameState.playerHand.push(newCard);
    gameState.playerScore = calculateScore(gameState.playerHand);

    // Check for bust
    if (gameState.playerScore > 21) {
      gameState.isBusted = true;
      gameState.gamePhase = 'busted';
    }

    gameSessions.set(sessionId, gameState);

    res.json({
      playerHand: gameState.playerHand,
      playerScore: gameState.playerScore,
      isBusted: gameState.isBusted,
      gamePhase: gameState.gamePhase
    });
  } catch (error) {
    console.error('Error hitting:', error);
    res.status(500).json({ error: 'Failed to hit' });
  }
});

app.post('/api/game/stand', (req, res) => {
  try {
    const { sessionId } = req.body;
    const gameState = gameSessions.get(sessionId);

    if (!gameState || gameState.gamePhase !== 'playing') {
      return res.status(400).json({ error: 'Invalid game session' });
    }

    // Dealer plays (hits on soft 17, stands on hard 17+)
    gameState.dealerRevealed = true;
    gameState.dealerScore = calculateScore(gameState.dealerHand);

    while (gameState.dealerScore < 17 || (gameState.dealerScore === 17 && hasAce(gameState.dealerHand))) {
      const newCard = gameState.deck.pop();
      gameState.dealerHand.push(newCard);
      gameState.dealerScore = calculateScore(gameState.dealerHand);
    }

    // Determine winner
    let result = 'lose';
    if (gameState.dealerScore > 21) {
      result = 'win'; // Dealer busts
    } else if (gameState.playerScore > gameState.dealerScore) {
      result = 'win'; // Player has higher score
    } else if (gameState.playerScore === gameState.dealerScore) {
      result = 'push'; // Tie
    }

    gameState.gamePhase = 'finished';
    gameState.result = result;
    gameSessions.set(sessionId, gameState);

    // Calculate final score (simplified: 100 points for win, 0 for loss/push)
    const finalScore = result === 'win' ? 100 : 0;

    res.json({
      dealerHand: gameState.dealerHand,
      dealerScore: gameState.dealerScore,
      playerScore: gameState.playerScore,
      result,
      finalScore,
      gamePhase: gameState.gamePhase
    });
  } catch (error) {
    console.error('Error standing:', error);
    res.status(500).json({ error: 'Failed to stand' });
  }
});

// Helper functions
function calculateScore(hand) {
  let score = 0;
  let aces = 0;

  for (const card of hand) {
    if (card.value === 'ace') {
      aces += 1;
      score += 11;
    } else if (['jack', 'queen', 'king'].includes(card.value)) {
      score += 10;
    } else {
      score += parseInt(card.value);
    }
  }

  // Handle aces (convert to 1 if score > 21)
  while (score > 21 && aces > 0) {
    score -= 10;
    aces -= 1;
  }

  return score;
}

function hasAce(hand) {
  return hand.some(card => card.value === 'ace');
}

// High Score API Endpoints
app.post('/api/scores/submit', async (req, res) => {
  try {
    const { username, score } = req.body;
    if (!username || typeof score !== 'number') {
      return res.status(400).json({ error: 'Invalid username or score' });
    }

    const result = await db.submitScore(username, score);
    res.json(result);
  } catch (error) {
    console.error('Error submitting score:', error);
    res.status(500).json({ error: 'Failed to submit score' });
  }
});

app.get('/api/leaderboard', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const leaderboard = await db.getLeaderboard(limit);
    res.json(leaderboard);
  } catch (error) {
    console.error('Error getting leaderboard:', error);
    res.status(500).json({ error: 'Failed to get leaderboard' });
  }
});

app.get('/api/scores/:username', async (req, res) => {
  try {
    const { username } = req.params;
    const userScore = await db.getUserScore(username);
    res.json(userScore);
  } catch (error) {
    console.error('Error getting user score:', error);
    res.status(500).json({ error: 'Failed to get user score' });
  }
});

// Legacy endpoint for compatibility
app.get('/users', async (req, res) => {
  try {
    const users = await db.getAllUsers();
    res.json(users);
  } catch (error) {
    console.error('Error getting users:', error);
    res.status(500).json({ error: 'Failed to get users' });
  }
});

app.listen(5000, () => {
  console.log("Server started on port 5000");
});
