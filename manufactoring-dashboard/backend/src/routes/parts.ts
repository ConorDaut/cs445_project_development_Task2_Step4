import { Router } from 'express';
import { prisma } from '../prisma';
import { requireAuth } from '../auth/middleware';

const router = Router();

router.get('/', requireAuth, async (_req, res) => {
  const parts = await prisma.part.findMany({ orderBy: { name: 'asc' } });
  res.json(parts);
});

export default router;
