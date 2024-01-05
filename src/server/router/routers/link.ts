import { z } from "zod";

import { publicProcedure, router } from "..";
import { prisma } from "../../db/client";

// super basic slug generation
// will probably run into collisions if this project
// is used at scale - using Ostrich algorithm to avoid
// https://en.wikipedia.org/wiki/Ostrich_algorithm
const genSlug = () => Math.random().toString(36).substring(2, 8);

export const linkRouter = router({
  create: publicProcedure
    .input(
      z.object({
        url: z.string().url(),
      }),
    )
    .mutation(async ({ input }) => {
      const link = await prisma.link.upsert({
        where: { url: input.url },
        update: {},
        create: { url: input.url, slug: genSlug() },
      });
      return link;
    }),
});
