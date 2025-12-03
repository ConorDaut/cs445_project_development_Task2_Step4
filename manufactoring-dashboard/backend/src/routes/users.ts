import { Router } from 'express';
import { prisma } from '../prisma';
import { requireAuth } from '../auth/middleware';

const router = Router();

router.get('/me', requireAuth, async (req, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.auth!.userId } });
  if (!user) return res.status(404).json({ error: 'Not found' });
  res.json({ id: user.id, email: user.email, name: user.name, company: user.company, role: user.role });
});

export default router;
