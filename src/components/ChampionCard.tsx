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
      <div
        className={`mb-1 z-2 relative flex gap-5 p-[8px] ${
          team === "red"
            ? "flex-row-reverse pr-4"
            : "flex-row  pl-4"
        }`}
      >
        <div className="flex">
          <div className="cropped-image ">
            <img className="" src={avatar.data} alt="" />
          </div>
        </div>
        <div className="">
          <p
            className={`text-lg font-bold text-tan	 ${
              team === "red" ? redTeam : blueTeam
            }`}
          >
            {player.championName}
          </p>
          <div
            className={`flex gap-1 items-center ${
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
      </div>
    </>
  );
};

export default ChampionCard;
