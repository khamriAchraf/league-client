import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const playerPoolRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.playerPool.findMany();
  }),
});
