import React, { useEffect, useState } from "react";
import { PlayerStats } from "./server/api/routers/game";
import { api } from "./utils/api";

const Game = () => {
  const { data } = api.game.getOne.useQuery();
  

  return (
    <div>
      Game
      {data?.participants?.map((item: PlayerStats) => (
        <div key={item.puuid}>{item.championName}</div>
      ))}
    </div>
  );
};

export default Game;
