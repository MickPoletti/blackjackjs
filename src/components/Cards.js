import { useState } from "react";
import Card from "./Card";

function Cards() {

    const [items, setItems] = useState([
        { value: 2, img: '/png/cards/2_of_clubs.png' },
        { value: 2, img: '/png/cards/2_of_diamonds.png' },
        { value: 2, img: '/png/cards/2_of_hearts.png' },
        { value: 2, img: '/png/cards/2_of_spades.png' },
    ])

    return (
        <div className="flex bg-slate-800 rounded-lg border-amber-500 border-2 gap-3 p-3">
            { items.map((item, index) => (
                <Card key={index} item={item}/>
            ))}
        </div>
    )
}

export default Cards;