import { Router } from 'express';
import { prisma } from '../prisma';
import { requireAuth, requireAdmin } from '../auth/middleware';
import { z } from 'zod';

const router = Router();

router.use(requireAuth, requireAdmin);

router.get('/orders', async (req, res) => {
  const { sortBy, status } = req.query as { sortBy?: 'date' | 'company' | 'status'; status?: string };

  const where: any = {};
  if (status && ['Active', 'Pending', 'Cancelled', 'Complete'].includes(status)) where.status = status;

  const orderBy: any = sortBy === 'company'
    ? { company: 'asc' }
    : sortBy === 'status'
    ? { status: 'asc' }
    : { createdAt: 'desc' };

  const orders = await prisma.order.findMany({
    where,
    orderBy,
    include: { items: { include: { part: true } }, user: true }
  });

  res.json(orders);
});

const updateSchema = z.object({
  orderId: z.number().int().positive(),
  status: z.enum(['Active', 'Pending', 'Cancelled', 'Complete'])
});

router.post('/orders/status', async (req, res) => {
  const parsed = updateSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const { orderId, status } = parsed.data;
  const order = await prisma.order.update({
    where: { id: orderId },
    data: { status },
    include: { items: true }
  });

  res.json(order);
});

export default router;
