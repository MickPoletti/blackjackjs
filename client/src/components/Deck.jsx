import Card from "./Card";

export default function Deck({ deck, isDealer, revealCard, gameReset }) {
  if (Object.keys(deck).length > 1 && !isDealer && !gameReset) {
    return (
      <div className="flex flex-wrap bg-slate-800 rounded-lg border-amber-500 border-2 gap-3 p-3">
        {deck.map((item, index) => (
          <Card key={index} item={item} />
        ))}
      </div>
    );
  } else if (Object.keys(deck).length > 1 && !gameReset) {
    let localDeck = [];
    for (let i = 0; i < Object.keys(deck).length; i++) {
      if (i === 0 && !revealCard) {
        let hiddenCard = {
          img: "/png/tops_card.webp",
          name: "hidden",
        };
        localDeck.push(<Card key={0} item={hiddenCard} />);
      } else {
        localDeck.push(<Card key={i} item={deck[i]} />);
      }
    }
    return (
      <div className="flex flex-wrap bg-slate-800 rounded-lg border-amber-500 border-2 gap-3 p-3">
        {localDeck}
      </div>
    );
  }
  return (
    <div className="flex flex-wrap min-w-[152px] min-h-[109px] bg-slate-800 rounded-lg border-amber-500 border-2 gap-3 p-3" />
  );
}
