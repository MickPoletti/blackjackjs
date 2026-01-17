import { useState, useRef } from "react";

function Layout({ children }) {
  const [soundOn, setSoundOn] = useState(false);
  const audioRef = useRef(null);

  const toggleSound = () => {
    setSoundOn(!soundOn);
    if (!soundOn) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  };

  const handleWheel = (e) => {
    if (soundOn && audioRef.current) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      audioRef.current.volume = Math.max(0, Math.min(1, audioRef.current.volume + delta));
    }
  };

  return (
    <div>
      {children}
      <button onClick={toggleSound} onWheel={handleWheel} className="fixed top-2 right-[5px] bg-red-800 p-2 rounded shadow-lg z-50">
        <i className="material-icons text-white">{soundOn ? 'volume_up' : 'volume_off'}</i>
      </button>
      <audio ref={audioRef} loop>
        <source src="/audio/fnv-soundtrack.mp3" type="audio/mpeg" />
      </audio>
    </div>
  );
}

export default Layout;