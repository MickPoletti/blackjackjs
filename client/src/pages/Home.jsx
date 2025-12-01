import { BrowserRouter as Router, Route, Link } from "react-router-dom"
function Home() {
  return (
    <div className=" flex flex-col items-center h-screen w-screen bg-slate-900">
      <h1 className="font-robotomono text-zinc-50 font-extrabold stroke-indigo-400 text-9xl top-[100px]">FNV Blackjack</h1>
      <div className="flex flex-col mt-12 items-center">
        {/* Sends player to the game */}
        <Link to="/app" className=" box-border w-96 border-2 py-5 px-28 mt-5 text-lg text-center items-center hover:bg-fallout-green text-zinc-50">Play</Link>
        {/* TODO: Make this go to an audio controls screen */}
        <Link className=" box-border w-96 border-2 py-5 px-28 mt-5 text-lg text-center items-center hover:bg-fallout-green text-zinc-50">Options</Link>
        {/* TODO: Make this go to like a credits page or something */}
        <Link className=" box-border w-96 border-2 py-5 px-28 mt-5 text-lg text-center items-center hover:bg-fallout-green text-zinc-50">About</Link>
        {/* Idk if this even makes sense to have where is the player supposed to exit to?? */}
        <Link className=" box-border w-96 border-2 py-5 px-28 mt-5 text-lg text-center items-center hover:bg-fallout-green text-zinc-50">Exit</Link>
      </div>
    </div>
  );
}

export default Home;
