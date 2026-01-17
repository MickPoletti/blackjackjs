import { useEffect, useState, useCallback } from "react";
import Deck from "../components/Deck";
import Alert from "../components/Alert";
import Controls from "../components/Controls";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const { sessionId: initialSessionId, chips: initialChips } = location.state || {};

  const [playerHand, setPlayerHand] = useState([{}]);
  const [dealerHand, setDealerHand] = useState([{}]);
  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [gameReset, setReset] = useState(false);
  const [revealCard, setRevealCard] = useState([{}]);
  const [isPlaying, setPlaying] = useState(false);
  const [bet, setBet] = useState(1);
  const maxBet = 10000;
  const [chips, setChips] = useState(initialChips || 0);
  const earnings = 0;
  const casino = "Tops";
  const [gameSessionId, setGameSessionId] = useState(null);
  const sessionId = initialSessionId;
  const [showScoreModal, setShowScoreModal] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [gameResult, setGameResult] = useState(null);
  const [gameEnded, setGameEnded] = useState(false);

  const handlePlaying = useCallback(() => {
    setPlaying(!isPlaying);
  }, [isPlaying, setPlaying]);

  /* Begin functions to handle calls to api */

  const handleGameOver = useCallback((score, result, serverChips, chipsChange) => {
    setChips(serverChips);
    setFinalScore(score);
    setGameResult(result);
    setGameEnded(true);
    setPlaying(false);

    let message = '';
    if (result === 'win') {
      message = `You win ${Math.abs(chipsChange)} caps!`;
    } else if (result === 'lose') {
      message = `You lose ${Math.abs(chipsChange)} caps!`;
    } else if (result === 'push') {
      message = 'Push! No caps change.';
    }

    if (serverChips <= 0 && result === 'lose') {
      message = 'Game over! You\'re out of caps.';
    }

    setAlertMessage(message);
    setAlert(true);
  }, [setChips, setFinalScore, setGameResult, setGameEnded, setPlaying, setAlertMessage, setAlert]);

  // startGame is called when the user presses the 'W' key to begin a new game
  const startGame = useCallback(async () => {
    if (chips <= 0) {
      setAlertMessage("You're out of caps! Can't start a new game.");
      setAlert(true);
      return;
    }

    try {
      const response = await axios.post("/api/game/start", { sessionId, bet });
      const gameData = response.data;

      setGameSessionId(gameData.sessionId);
      setPlayerHand(gameData.playerHand);
      setDealerHand(gameData.dealerHand);
      setRevealCard(false);
      setReset(false);
      setAlert(false);
      setGameResult(null);
    } catch (error) {
      console.error("Error starting game:", error);
    }
  }, [sessionId, bet, chips, setAlertMessage, setAlert, setPlayerHand, setDealerHand, setRevealCard, setReset]);

  const hit = useCallback(async () => {
    if (!gameSessionId) return;

    try {
      const response = await axios.post("/api/game/hit", { sessionId });
      const gameData = response.data;

       setPlayerHand(gameData.playerHand);

       if (gameData.isBusted) {
         handleGameOver(gameData.finalScore || 0, gameData.result, gameData.chips, gameData.chipsChange);
       }
    } catch (error) {
      console.error("Error hitting:", error);
    }
  }, [sessionId, gameSessionId, setPlayerHand, handleGameOver]);

  const stay = useCallback(async () => {
    if (!gameSessionId) return;

    try {
      const response = await axios.post("/api/game/stand", { sessionId });
      const gameData = response.data;

      setDealerHand(gameData.dealerHand);
      setRevealCard(true);

       // Show result and prompt for score submission
       handleGameOver(gameData.finalScore, gameData.result, gameData.chips, gameData.chipsChange);
    } catch (error) {
      console.error("Error standing:", error);
    }
  }, [sessionId, gameSessionId, setDealerHand, setRevealCard, handleGameOver]);


  const submitScore = useCallback(async (username) => {
    if (!username.trim()) return;

    try {
      await axios.post("/api/scores/submit", {
        username: username.trim(),
        score: finalScore
      });

      setShowScoreModal(false);
      setGameEnded(false);
      setAlertMessage(`Score submitted! You ${gameResult === 'win' ? 'won' : 'lost'}.`);
      setAlert(true);
      navigate('/');
    } catch (error) {
      console.error("Error submitting score:", error);
      setAlertMessage("Failed to submit score. Try again.");
      setAlert(true);
    }
  }, [finalScore, gameResult, setShowScoreModal, setAlertMessage, setAlert, navigate]);

  const handleKeyDown = useCallback((e) => {
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
          startGame();
          handlePlaying();
          break;
        // Increase Bet
        case "e": {
          let newBet;
          if (bet >= maxBet) break;
          if (bet >= 0 && bet < 10) {
            newBet = bet + 1;
          } else if (bet >= 10 && bet < 100) {
            newBet = bet + 10;
          } else if (bet >= 100 && bet < 1000) {
            newBet = bet + 100;
          } else {
            newBet = bet + 1000;
          }
          if (newBet > chips) {
            setAlertMessage("Insufficient caps!");
            setAlert(true);
          } else {
            setBet(newBet);
          }
          break;
        }
        // Decrease Bet
        case "q":
          if (bet <= 0) break;
          if (bet > 1 && bet <= 10) {
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
          setBet(Math.min(maxBet, chips));
          break;
        // Exit
        // This goes to landing page (home screen)
        case "r":
          if (gameEnded) {
            setShowScoreModal(true);
          } else {
            navigate('/');
          }
          break;
        default:
        // Do nothing the user hit an unsupported key
      }
    }
  }, [isPlaying, bet, maxBet, setBet, chips, gameEnded, startGame, handlePlaying, hit, stay, setAlertMessage, setAlert, navigate]);

  // Handle key presses so it feels more like the fallout game
  useEffect(() => {
    document.addEventListener("keypress", handleKeyDown);
    return function cleanup() {
      document.removeEventListener("keypress", handleKeyDown);
    };
   }, [handleKeyDown]);

  // Warn on refresh when in game
  useEffect(() => {
    if (!sessionId) return;
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = "Are you sure? You'll lose all progress.";
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [sessionId]);

  // Redirect to home if no session (e.g., on refresh)
  useEffect(() => {
    if (!sessionId) {
      navigate('/');
    }
  }, [sessionId, navigate]);

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

       {/* Score Submission Modal */}
       {showScoreModal && (
         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
           <div className="bg-zinc-900 border-2 border-fallout-green p-6 rounded-lg max-w-md w-full mx-4">
             <h2 className="text-fallout-green font-robotomono text-xl mb-4 text-center">
               Game Over!
             </h2>
             <p className="text-zinc-200 mb-4 text-center">
               Final Score: <span className="text-fallout-green font-bold">{finalScore}</span>
             </p>
             <p className="text-zinc-200 mb-6 text-center">
               Result: <span className={`font-bold ${gameResult === 'win' ? 'text-green-400' : 'text-red-400'}`}>
                 {gameResult === 'win' ? 'You Won!' : gameResult === 'push' ? 'Push' : 'You Lost'}
               </span>
             </p>

             <div className="mb-4">
               <label className="block text-zinc-200 mb-2">Enter username for leaderboard:</label>
               <input
                 type="text"
                 id="username-input"
                 className="w-full bg-zinc-800 border border-fallout-green text-zinc-200 px-3 py-2 rounded focus:outline-none focus:border-green-400"
                 placeholder="Your username"
                 maxLength={20}
               />
             </div>

             <div className="flex gap-3">
               <button
                 onClick={() => {
                   const username = document.getElementById('username-input').value;
                   submitScore(username);
                 }}
                 className="flex-1 bg-fallout-green hover:bg-green-600 text-zinc-900 font-bold py-2 px-4 rounded transition-colors"
               >
                 Submit Score
               </button>
                <button
                  onClick={() => {
                    setShowScoreModal(false);
                    setGameEnded(false);
                    navigate('/');
                  }}
                  className="flex-1 bg-zinc-700 hover:bg-zinc-600 text-zinc-200 font-bold py-2 px-4 rounded transition-colors"
                >
                  Skip
                </button>
             </div>
           </div>
         </div>
       )}
      {/* Top row */}
      <div className="h-3/4">
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
