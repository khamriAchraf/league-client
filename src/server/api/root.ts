import { createTRPCRouter } from "~/server/api/trpc";
import { playerPoolRouter } from "./routers/playerPool";
import { gameRouter } from "./routers/game";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  playerPool: playerPoolRouter,
  game:gameRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
