import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.part.createMany({
    data: [
      { sku: 'P-1001', name: 'Bearing A', price: 12.5, stock: 200 },
      { sku: 'P-1002', name: 'Gear B', price: 25.0, stock: 150 },
      { sku: 'P-1003', name: 'Valve C', price: 9.75, stock: 500 }
    ],
    skipDuplicates: true
  });

  const adminEmail = 'admin@example.com';
  const existing = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (!existing) {
    // Simple seed; password = AdminPass123
    const bcrypt = await import('bcryptjs');
    const hash = await bcrypt.default.hash('AdminPass123', 10);
    await prisma.user.create({
      data: { email: adminEmail, passwordHash: hash, name: 'Admin', company: 'HQ', role: 'ADMIN' }
    });
  }
}

main().finally(() => prisma.$disconnect());
