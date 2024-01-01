import axios, { AxiosResponse } from "axios";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { env } from "process";

const prisma = new PrismaClient();
const API_KEY: string ="RGAPI-03551dee-b4b4-4d2b-9c4d-d2ab86d0393f"; // Replace this with your API key

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

export interface GameInfo {
  gameCreation: number;
  gameDuration: number;
  gameEndTimestamp: number;
  gameId: number;
  gameMode: string;
  gameName: string;
  gameStartTimestamp: number;
  gameType: string;
  gameVersion: string;
  mapId: number;
  participants: PlayerStats[];
  platformId: string;
  queueId: number;
  teams: Array<Record<string, any>>;
  tournamentCode: string;
}

export interface PlayerStats {
  allInPings: number;
  assistMePings: number;
  assists: number;
  baitPings: number;
  baronKills: number;
  basicPings: number;
  bountyLevel: number;
  challenges: Record<string, any>; // This can be further broken down into more specific interfaces
  champExperience: number;
  champLevel: number;
  championId: number;
  championName: string;
  championTransform: number;
  commandPings: number;
  consumablesPurchased: number;
  damageDealtToBuildings: number;
  damageDealtToObjectives: number;
  damageDealtToTurrets: number;
  damageSelfMitigated: number;
  dangerPings: number;
  deaths: number;
  detectorWardsPlaced: number;
  doubleKills: number;
  dragonKills: number;
  eligibleForProgression: boolean;
  enemyMissingPings: number;
  enemyVisionPings: number;
  firstBloodAssist: boolean;
  firstBloodKill: boolean;
  firstTowerAssist: boolean;
  firstTowerKill: boolean;
  gameEndedInEarlySurrender: boolean;
  gameEndedInSurrender: boolean;
  getBackPings: number;
  goldEarned: number;
  goldSpent: number;
  holdPings: number;
  individualPosition: string;
  inhibitorKills: number;
  inhibitorTakedowns: number;
  inhibitorsLost: number;
  item0: number;
  item1: number;
  item2: number;
  item3: number;
  item4: number;
  item5: number;
  item6: number;
  itemsPurchased: number;
  killingSprees: number;
  kills: number;
  lane: string;
  largestCriticalStrike: number;
  largestKillingSpree: number;
  largestMultiKill: number;
  longestTimeSpentLiving: number;
  magicDamageDealt: number;
  magicDamageDealtToChampions: number;
  magicDamageTaken: number;
  needVisionPings: number;
  neutralMinionsKilled: number;
  nexusKills: number;
  nexusLost: number;
  nexusTakedowns: number;
  objectivesStolen: number;
  objectivesStolenAssists: number;
  onMyWayPings: number;
  participantId: number;
  pentaKills: number;
  puuid: string;
  riotIdName: string;
  riotIdTagline: string;
  role: string;
  sightWardsBoughtInGame: number;
  spell1Casts: number;
  spell2Casts: number;
  spell3Casts: number;
  spell4Casts: number;
  summoner1Casts: number;
  summoner1Id: number;
  summoner2Casts: number;
  summoner2Id: number;
  summonerId: string;
  summonerLevel: number;
  summonerName: string;
  teamEarlySurrendered: boolean;
  teamId: number;
  teamPosition: string;
  timeCCingOthers: number;
  timePlayed: number;
  totalAllyJungleMinionsKilled: number;
  totalDamageDealt: number;
  totalDamageDealtToChampions: number;
  totalDamageShieldedOnTeammates: number;
  totalDamageTaken: number;
  totalHeal: number;
  totalHealsOnTeammates: number;
  totalMinionsKilled: number;
  totalTimeCCDealt: number;
  totalTimeSpentDead: number;
  totalTimeDisabled: number; // note: this key may be optional in some contexts
  totalUnitsHealed: number;
  tripleKills: number;
  trueDamageDealt: number;
  trueDamageDealtToChampions: number;
  trueDamageTaken: number;
  turretKills: number;
  turretTakedowns: number;
  turretsLost: number;
  unrealKills: number;
  visionScore: number;
  visionWardsBoughtInGame: number;
  wardsKilled: number;
  wardsPlaced: number;
  win: boolean;
  perks: Record<string, any>; // This can be further broken down into more specific interfaces
}

interface Player {
  summonerName: string;
}

export const gameRouter = createTRPCRouter({
  getOne: publicProcedure.query(async ({ ctx }) => {
    try {

      const randomPlayer: Player = {
        summonerName: "Marcenstein"
      }

      const puuidResponse: AxiosResponse<SummonerResponse> = await axios.get(
        `https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${encodeURIComponent(
          randomPlayer.summonerName
        )}?api_key=${API_KEY}`
      );

      const puuid: string = puuidResponse.data.puuid;

      const gamesResponse: AxiosResponse<string[]> = await axios.get(
        `https://europe.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?start=0&type=ranked&count=20&api_key=${API_KEY}`
      );
      const games = gamesResponse.data;

      const randomGame: string =
        games[Math.floor(Math.random() * games.length)]!;

      const gameDataResponse: AxiosResponse<GameDataResponse> = await axios.get(
        `https://europe.api.riotgames.com/lol/match/v5/matches/${randomGame}?api_key=${API_KEY}`
      );
      const gameData = gameDataResponse.data.info;

      return gameData;
    } catch (error) {
      console.error("Error fetching game data: ", error);
    }
  }),
  getAvatar: publicProcedure.input(z.string()).query((opts) => {
    const { input } = opts;
    //      ^?

    return `http://ddragon.leagueoflegends.com/cdn/13.10.1/img/champion/${encodeURIComponent(
      input
    )}.png`;
  }),
  
});
