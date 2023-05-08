import { useEffect, useState } from "react";
import Deck from "./components/Deck";
import Button from "@mui/material/Button";
import Alert from "./components/Alert";

function App() {
  const [gameDeck, setGameDeck] = useState([{}]);
  const [playerHand, setPlayerHand] = useState([{}]);
  const [busted, setBusted] = useState([{}]);

  function handleBust() {
    console.log("Ya busted");
    setBusted(true);
  }

  function handleShuffle() {
    fetch("/api/shuffle")
      .then((response) => response.json())
      .then((data) => {
        setGameDeck(data);
      });
  }

  useEffect(() => {
    fetch("/api/deck/new")
      .then((response) => response.json())
      .then((data) => {
        setGameDeck(data);
      });
  }, []);

  function dealDeck() {
    fetch("/api/deck/deal")
      .then((response) => response.json())
      .then((data) => {
        setPlayerHand(data);
      });
    setBusted(false);
  }

  function hit() {
    fetch("/api/deck/hit")
      .then((response) => {
        if (!response.ok) throw new Error(response.status);
        else return response.json();
      })
      .then((data) => {
        console.log(data);
        setPlayerHand(data);
      })
      .catch((error) => {
        handleBust();
      });
  }

  return (
    <div className="h-screen w-screen flex flex-col bg-game-table bg-center bg-cover">
      <h1 className="font-extrabold text-slate-200 px-10 py-5 bg-zinc-900">
        FNV BLACKJACK
      </h1>
      <div className="h-1/3">
        {busted ? <Alert message={"You bust!"}></Alert> : <h1></h1>}
      </div>{" "}
      {/* Top row */}
      <div className="h-3/4">
        <Button variant="contained" onClick={dealDeck}>
          Deal
        </Button>
        <Button variant="contained" onClick={hit}>
          Hit
        </Button>
        <Button variant="contained" onClick={handleShuffle}>
          Shuffle
        </Button>
      </div>{" "}
      {/* Middle row */}
      <div className="w-screen h-1/3 flex items-center justify-center">
        <Deck deck={playerHand} />
      </div>
    </div>
  );
}

export default App;
