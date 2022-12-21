import { useState } from "react";
import Card from "./Card";

function Cards() {

    const [items, setItems] = useState([
        { value: 2, img: 'png/cards/2_of_clubs.png' },
        { value: 2, img: '/png/cards/2_of_diamonds.png' },
        { value: 2, img: '/png/cards/2_of_hearts.png' },
    ])

    return (
        <div className="container">
            { items.map((item, index) => (
                <Card key={index} item={item}/>
            ))}
        </div>
    )
}

export default Cards;