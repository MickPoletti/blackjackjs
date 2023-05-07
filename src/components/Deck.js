import React, { useState, useEffect } from "react";
import Card from "./Card";

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

export default function Deck({ shuffleCount }) {
  const [deck, setDeck] = useState([]);

  useEffect(() => {
    const newDeck = [];
    for (let i = 0; i < suits.length; i++) {
      for (let j = 0; j < values.length; j++) {
        const card = {
          suit: suits[i],
          value: values[j],
          img: `/png/cards/${values[j]}_of_${suits[i]}.png`,
          name: `${values[j]} of ${suits[i]}`,
        };
        newDeck.push(card);
      }
    }
    setDeck(newDeck);
  }, []);

  useEffect(() => {
    shuffle();
  }, [shuffleCount]);

  function shuffle() {
    // Durstenfeld shuffle algorithm
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    setDeck([...deck]);
  }

  return (
    <div className="flex flex-wrap bg-slate-800 rounded-lg border-amber-500 border-2 gap-3 p-3">
      {deck.map((item, index) => (
        <Card key={index} item={item} value={item.value} name={item.name} />
      ))}
    </div>
  );
}
