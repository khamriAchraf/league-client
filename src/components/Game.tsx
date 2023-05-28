import React, { useEffect, useState } from "react";
import { PlayerStats } from "../server/api/routers/game";
import { api } from "../utils/api";
import Navbar from "./Navbar";
import ChampionCard from "./ChampionCard";
import { useQueryClient } from "@tanstack/react-query";
import AudioPlayer from "./AudioPlayer";

const Game = () => {
  const [gameState, setGameState] = useState(0);
  const [fetchGame, setFetchGame] = useState(false); // Controls when to fetch game data
  const [result, setResult] = useState();
  const [winner, setWinner] = useState("");
  const [volume, setVolume] = useState(50);

  const queryClient = useQueryClient();

  const castVote = (vote: string) => {
    void voteAudio.play();
  
    // Determine correct outro video based on vote, not winner
    const outroSrc = vote === 'blue' ? '/blue-magic-outro.webm' : '/red-magic-outro.webm';
  
    // Get the correct video element
    const outroVideo = vote === 'blue' ? blueVideoRef.current! : redVideoRef.current!;
  
    // Create a new source element
    const source = document.createElement('source');
    source.src = outroSrc;
    source.type = 'video/webm';
  
    // Remove existing sources and add the new one
    while (outroVideo.firstChild) {
        outroVideo.firstChild.remove();
    }
    outroVideo.appendChild(source);
  
    // Set loop to false, load and play the video
    outroVideo.loop = false;
    outroVideo.load();
    void outroVideo.play();
  
    // Hide buttons after the outro video ends
    outroVideo.onended = () => {
      setGameState(2);  // Add a new gameState to hide buttons
    };
  
    // Check correctness after vote is cast
    if (vote === winner) {
      alert("Correct");
    } else {
      alert("Wrong");
    }
  };
  

  const gameQuery = api.game.getOne.useQuery(undefined, {
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    enabled: fetchGame, // Only fetch when fetchGame is true
  });

  const { data, isLoading, isError } = gameQuery;

  const participants = data?.participants ?? [];
  const blueTeam = participants.slice(0, 5);
  const redTeam = participants.slice(5, 10);

  const blueVideoRef = React.useRef<HTMLVideoElement>(null);
  const redVideoRef = React.useRef<HTMLVideoElement>(null);

  useEffect(() => {
    blueTeam[0]?.win ? void setWinner("blue") : void setWinner("red");
  }, [blueTeam]);

  const handleStartGame = () => {
    setFetchGame(true); // Starts fetching game data
    setGameState(1);
  };

  const handleRefresh = async () => {
    await queryClient.invalidateQueries();
    return null;
  };

  if (fetchGame && isLoading)
    return (
      <div className="flex h-[80%] w-full items-center justify-center">
        <img className="spinner" src="/spinner.png" alt="" />
      </div>
    );
  if (isError) return <div>Something went wrong...</div>; // Handling error state

  // Handle Audio
  const voteAudio = new Audio("/audio/vote-click.ogg");
  voteAudio.volume = 0.3;

  const playSound = () => {
    const audio = new Audio("/audio/hover.ogg");
    audio.volume = 0.3;
    void audio.play();
  };

  return (
    <div className="h-screen w-screen">
      {gameState !== 0 && (
        <>
          <div className="images">
            <img className="inner-mask" src="/center-splash-mask.png" alt="" />
            <img
              className="inner-ring inner-ring-left"
              src="ring-splash-inner-left.png"
              alt=""
            />
            <img
              className="inner-ring inner-ring-right"
              src="ring-splash-inner-right.png"
              alt=""
            />
            <img
              className="outer-ring outer-ring-left"
              src="ring-splash-outer-left.png"
              alt=""
            />
            <img
              className="outer-ring outer-ring-right"
              src="ring-splash-outer-right.png"
              alt=""
            />
            <img
              className="absolute"
              src="/blue-background-backlight-bg.png"
              alt=""
            />
            <img
              className="absolute right-0 -scale-100 opacity-60"
              src="/red-background-backlight-bg.png"
              alt=""
            />
          </div>
          <div className="ring-container">
            <img className="ring-dashed" src="/ring-splash-dashed.png" alt="" />
          </div>

          <div className="flex h-full flex-row">
            <div className="blueTeam flex-1 self-center">
              {blueTeam?.map((item: PlayerStats) => (
                <div key={item.puuid}>
                  {void console.log("blue win", item.win)}
                  <img
                    className="brightness-120 pl-4	"
                    src="/linework-horiz.png"
                    alt=""
                  />
                  <ChampionCard team="blue" player={item} />
                </div>
              ))}
              <img
                className="brightness-120 pl-4	"
                src="/linework-horiz.png"
                alt=""
              />
            </div>
            <div className="vote-section flex-1 self-center text-center ">
              {gameState === 1 && (
                <>
                  <div className="flex flex-row gap-2">
                    <div className="video-button-container flex-1">
                      <video
                        ref={blueVideoRef}
                        autoPlay
                        loop
                        muted
                        className="video-background"
                      >
                        <source src="/blue-magic.webm" type="video/webm" />
                      </video>
                      <button
                        onMouseEnter={playSound}
                        onClick={() => {
                          castVote("blue");
                        }}
                        className="video-button "
                      >
                        Vote Blue
                      </button>
                    </div>

                    <div className="video-button-container-red flex-1">
                      <video
                        ref={redVideoRef}
                        autoPlay
                        loop
                        muted
                        className="video-background-red"
                      >
                        <source src="/red-magic.webm" type="video/webm" />
                      </video>
                      <button
                        onMouseEnter={playSound}
                        onClick={() => {
                          castVote("red");
                        }}
                        className="video-button-red"
                      >
                        Vote Red
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
            {/* <button className="btn playButton" onClick={handleRefresh}>
            REFRESH
          </button> */}
            <div className="redTeam flex-1 self-center">
              {redTeam?.map((item: PlayerStats) => (
                <div key={item.puuid}>
                  <img
                    className="brightness-120 red-divider pl-4"
                    src="/linework-horiz.png"
                    alt=""
                  />
                  <ChampionCard team="red" player={item} />
                </div>
              ))}
              <img
                className="brightness-120 red-divider pl-4"
                src="/linework-horiz.png"
                alt=""
              />
            </div>
          </div>
        </>
      )}
      {gameState === 0 && (
        <div className="flex-column flex h-[80vh] w-full items-end justify-center">
          <button
            className="btn playButton bg-[url('/button-accept-default.png')] bg-cover hover:bg-[url('/button-accept-hover.png')]"
            onClick={handleStartGame}
          >
            FIND MATCH
          </button>
        </div>
      )}
    </div>
  );
};

export default Game;
