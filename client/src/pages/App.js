import { useEffect, useState } from "react";
import Deck from "../components/Deck";
import Alert from "../components/Alert";
import Controls from "../components/Controls";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import {Redirect} from 'react-router-dom';


function App() {
  const [playerHand, setPlayerHand] = useState([{}]);
  const [dealerHand, setDealerHand] = useState([{}]);
  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [gameReset, setReset] = useState(false);
  const [revealCard, setRevealCard] = useState([{}]);
  const [isPlaying, setPlaying] = useState(false);
  const [bet, setBet] = useState(1);
  const [maxBet, setMaxBet] = useState(10000);
  const [chips, setChips] = useState(0);
  const [earnings, setEarnings] = useState(0);
  const [casino, setCasino] = useState("Tops");

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
        default:
        // Do nothing the user hit an unsupported key
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
          if (bet >= maxBet) break;
          if (bet >= 0 && bet < 10) {
            setBet(bet + 1);
          } else if (bet >= 10 && bet < 100) {
            setBet(bet + 10);
          } else if (bet >= 100 && bet < 1000) {
            setBet(bet + 100);
          } else {
            setBet(bet + 1000);
          }
          break;
        // Decrease Bet
        case "q":
          if (bet <= 0) break;
          if (bet > 0 && bet <= 10) {
            setBet(bet - 1);
          } else if (bet > 10 && bet <= 100) {
            setBet(bet - 10);
          } else if (bet > 100 && bet <= 1000) {
            setBet(bet - 100);
          } else {
            setBet(bet - 1000);
          }
          break;
        // Bet Max
        case "s":
          setBet(maxBet);
          break;
        // Exit
        // This goes to landing page (home screen)
        case "r":
          window.location = '/';
          break;
        default:
        // Do nothing the user hit an unsupported key
      }
    }
  }

  // Call new deck when page loads
  useEffect(() => {
    // Start alert in off mode
    setAlert(false);
    setAlertMessage("");
    // Make call to api for a new game state
    // TODO: Handle multiple players
    fetch("/api/deck/new")
      .then((response) => response.json())
      .then((data) => {
        setCasino(data.casino);
        setChips(data.chips);
        setEarnings(data.earnings);
        setMaxBet(data.maxBet);
      });
  }, []);

  // Handle keypresses so it feels more like the fallout game
  useEffect(() => {
    document.addEventListener("keypress", handleKeyDown);
    return function cleanup() {
      document.removeEventListener("keypress", handleKeyDown);
    };
  }, [handleKeyDown]);

  /* Begin functions to handle calls to api */

  // dealDeck is called when the user presses the 'W' key and is
  // responsible for sending the api the current user state.
  // I.e (player hand, the dealer hand state and the current bet)
  // TODO: perhaps should make the chips handling all back end
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
      <Link to="/" className="font-robotomono text-slate-200 px-10 py-5 bg-zinc-900">
        FNV BLACKJACK
      </Link>
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
            <h3>Current Bet: &nbsp; {bet}</h3>
            <h3>
              Chips: <span className="pl-[4.8em]">{chips}</span>
            </h3>
            <h3>
              {casino} Earnings: {earnings}
            </h3>
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
