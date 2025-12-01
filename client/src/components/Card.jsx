function Card({ item }) {
  if (item.name === "hidden") {
    return (
      <div className="flex items-center h-1/2 w-14 gap-3 left-12 -top-2 bg-white rounded-md">
        <img
          src={item.img}
          alt={item.name}
          className="rounded-md w-14 "
          style={{ height: "5.05rem" }}
        />
      </div>
    );
  }
  return (
    <div className="flex items-center h-1/2 w-14 gap-3 left-12 -top-2 bg-white rounded-md  hover:border-amber-400 hover:border">
      <img src={item.img} alt={item.name} />
    </div>
  );
}

export default Card;
