import axios, { AxiosResponse } from "axios";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { env } from "process";

const prisma = new PrismaClient();
const API_KEY: string = env["RIOT_API_KEY"] || ""; // Replace this with your API key

interface SummonerResponse {
  id: string;
  accountId: string;
  puuid: string;
  name: string;
  profileIconId: number;
  revisionDate: number;
  summonerLevel: number;
}

interface MatchlistResponse {
  matches: string[];
}

interface GameDataResponse {
  metadata: Array<Record<string, any>>;
  info: GameInfo;
}

interface GameInfo {
    gameCreation: number,
    gameDuration: number,
    gameEndTimestamp: number,
    gameId: number,
    gameMode: string,
    gameName: string,
    gameStartTimestamp: number,
    gameType: string,
    gameVersion: string,
    mapId: number,
    participants: Array<Record<string, any>>,
    platformId: string,
    queueId: number,
    teams: Array<Record<string, any>>,
    tournamentCode: string
}

interface Player {
  summonerId: string;
  summonerName: string;
  puuid: string;
}

export const gameRouter = createTRPCRouter({
  getOne: publicProcedure.query(async ({ ctx }) => {
    try {
      const players: Player[] = await ctx.prisma.playerPool.findMany();

      if (!players.length) {
        throw new Error("No players found");
      }

      const randomPlayer: Player =
        players[Math.floor(Math.random() * players.length)]!;

      const puuidResponse: AxiosResponse<SummonerResponse> = await axios.get(
        `https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${encodeURIComponent(
          randomPlayer.summonerName
        )}?api_key=${API_KEY}`
      );

      const puuid: string = puuidResponse.data.puuid;

      const gamesResponse: AxiosResponse<string[]> = await axios.get(`https://europe.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?start=0&type=ranked&count=20&api_key=${API_KEY}`);
      const games = gamesResponse.data;
      

      const randomGame: string = games[Math.floor(Math.random() * games.length)]!;


      const gameDataResponse: AxiosResponse<GameDataResponse> = await axios.get(`https://europe.api.riotgames.com/lol/match/v5/matches/${randomGame}?api_key=${API_KEY}`);
      const gameData = gameDataResponse.data.info;
      

      return gameData;



    } catch (error) {
      console.error("Error fetching game data: ", error);
    }
  }),
});
