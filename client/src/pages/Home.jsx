import { BrowserRouter as Router, Route, Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

function Home() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handlePlay = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/game/init");
      const { sessionId, chips } = response.data;
      navigate("/app", { state: { sessionId, chips } });
    } catch (error) {
      console.error("Error initializing game:", error);
      // Fallback: navigate anyway
      navigate("/app");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="home-background flex flex-col items-center h-screen w-screen">
      <div className="background-layer">
        <div className="casino-image tops-image">
          <img src="/png/tops_casino.png" alt="Tops Casino" className="casino-img" />
        </div>
        <div className="casino-image lucky-image">
          <img src="/png/lucky_38_casino.jpg" alt="Lucky 38 Casino" className="casino-img" />
        </div>
        <div className="casino-image gomorrah-image">
          <img src="/png/gomorrah_casino.jpg" alt="Gomorrah Casino" className="casino-img" />
        </div>
        <div className="casino-image ultra-image">
          <img src="/png/ultra_luxe_casino.jpg" alt="Ultra-Luxe Casino" className="casino-img" />
        </div>
      </div>
      <div className="content-wrapper">
        <img src="/png/fnv_logo.png" alt="FNV Blackjack" className="h-auto font-robotomono text-zinc-50 font-extrabold stroke-indigo-400 text-6xl top-[20px]" />
        <div className="flex flex-col mt-6 items-center">
         {/* Sends player to the game */}
         <button onClick={handlePlay} disabled={loading} className=" box-border w-96 border-2 py-5 px-28 mt-5 text-lg text-center items-center hover:bg-fallout-green text-zinc-50 disabled:opacity-50">
           {loading ? "Loading..." : "Play"}
         </button>
         {/* TODO: Make this go to an audio controls screen */}
         <Link className=" box-border w-96 border-2 py-5 px-28 mt-5 text-lg text-center items-center hover:bg-fallout-green text-zinc-50">Options</Link>
         {/* Leaderboard */}
         <Link to="/leaderboard" className=" box-border w-96 border-2 py-5 px-28 mt-5 text-lg text-center items-center hover:bg-fallout-green text-zinc-50">Leaderboard</Link>
         {/* TODO: Make this go to like a credits page or something */}
         <Link className=" box-border w-96 border-2 py-5 px-28 mt-5 text-lg text-center items-center hover:bg-fallout-green text-zinc-50">About</Link>
        {/* Idk if this even makes sense to have where is the player supposed to exit to?? */}
         <Link className=" box-border w-96 border-2 py-5 px-28 mt-5 text-lg text-center items-center hover:bg-fallout-green text-zinc-50">Exit</Link>
        </div>
      </div>
    </div>
  );
}

export default Home;
