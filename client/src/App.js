import { useEffect, useState } from "react";
import Deck from "./components/Deck";
import Button from "@mui/material/Button";
import Alert from "./components/Alert";

function App() {
  const [playerHand, setPlayerHand] = useState([{}]);
  const [dealerHand, setDealerHand] = useState([{}]);
  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [gameReset, setReset] = useState(false);
  const [revealCard, setRevealCard] = useState([{}]);

  function handleBust() {
    setAlertMessage("You bust!");
    setAlert(true);
    setReset(true);
  }

  useEffect(() => {
    fetch("/api/deck/new")
      .then((response) => response.json())
      .then((data) => {
        setAlert(false);
        setAlertMessage("");
      });
  }, []);

  function dealDeck() {
    fetch("/api/deck/deal")
      .then((response) => response.json())
      .then((data) => {
        setPlayerHand(data.playerHand);
        setDealerHand(data.dealerHand);
      });
    setRevealCard(false);
    setReset(false);
    setAlert(false);
  }

  function hit() {
    fetch("/api/deck/hit")
      .then((response) => {
        if (!response.ok) throw new Error(response.status);
        else return response.json();
      })
      .then((data) => {
        if (data.bust) {
          handleBust();
        }
        setPlayerHand(data.playerHand);
      });
  }

  function stay() {
    setRevealCard(true);
    fetch("/api/stay")
      .then((response) => response.json())
      .then((data) => {
        setDealerHand(data.dealerHand);
        setAlertMessage(data.alertMessage);
        setAlert(true);
      });
  }

  return (
    <div className="h-screen w-screen flex flex-col bg-game-table bg-center bg-cover">
      <h1 className="font-extrabold text-slate-200 px-10 py-5 bg-zinc-900">
        FNV BLACKJACK
      </h1>
      <div className="w-screen flex items-center justify-center">
        <Deck
          deck={dealerHand}
          isDealer={true}
          revealCard={revealCard}
          gameReset={gameReset}
        />
      </div>
      <div className="h-44">
        {alert ? <Alert message={alertMessage}></Alert> : <p></p>}
      </div>
      {/* Top row */}
      <div className="h-3/4">
        <Button variant="contained" onClick={dealDeck}>
          Deal
        </Button>
        <Button variant="contained" onClick={hit}>
          Hit
        </Button>
        {/* <Button variant="contained" onClick={handleShuffle}>
          Shuffle
        </Button> */}
        <Button variant="contained" onClick={stay}>
          Stay
        </Button>
      </div>{" "}
      {/* Middle row */}
      <div className="w-screen h-1/3 flex items-center justify-center">
        <Deck deck={playerHand} gameReset={gameReset} />
      </div>
    </div>
  );
}

export default App;
