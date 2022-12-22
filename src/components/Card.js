var count = 0;

function Card({item}) {   
    count++;
    if (count > 2) {
        return (
            <div className="abolute flex gap-3 left-12 -top-2 bg-white rounded-md">
                <img src={item.img} alt="Card" />
            </div>
        )
    }
    return (
        <div className="abolute flex gap-3 left-12 -top-2 bg-white rounded-md">
           <img src={item.img} alt="Card" />
        </div>
    )
    
}

export default Card