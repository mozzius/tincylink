import { createRouter } from "./context";
import { z } from "zod";

import { prisma } from "../db/client";

// super basic slug generation
// will probably run into collisions if this project
// is used at scale - using Ostrich algorithm to avoid
// https://en.wikipedia.org/wiki/Ostrich_algorithm
const genSlug = () => Math.random().toString(36).substring(2, 8);

export const linkRouter = createRouter().mutation("create", {
  input: z.object({
    url: z.string().url(),
  }),
  async resolve({ input }) {
    // upserting so that urls will share slugs
    const link = await prisma.link.upsert({
      where: { url: input.url },
      update: {},
      create: { url: input.url, slug: genSlug() },
    });
    return link;
  },
});
