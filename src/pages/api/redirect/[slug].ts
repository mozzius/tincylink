import type { NextApiRequest, NextApiResponse } from "next";

import { prisma } from "../../../server/db/client";

export default async function redirectRoute(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const slug = req.query.slug as string;

  if (!slug) {
    res.status(404).end();
    return;
  }

  const link = await prisma.link.findUnique({
    where: { slug },
  });

  if (!link) {
    res.status(404).end();
    return;
  }

  res.redirect(link?.url);
}
