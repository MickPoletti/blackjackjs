var count = 0;

function Card({item}) {   
    count++;
    if (count > 2) {
        return (
            <div className="flex items-center h-1/2 w-14 gap-3 left-12 -top-2 bg-white rounded-md">
                <img src={item.img} alt="Card" />
            </div>
        )
    }
    return (
        <div className="flex items-center h-1/2 w-14 gap-3 left-12 -top-2 bg-white rounded-md">
           <img src={item.img} alt="Card" />
        </div>
    )
    
}

export default Card