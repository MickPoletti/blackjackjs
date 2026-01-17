import Card from "./Card";

export default function Controls({ isPlaying }) {
  if (!isPlaying) {
    return (
      <div className="font-robotomono text-fallout-green">
        <div className=" ml-4 mt-1">
          <h3>
            <span className="pl-[4.8em]">Deal W)</span>
          </h3>
          <h3> Increase Bet E)</h3>
          <h3> Decrease Bet Q)</h3>
          <h3>
            <span className="pl-[3em]">Bet Max S)</span>
          </h3>
          <h3>
            {" "}
            <span className="pl-[4.7em]">Exit R)</span>
          </h3>
        </div>
      </div>
    );
  }
  return (
    <div className="font-robotomono text-fallout-green">
      <div className=" ml-4 mt-1">
        <h3>
          <span className="pl-[5.5em]">Hit F)</span>
        </h3>
        <h3>
          <span className="pl-3"> Double Down W)</span>
        </h3>
        <h3>
          <span className="pl-[4.3em]">Split E)</span>
        </h3>
        <h3>Switch Hands Q)</h3>
        <h3>
          {" "}
          <span className="pl-7">Surrender S)</span>
        </h3>
        <h3>
          {" "}
          <span className="pl-[4.7em]">Stay R)</span>
        </h3>
      </div>
    </div>
  );
}
