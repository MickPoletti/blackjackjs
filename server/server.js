const express = require("express");
const app = express();

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

let playerHand = [];

let deck = createDeck();
let isBusted = false;
let playerScore = 0;

function dealDeck(deck) {
  playerHand = [];
  deck = createDeck();
  isBusted = false;
  playerHand.push(deck.shift());
  playerHand.push(deck.shift());

  return playerHand;
}

function drawCard(deck) {
  playerHand.push(deck.shift());
  return playerHand;
}

function shuffleDeck(deck) {
  // Durstenfeld shuffle algorithm
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
}

app.get("/api/deck/new", (req, res) => {
  res.json(deck);
});

app.get("/api/shuffle", (req, res) => {
  shuffleDeck(deck);
  res.json(deck);
});

app.get("/api/deck/deal", (req, res) => {
  const hand = dealDeck(deck);
  hand === null
    ? res.status(500).send({ errorMessage: "Error Occured " })
    : res.json(hand);
});

app.get("/api/deck/hit", (req, res) => {
  let hand = [];
  let aceCount = 0;
  if (!isBusted) {
    hand = drawCard(deck);
    console.log(hand);
    playerScore = 0;
    hand.forEach((card) => {
      const value = card.value;

      if (value === "jack" || value === "queen" || value === "king") {
        playerScore += 10;
      } else if (value === "ace") {
        // If adding 11 would take the total above 21, add 1 instead
        aceCount++;
        playerScore += playerScore + 11 > 21 ? 1 : 11;
      } else {
        playerScore += parseInt(value);
      }
    });
  }

  for (let i = aceCount; i > 0; i--) {
    playerScore -= 10;
    aceCount--;
  }

  if (playerScore > 21 || isBusted) {
    console.log("Bust");
    res.status(400).json({ error: " Bust" });
    playerScore = 0;
    isBusted = true;
  } else {
    console.log(playerScore);
    res.json(hand);
    isBusted = false;
  }
});

app.listen(5000, () => {
  console.log("Server started on port 5000");
});
