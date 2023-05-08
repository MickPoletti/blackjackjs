// import React, { useState, useEffect } from "react";
import Card from "./Card";

export default function Deck({ deck }) {
  return (
    <div className="flex flex-wrap bg-slate-800 rounded-lg border-amber-500 border-2 gap-3 p-3">
      {deck.map((item, index) => (
        <Card key={index} item={item} value={item.value} name={item.name} />
      ))}
    </div>
  );
}
