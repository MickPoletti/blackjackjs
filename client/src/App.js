import { useEffect, useState } from "react";
import Deck from "./components/Deck";
import Button from "@mui/material/Button";
import Alert from "./components/Alert";
import Controls from "./components/Controls";

function App() {
  const [playerHand, setPlayerHand] = useState([{}]);
  const [dealerHand, setDealerHand] = useState([{}]);
  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [gameReset, setReset] = useState(false);
  const [revealCard, setRevealCard] = useState([{}]);
  const [isPlaying, setPlaying] = useState(false);

  const handlePlaying = () => {
    setPlaying(!isPlaying);
  };

  function handleBust() {
    setAlertMessage("You bust!");
    setAlert(true);
    setReset(true);
    setPlaying(false);
  }

  function handleKeyDown(e) {
    if (isPlaying) {
      switch (e.key) {
        // Hit
        case "f":
          console.log("hit");
          hit();
          break;
        // Double Down
        case "w":
          console.log("double down");
          break;
        // Split
        case "e":
          console.log("split");
          break;
        // Switch Hands
        case "q":
          console.log("switch hands");
          break;
        // Surrender
        case "s":
          console.log("surrender");
          handlePlaying();
          break;
        // Stay
        case "r":
          stay();
          handlePlaying();
          console.log("stay");
          break;
      }
    } else {
      switch (e.key) {
        // Deal
        case "w":
          console.log("deal");
          dealDeck();
          handlePlaying();
          break;
        // Increase Bet
        case "e":
          console.log("Increase Bet");
          break;
        // Decrease Bet
        case "q":
          console.log("Decrease Bet");
          break;
        // Bet Max
        case "s":
          console.log("Bet Max");
          break;
        // Exit
        case "r":
          console.log("exit");

          break;
      }
    }
  }

  useEffect(() => {
    fetch("/api/deck/new")
      .then((response) => response.json())
      .then((data) => {
        setAlert(false);
        setAlertMessage("");
      });
  }, []);

  useEffect(() => {
    document.addEventListener("keypress", handleKeyDown);
    return function cleanup() {
      document.removeEventListener("keypress", handleKeyDown);
    };
  }, [handleKeyDown]);

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
        console.log(data);
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
      <h1 className="font-robotomono text-slate-200 px-10 py-5 bg-zinc-900">
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
        {/* <Button variant="contained" onClick={dealDeck}>
          Deal
        </Button>
        <Button variant="contained" onClick={hit}>
          Hit
        </Button>
        <Button variant="contained" onClick={stay}>
          Stay
        </Button> */}
      </div>{" "}
      {/* Middle row */}
      <div className="w-screen h-1/3 grid grid-rows-1 grid-cols-3 items-center justify-center">
        <div className="w-56 h-24 ml-6 border-l-2 border-b-2 border-fallout-green font-robotomono text-fallout-green">
          <div className=" ml-4 mt-1">
            <h3>Current Bet: &nbsp; 200</h3>
            <h3>
              Chips: <span className="pl-[4.8em]">11300</span>
            </h3>
            <h3>Tops Earnings: 1300</h3>
          </div>
        </div>
        <div className="flex items-center justify-center">
          <Deck deck={playerHand} gameReset={gameReset} />
        </div>
        <div className="flex items-center justify-end pr-12">
          <Controls isplaying={isPlaying} />
        </div>
      </div>
    </div>
  );
}

export default App;
