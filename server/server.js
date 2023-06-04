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

let playerHand = [];
let dealerHand = [];
let isBusted = false;
let playerScore = 0;
let dealerScore = 0;
let gameDeck = createDeck();

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
      if (playerScore <= 21) {
        return true;
      }
    }
    return false;
  }
}

function didWin() {
  return playerScore > dealerScore && playerScore <= 21;
}

app.get("/api/deck/new", (req, res) => {
  res.json(gameDeck);
});

app.get("/api/shuffle", (req, res) => {
  shuffleDeck(gameDeck);
  res.json(gameDeck);
});

app.get("/api/deck/deal", (req, res) => {
  const hand = dealDeck(gameDeck);
  hand === null
    ? res.status(500).send({ errorMessage: "Error Occured " })
    : res.json(hand);
});

app.get("/api/stay", (req, res) => {
  let winString = { win: false };
  if (didWin()) {
    winString.win = true;
    console.log("yo");
    res.json(winString);
  } else {
    console.log("yoy");
    res.json(winString);
  }
});

app.get("/api/deck/hit", (req, res) => {
  let hand = [];
  let aceCount = 0;
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

  if ((playerScore > 21 && !handleAces(aceCount)) || isBusted) {
    const bust = { bust: true };
    res.json(bust);
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
