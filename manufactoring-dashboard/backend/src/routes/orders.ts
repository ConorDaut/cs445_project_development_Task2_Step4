import { Router } from 'express';
import { prisma } from '../prisma';
import { requireAuth } from '../auth/middleware';
import { z } from 'zod';

const router = Router();

const createOrderSchema = z.object({
  items: z.array(z.object({
    partId: z.number().int().positive(),
    quantity: z.number().int().positive()
  })),
  paymentInfo: z.object({
    cardLast4: z.string().length(4),
    nameOnCard: z.string().min(1)
  })
});

router.post('/', requireAuth, async (req, res) => {
  const parsed = createOrderSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const user = await prisma.user.findUnique({ where: { id: req.auth!.userId } });
  if (!user) return res.status(404).json({ error: 'User not found' });

  const parts = await prisma.part.findMany({
    where: { id: { in: parsed.data.items.map(i => i.partId) } }
  });

  const partMap = new Map(parts.map(p => [p.id, p]));
  let total = 0;
  parsed.data.items.forEach(i => {
    const part = partMap.get(i.partId);
    if (!part) throw new Error('Part not found');
    total += part.price * i.quantity;
  });

  const order = await prisma.order.create({
    data: {
      userId: user.id,
      company: user.company,
      status: 'Pending',
      total,
      items: {
        create: parsed.data.items.map(i => ({
          partId: i.partId,
          quantity: i.quantity,
          unitPrice: partMap.get(i.partId)!.price
        }))
      },
      paymentLast4: parsed.data.paymentInfo.cardLast4
    },
    include: { items: true }
  });

  res.json(order);
});

router.get('/', requireAuth, async (req, res) => {
  const { status, sortBy } = req.query as { status?: string; sortBy?: 'date' | 'company' | 'status' };
  const where: any = { userId: req.auth!.userId };
  if (status && ['Active', 'Pending', 'Cancelled', 'Complete'].includes(status)) where.status = status;

  const orderBy: any = sortBy === 'company'
    ? { company: 'asc' }
    : sortBy === 'status'
    ? { status: 'asc' }
    : { createdAt: 'desc' };

  const orders = await prisma.order.findMany({
    where,
    orderBy,
    include: { items: { include: { part: true } } }
  });
  res.json(orders);
});

router.get('/history', requireAuth, async (req, res) => {
  const orders = await prisma.order.findMany({
    where: { userId: req.auth!.userId, status: 'Complete' },
    orderBy: { updatedAt: 'desc' },
    include: { items: { include: { part: true } } }
  });
  res.json(orders);
});

export default router;
