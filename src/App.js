import Cards from "./components/Cards";

function App() {
  return (
    <div className="h-screen w-screen bg-zinc-900">
      <h1 className="font-extrabold text-slate-200 px-96 py-5">FNV BLACKJACK</h1>
      <div className="grid text-center items-center justify-center h-3/4 w-full bg-game-table bg-cover bg-center">
      {/* <div className="grid text-center items-center justify-center h-3/4 w-full bg-green-800"> */}
        <h1 className="">TOPS CASINO LOGO</h1>
        <Cards/>
      </div>
    </div>
  );
}

export default App;
