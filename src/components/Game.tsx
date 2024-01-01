"use client";
import React, { useEffect, useState } from "react";
import { PlayerStats } from "../server/api/routers/game";
import { api } from "../utils/api";
import Navbar from "./Navbar";
import ChampionCard from "./ChampionCard";
import { useQueryClient } from "@tanstack/react-query";
import AudioPlayer from "./AudioPlayer";

interface Guess {
  date: string;
  actualOutcome: string;
  userVote: string;
  isCorrect: boolean;
}

interface VoteStats {
  totalVotes: number;
  correctVotes: number;
  incorrectVotes: number;
  accuracy: number;
}

const Game = () => {
  const [gameState, setGameState] = useState(0);
  const [fetchGame, setFetchGame] = useState(false); // Controls when to fetch game data
  const [result, setResult] = useState<string>("");
  const [winner, setWinner] = useState<string>("");
  const [accuracy, setAccuracy] = useState<number>();
  const [rightGuesses, setRightGuesses] = useState<number>();
  const [wrongGuesses, setWrongGuesses] = useState<number>();
  const [lastFive, setLastFive] = useState<boolean[]>();
  const [blueDragons, setBlueDragons] = useState();
  const [redDragons, setRedDragons] = useState();
  const [blueBaron, setBlueBaron] = useState();
  const [redBaron, setRedBaron] = useState();
  const [blueHerald, setBlueHerald] = useState();
  const [redHerald, setRedHerald] = useState();
  const queryClient = useQueryClient();

  const castVote = (vote: string) => {
    // Determine correct outro video based on vote, not winner
    const outroSrc =
      vote === "blue" ? "/blue-magic-outro.webm" : "/red-magic-outro.webm";

    // Get the correct video element
    const outroVideo =
      vote === "blue" ? blueVideoRef.current! : redVideoRef.current!;

    // Create a new source element
    const source = document.createElement("source");
    source.src = outroSrc;
    source.type = "video/webm";

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
      setGameState(2); // Add a new gameState to hide buttons
    };

    // Check correctness after vote is cast
    if (vote === winner) {
      setResult("correct");
    } else {
      setResult("wrong");
    }
    // ...rest of your function...

    // After the correctness is checked, update localStorage
    const currentGuess: Guess = {
      date: new Date().toISOString(),
      actualOutcome: winner,
      userVote: vote,
      isCorrect: vote === winner,
    };

    // Fetch the existing guesses from localStorage
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const previousGuesses: Guess[] = JSON.parse(
      localStorage.getItem("guessHistory") ?? "[]"
    );

    // Add the current guess to the history
    previousGuesses.push(currentGuess);

    // Save back to localStorage
    localStorage.setItem("guessHistory", JSON.stringify(previousGuesses));

    // Update overall stats
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const stats: VoteStats = JSON.parse(
      localStorage.getItem("voteStats") ?? "{}"
    );
    stats.totalVotes = (stats.totalVotes || 0) + 1;
    stats.correctVotes = (stats.correctVotes || 0) + (vote === winner ? 1 : 0);
    stats.incorrectVotes = stats.totalVotes - stats.correctVotes;
    stats.accuracy = stats.correctVotes / stats.totalVotes;

    // Save back to localStorage
    localStorage.setItem("voteStats", JSON.stringify(stats));
  };

  const gameQuery = api.game.getOne.useQuery(undefined, {
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    enabled: fetchGame, // Only fetch when fetchGame is true
  });

  const { data, isLoading, isError } = gameQuery;
  function formatSeconds(seconds: number | undefined): string | undefined {
    if (seconds) {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;

      return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
        .toString()
        .padStart(2, "0")}`;
    }
  }

  const participants = data?.participants ?? [];
  const blueTeam = participants.slice(0, 5);
  const redTeam = participants.slice(5, 10);
  const gameId = data?.gameId;
  const gameTime = formatSeconds(data?.gameDuration);

  const blueVideoRef = React.useRef<HTMLVideoElement>(null);
  const redVideoRef = React.useRef<HTMLVideoElement>(null);

  useEffect(() => {
    blueTeam[0]?.win ? void setWinner("blue") : void setWinner("red");
    console.log(data?.teams[0]);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
    setBlueBaron(data?.teams[0]!.objectives.baron.kills);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
    setRedBaron(data?.teams[1]!.objectives.baron.kills);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
    setBlueDragons(data?.teams[0]!.objectives.dragon.kills);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
    setRedDragons(data?.teams[1]!.objectives.dragon.kills);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
    setBlueHerald(data?.teams[0]!.objectives.riftHerald.kills);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
    setRedHerald(data?.teams[1]!.objectives.riftHerald.kills);
  }, [blueTeam]);

  useEffect(() => {
    if (gameState === 2) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const voteStats: VoteStats = JSON.parse(
        localStorage.getItem("voteStats") ?? "{}"
      );
      const totalVotes: number =
        voteStats.correctVotes + voteStats.incorrectVotes;
      setRightGuesses(voteStats.correctVotes || 0);
      setWrongGuesses(voteStats.incorrectVotes || 0);
      const accuracy = voteStats.accuracy * 100;
      setAccuracy(accuracy);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const guessHistory: Guess[] = JSON.parse(
        localStorage.getItem("guessHistory") ?? "{}"
      );
      setLastFive(guessHistory.slice(-5).map((guess) => guess.isCorrect));
    }
  }, [gameState]);

  const handleStartGame = () => {
    setFetchGame(true); // Starts fetching game data
    setGameState(1);
  };

  const handleRefresh = async () => {
    // void voteAudio.play();
    await queryClient.invalidateQueries();
    setGameState(1);
    return;
  };

  if (fetchGame && isLoading)
    return (
      <div className="flex h-[80%] w-full items-center justify-center">
        <img className="spinner" src="/spinner.png" alt="" />
      </div>
    );
  if (isError) return <div>Something went wrong...</div>; // Handling error state

  // Handle Audio
  if (typeof Audio != "undefined") {
    const voteAudio = new Audio("/audio/vote-click.ogg");
    voteAudio.volume = 0.3;
  }

  const playSound = () => {
    if (typeof Audio != "undefined") {
      const audio = new Audio("/audio/hover.ogg");
      audio.volume = 0.3;
      void audio.play();
    }
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
            <div className="vote-section relative z-20 flex-1 self-center text-center">
              {gameState === 1 && (
                <div className="flex h-[500px] flex-col items-center justify-around pb-[50px] pt-[50px]">
                  <div className="flex flex-col items-center justify-center gap-1">
                    <img
                      className="flex h-8 w-8"
                      src="/icons/map_sr.png"
                      alt=""
                    />
                    <p className="text-grey">Summoners Rift - Ranked</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="text-xs text-grey">Game Duration</div>
                    <p className="text-xl text-grey">{gameTime}</p>
                  </div>
                  <div className="objectives flex w-full flex-row items-center justify-around">
                    <div className="flex-col items-center justify-center">
                      <div className="items center flex w-40 flex-row  justify-around">
                        <div className="flex flex-col gap-2">
                          <div className=" text-xs text-grey">
                            <img
                              className="flex h-6 w-6"
                              src="/icons/baron-100.png"
                              alt=""
                            />
                          </div>
                          <p className="text-lg text-grey">{blueBaron}</p>
                        </div>
                        <div className="flex flex-col gap-2">
                          <div className=" text-lg text-grey">
                            <img
                              className="flex h-6 w-6"
                              src="/icons/herald-100.png"
                              alt=""
                            />
                          </div>
                          <p className="text-lg text-grey">{blueHerald}</p>
                        </div>
                        <div className="flex flex-col gap-2">
                          <div className=" text-xs text-grey">
                            <img
                              className="flex h-6 w-6"
                              src="/icons/dragon-100.png"
                              alt=""
                            />
                          </div>
                          <p className="text-lg text-grey">{blueDragons}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex-col items-center justify-center">
                      <div className="flex-col items-center justify-center">
                        <div className="items center flex w-40 flex-row  justify-around">
                          <div className="flex flex-col gap-2">
                            <div className=" text-lg text-grey">
                              <img
                                className="flex h-6 w-6"
                                src="/icons/dragon-200.png"
                                alt=""
                              />
                            </div>
                            <p className="text-lg text-grey">{redDragons}</p>
                          </div>
                          <div className="flex flex-col gap-2">
                            <div className=" text-lg text-grey">
                              <img
                                className="flex h-6 w-6"
                                src="/icons/herald-200.png"
                                alt=""
                              />
                            </div>
                            <p className="text-lg text-grey">{redHerald}</p>
                          </div>
                          <div className="flex flex-col gap-2">
                            <div className=" text-lg text-grey">
                              <img
                                className="flex h-6 w-6"
                                src="/icons/baron-200.png"
                                alt=""
                              />
                            </div>
                            <p className="text-lg text-grey">{redBaron}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="button-row flex flex-row border-y">
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
                        className="video-button text-lg font-bold text-tan"
                      >
                        Blue Win
                      </button>
                    </div>
                    <div className="h-auto w-[1px] bg-gold"></div>
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
                        className="video-button-red text-lg font-bold text-tan"
                      >
                        Red Win
                      </button>
                    </div>
                  </div>
                </div>
              )}
              {gameState === 2 && (
                <div className="flex h-[500px] flex-col items-center justify-around pb-[50px] pt-[50px]">
                  <p className="text-grey">GameID: {gameId}</p>
                  <div>
                    {result === "correct" ? (
                      <>
                        <video
                          autoPlay
                          muted
                          className="correct-video brightness-200"
                        >
                          <source
                            src="/eog_intro_magic.webm"
                            type="video/webm"
                          />
                        </video>
                        <p className="text-2xl font-bold uppercase  text-blue">
                          Correct
                        </p>
                      </>
                    ) : (
                      <p className="text-2xl font-bold uppercase  text-red">
                        Wrong
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col gap-0 pt-16">
                    <div className=" text-xs text-grey">Last Five Guesses</div>
                    <div>
                      {lastFive?.map((guess, index) => (
                        <div
                          key={index}
                          className={`dot ${guess ? "win" : "loss"}`}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="flex w-full flex-row items-center justify-around">
                    <div className="flex flex-col gap-2">
                      <div className=" text-xs text-grey">
                        Times Guessed Right
                      </div>
                      <p className="text-xl text-grey">{rightGuesses}</p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <div className=" text-xs text-grey">Overall Accuracy</div>
                      <div className="text-2xl text-grey">
                        {accuracy?.toFixed(2)} %
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <div className="text-xs text-grey">
                        Times Guessed Wrong
                      </div>
                      <p className="text-xl text-grey">{wrongGuesses}</p>
                    </div>
                  </div>
                  <div className="pt-16">
                    <button
                      className="h-20 w-20 bg-[url('/button-replay-normal.png')] bg-cover hover:bg-[url('/button-replay-hover.png')] active:bg-[url('/button-replay-click.png')]"
                      // eslint-disable-next-line @typescript-eslint/no-misused-promises
                      onClick={() => handleRefresh()}
                    ></button>
                  </div>
                </div>
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
