import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
const password = process.env.ADMIN_PASSWORD;
const name = process.env.ADMIN_NAME?.trim();

if (!email || !password || !name) {
  console.error('ADMIN_EMAIL, ADMIN_PASSWORD et ADMIN_NAME doivent être définis dans server/.env.');
  process.exitCode = 1;
} else if (password.length < 12 || Buffer.byteLength(password, 'utf8') > 72) {
  console.error('ADMIN_PASSWORD doit contenir au moins 12 caractères et 72 octets maximum.');
  process.exitCode = 1;
} else {
  try {
    const passwordHash = await bcrypt.hash(password, 12);
    const existing = await prisma.user.findUnique({ where: { email }, select: { role: true } });
    if (existing && existing.role !== 'SUPER_ADMIN') {
      throw new Error('Cette adresse e-mail est déjà associée à un compte non administrateur.');
    }
    if (!existing) {
      await prisma.user.create({
        data: { name, email, passwordHash, role: 'SUPER_ADMIN' },
      });
    }
    console.log(`Compte super-admin prêt pour ${email}.`);
  } catch (error) {
    console.error('Impossible de créer le super-admin initial.', error);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}
