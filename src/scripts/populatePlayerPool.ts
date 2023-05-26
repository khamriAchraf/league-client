import axios, { AxiosResponse } from 'axios';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const API_KEY = 'YOUR-API-KEY'; // Replace this with your API key

interface Player {
  summonerId: string;
  summonerName: string;
  // add any other fields that you expect from the API response
}

type PlayerResponse = Player[];

async function populatePlayerPool() {
  try {
    const response: AxiosResponse<PlayerResponse> = await axios.get(`https://euw1.api.riotgames.com/lol/league-exp/v4/entries/RANKED_SOLO_5x5/CHALLENGER/I?page=1&api_key=${API_KEY}`);
    const players = response.data;

    for (const player of players) {
      await prisma.playerPool.create({
        data: {
          summonerId: player.summonerId,
          summonerName: player.summonerName,
          puuid:"unknown",
        },
      });
    }

    console.log('PlayerPool populated successfully!');
  } catch (error) {
    console.error('Error populating PlayerPool: ', error);
  } finally {
    await prisma.$disconnect();
  }
}
populatePlayerPool
