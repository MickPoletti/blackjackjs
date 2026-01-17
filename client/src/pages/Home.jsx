import { BrowserRouter as Router, Route, Link, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import axios from "axios";

function Home() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [soundOn, setSoundOn] = useState(false);
  const playerRef = useRef(null);

  useEffect(() => {
    if (!window.YT) {
      const script = document.createElement('script');
      script.src = 'https://www.youtube.com/iframe_api';
      document.body.appendChild(script);
      script.onload = () => {
        window.onYouTubeIframeAPIReady = () => {
          playerRef.current = new window.YT.Player('youtube-player', {
            videoId: 'kXfQ7AB-hEM',
            playerVars: {
              autoplay: 1,
              mute: 1,
              loop: 1,
              playlist: 'kXfQ7AB-hEM',
            },
            events: {
              onReady: (event) => {
                event.target.playVideo();
              },
            },
          });
        };
      };
    } else {
      playerRef.current = new window.YT.Player('youtube-player', {
        videoId: 'kXfQ7AB-hEM',
        playerVars: {
          autoplay: 1,
          mute: 1,
          loop: 1,
          playlist: 'kXfQ7AB-hEM',
        },
        events: {
          onReady: (event) => {
            event.target.playVideo();
          },
        },
      });
    }
  }, []);

  const toggleSound = () => {
    if (playerRef.current) {
      if (soundOn) {
        playerRef.current.mute();
      } else {
        playerRef.current.unMute();
      }
      setSoundOn(!soundOn);
    }
  };

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
        <button onClick={toggleSound} className="absolute top-2 right-2 bg-red-800 p-2 rounded shadow-lg">
          {soundOn ? (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.5-4.5v9l-4.5-4.5H4.5a2.25 2.25 0 000-4.5h2.25z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 9.75L19.5 12m0 0l2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25M19.5 12l-2.25-2.25M12 4.5v15m0 0l-2.25-2.25M12 19.5l2.25-2.25M12 4.5l2.25 2.25M12 4.5L9.75 6.75" />
            </svg>
          )}
        </button>
        <img src="/png/fnv_logo.png" alt="FNV Blackjack" className="h-auto font-robotomono text-zinc-50 font-extrabold stroke-indigo-400 text-6xl top-[20px]" />
        <div className="flex flex-col mt-6 items-center">
         {/* Sends player to the game */}
          <button onClick={handlePlay} disabled={loading} className="font-extrabold box-border w-96 border-2 py-5 px-28 mt-5 text-lg text-center items-center bg-red-800 border-red-500 rounded-lg shadow-lg font-mono hover:bg-red-600 text-zinc-50 disabled:opacity-50">
            {loading ? "Loading..." : "Play"}
          </button>
          {/* TODO: Make this go to an audio controls screen */}
          <Link className="font-extrabold box-border w-96 border-2 py-5 px-28 mt-5 text-lg text-center items-center bg-red-800 border-red-500 rounded-lg shadow-lg font-mono hover:bg-red-600 text-zinc-50">Options</Link>
          {/* Leaderboard */}
          <Link to="/leaderboard" className="font-extrabold box-border w-96 border-2 py-5 px-28 mt-5 text-lg text-center items-center bg-red-800 border-red-500 rounded-lg shadow-lg font-mono hover:bg-red-600 text-zinc-50">Leaderboard</Link>
          {/* TODO: Make this go to like a credits page or something */}
          <Link className="font-extrabold box-border w-96 border-2 py-5 px-28 mt-5 text-lg text-center items-center bg-red-800 border-red-500 rounded-lg shadow-lg font-mono hover:bg-red-600 text-zinc-50">About</Link>
         {/* Idk if this even makes sense to have where is the player supposed to exit to?? */}
          <Link className="font-extrabold box-border w-96 border-2 py-5 px-28 mt-5 text-lg text-center items-center bg-red-800 border-red-500 rounded-lg shadow-lg font-mono hover:bg-red-600 text-zinc-50">Exit</Link>
        </div>
      </div>
      <div id="youtube-player" style={{ display: 'none' }}></div>
    </div>
  );
}

export default Home;
