function Card({item}) {
    console.log(item.img)
    return (
        <div className="card">
           <img src={item.img} alt="Card" />
        </div>
    )
}

export default Card