import React from "react";
import { PlayerStats } from "~/server/api/routers/game";
import { api } from "~/utils/api";

interface ChampionProps {
  team: string;
  player: PlayerStats;
}

const ChampionCard = (props: ChampionProps): JSX.Element => {
  const positionBottom = "/icons/position-bottom.svg";
  const positionTop = "/icons/position-top.svg";
  const positionMiddle = "/icons/position-middle.svg";
  const positionJungle = "/icons/position-jungle.svg";
  const positionUtility = "/icons/position-utility.svg";
  const { player, team } = props;
  const blueTeam = "";
  const redTeam = "text-right";

  const avatar = api.game.getAvatar.useQuery(player.championName, {
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  return (
    <>
      {/* {player.firstBloodKill ||
        (player.firstTowerKill && (
          <><img
            className="absolute left-[120px] -pt-6"
            src="/background-overlay.svg"
            alt=""
          />
          </>
        ))} */}
      <div
        className={`z-2 relative mb-1 items-center flex gap-5 p-[8px] ${
          team === "red" ? "flex-row-reverse pr-4" : "flex-row  pl-4"
        }`}
      >
        <div className="flex flex-col gap-2 justify-center items-center">
        <img className="h-6 w-6 border-[#2b2d33] border" src={`/icons/${player.summoner1Id}.webp`} alt="" />
        <img className="h-6 w-6  border-[#2b2d33] border" src={`/icons/${player.summoner2Id}.webp`} alt="" />
        </div>
        
        <div className="flex">
          <div className="cropped-image ">
            <img className="" src={avatar.data} alt="" />
          </div>
        </div>
        <div className="">
        <p
            className={`text-xs text-tan	 ${
              team === "red" ? redTeam : blueTeam
            }`}
          >
            {player.summonerName}
          </p>
          <p
            className={`text-lg font-bold text-tan	 ${
              team === "red" ? redTeam : blueTeam
            }`}
          >
            {player.championName}
          </p>
          <div
            className={`flex items-center gap-1 ${
              team === "red" ? "flex-row-reverse " : "flex-row "
            }`}
          >
            {player.teamPosition === "bottom".toLowerCase() && (
              <img
                className="role-icon"
                src={positionBottom}
                alt="Position Bottom"
              />
            )}
            {player.teamPosition.toLowerCase() === "top" && (
              <img className="role-icon" src={positionTop} alt="Position Top" />
            )}
            {player.teamPosition.toLowerCase() === "middle" && (
              <img
                className="role-icon"
                src={positionMiddle}
                alt="Position Middle"
              />
            )}
            {player.teamPosition.toLowerCase() === "jungle" && (
              <img
                className="role-icon"
                src={positionJungle}
                alt="Position Jungle"
              />
            )}
            {player.teamPosition.toLowerCase() === "utility" && (
              <img
                className="role-icon"
                src={positionUtility}
                alt="Position Utility"
              />
            )}
            {player.teamPosition.toLowerCase() === "bottom" && (
              <img
                className="role-icon"
                src={positionBottom}
                alt="Position Bottom"
              />
            )}

            <p
              className={`text-sm text-[#f1f5f9] ${
                team === "red" ? redTeam : blueTeam
              }`}
            >
              {player.teamPosition}
            </p>
          </div>
        </div>
        
        <div className="w-[40px]"></div>
        <div className="icons flex flex-row justify-center">
          {player.firstTowerKill && <img className="relative z-20" src="/icons/tower-200.png" alt="" />}
          {player.firstBloodKill && <img className="relative z-20 w-6 h-6" src="/icons/kills.png" alt="" />}
        </div>
      </div>
    </>
  );
};

export default ChampionCard;
