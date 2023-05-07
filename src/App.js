import { useState } from "react";
import Deck from "./components/Deck";

function App() {
  const [shuffleCount, setShuffleCount] = useState(0);

  function handleShuffle() {
    setShuffleCount(shuffleCount + 1);
  }

  return (
    <div className="h-screen w-screen flex flex-col bg-game-table bg-center bg-cover">
      <h1 className="font-extrabold text-slate-200 px-10 py-5 bg-zinc-900">
        FNV BLACKJACK
      </h1>
      <div className="h-1/3"></div> {/* Top row */}
      <div className="h-3/4 bg-gray-500"></div> {/* Middle row */}
      <div className="w-screen h-1/3 flex items-center justify-center">
        <Deck shuffleCount={shuffleCount} />
        <button onClick={handleShuffle}>Shuffle</button>
      </div>
    </div>
  );
}

export default App;
