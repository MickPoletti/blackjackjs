import Card from "./Card";

export default function Deck({ deck, isDealer }) {
  if (Object.keys(deck).length > 1 && !isDealer) {
    return (
      <div className="flex flex-wrap bg-slate-800 rounded-lg border-amber-500 border-2 gap-3 p-3">
        {deck.map((item, index) => (
          <Card key={index} item={item} />
        ))}
      </div>
    );
  } else if (Object.keys(deck).length > 1) {
    let localDeck = [];
    for (let i = 0; i < Object.keys(deck).length; i++) {
      if (i === 0) {
        let hiddenCard = {
          img: "/png/tops_card.webp",
          name: "hidden",
        };
        localDeck.push(<Card item={hiddenCard} />);
      } else {
        localDeck.push(<Card item={deck[i]} />);
      }
    }
    return (
      <div className="flex flex-wrap bg-slate-800 rounded-lg border-amber-500 border-2 gap-3 p-3">
        {localDeck}
      </div>
    );
  }
  return (
    <div className="flex flex-wrap bg-slate-800 rounded-lg border-amber-500 border-2 gap-3 p-3" />
  );
}
