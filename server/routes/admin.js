import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '../prisma.js';
import { requireAdmin, requireSuperAdmin } from '../middleware/adminAuth.js';

const router = Router();
const safeUser = {
  id: true,
  name: true,
  email: true,
  role: true,
  specialty: true,
  isActive: true,
  createdAt: true,
};

function readUserInput(body, includePassword = false) {
  const name = typeof body?.name === 'string' ? body.name.trim() : '';
  const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : '';
  const specialty = typeof body?.specialty === 'string' ? body.specialty.trim() : '';
  const password = typeof body?.password === 'string' ? body.password : '';
  if (
    name.length < 2 ||
    name.length > 160 ||
    email.length > 254 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    specialty.length > 160
  ) {
    return { error: 'Nom (2 à 160 caractères) et adresse e-mail valide obligatoires.' };
  }
  if (includePassword && (password.length < 12 || Buffer.byteLength(password, 'utf8') > 72)) {
    return { error: 'Le mot de passe doit contenir au moins 12 caractères et 72 octets maximum.' };
  }
  return { data: { name, email, specialty: specialty || null, password } };
}

router.get('/dashboard', requireAdmin, async (req, res) => {
  try {
    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);
    const [personnel, activePersonnel, administrators, births, birthsThisMonth] = await Promise.all([
      prisma.user.count({ where: { role: 'PERSONNEL' } }),
      prisma.user.count({ where: { role: 'PERSONNEL', isActive: true } }),
      prisma.user.count({ where: { role: { in: ['ADMIN', 'SUPER_ADMIN'] } } }),
      prisma.accouchement.count(),
      prisma.accouchement.count({ where: { deliveryDate: { gte: monthStart } } }),
    ]);
    return res.json({ personnel, activePersonnel, administrators, births, birthsThisMonth });
  } catch (error) {
    console.error('GET /api/admin/dashboard', error);
    return res.status(500).json({ error: 'Impossible de charger les statistiques administrateur.' });
  }
});

router.get('/personnel', requireAdmin, async (req, res) => {
  try {
    const personnel = await prisma.user.findMany({
      where: { role: 'PERSONNEL' },
      select: safeUser,
      orderBy: { createdAt: 'desc' },
    });
    return res.json(personnel);
  } catch (error) {
    console.error('GET /api/admin/personnel', error);
    return res.status(500).json({ error: 'Impossible de charger le personnel.' });
  }
});

router.post('/personnel', requireAdmin, async (req, res) => {
  const input = readUserInput(req.body, true);
  if (input.error) return res.status(400).json({ error: input.error });
  try {
    const passwordHash = await bcrypt.hash(input.data.password, 12);
    const user = await prisma.user.create({
      data: { ...input.data, passwordHash, role: 'PERSONNEL' },
      select: safeUser,
    });
    return res.status(201).json(user);
  } catch (error) {
    if (error?.code === 'P2002') return res.status(409).json({ error: 'Cette adresse e-mail est déjà utilisée.' });
    console.error('POST /api/admin/personnel', error);
    return res.status(500).json({ error: 'Impossible de créer ce compte personnel.' });
  }
});

router.patch('/personnel/:id', requireAdmin, async (req, res) => {
  const input = readUserInput(req.body);
  if (input.error) return res.status(400).json({ error: input.error });
  const isActive = req.body?.isActive;
  if (typeof isActive !== 'boolean') return res.status(400).json({ error: 'État du compte invalide.' });
  try {
    const result = await prisma.user.updateMany({
      where: { id: req.params.id, role: 'PERSONNEL' },
      data: { ...input.data, isActive },
    });
    if (!result.count) return res.status(404).json({ error: 'Compte personnel introuvable.' });
    const user = await prisma.user.findUnique({ where: { id: req.params.id }, select: safeUser });
    return res.json(user);
  } catch (error) {
    if (error?.code === 'P2002') return res.status(409).json({ error: 'Cette adresse e-mail est déjà utilisée.' });
    console.error('PATCH /api/admin/personnel/:id', error);
    return res.status(500).json({ error: 'Impossible de modifier ce compte personnel.' });
  }
});

router.patch('/personnel/:id/status', requireAdmin, async (req, res) => {
  if (typeof req.body?.isActive !== 'boolean') return res.status(400).json({ error: 'État du compte invalide.' });
  try {
    const result = await prisma.user.updateMany({
      where: { id: req.params.id, role: 'PERSONNEL' },
      data: { isActive: req.body.isActive },
    });
    if (!result.count) return res.status(404).json({ error: 'Compte personnel introuvable.' });
    return res.json({ id: req.params.id, isActive: req.body.isActive });
  } catch (error) {
    console.error('PATCH /api/admin/personnel/:id/status', error);
    return res.status(500).json({ error: 'Impossible de modifier l’accès à ce compte.' });
  }
});

router.delete('/personnel/:id', requireAdmin, async (req, res) => {
  try {
    const result = await prisma.user.deleteMany({ where: { id: req.params.id, role: 'PERSONNEL' } });
    if (!result.count) return res.status(404).json({ error: 'Compte personnel introuvable.' });
    return res.status(204).end();
  } catch (error) {
    console.error('DELETE /api/admin/personnel/:id', error);
    return res.status(500).json({ error: 'Impossible de supprimer ce compte personnel.' });
  }
});

router.get('/administrators', requireAdmin, requireSuperAdmin, async (req, res) => {
  try {
    const administrators = await prisma.user.findMany({
      where: { role: { in: ['ADMIN', 'SUPER_ADMIN'] } },
      select: safeUser,
      orderBy: { createdAt: 'desc' },
    });
    return res.json(administrators);
  } catch (error) {
    console.error('GET /api/admin/administrators', error);
    return res.status(500).json({ error: 'Impossible de charger les administrateurs.' });
  }
});

router.post('/administrators', requireAdmin, requireSuperAdmin, async (req, res) => {
  const input = readUserInput(req.body, true);
  if (input.error) return res.status(400).json({ error: input.error });
  try {
    const passwordHash = await bcrypt.hash(input.data.password, 12);
    const admin = await prisma.user.create({
      data: { ...input.data, passwordHash, role: 'ADMIN' },
      select: safeUser,
    });
    return res.status(201).json(admin);
  } catch (error) {
    if (error?.code === 'P2002') return res.status(409).json({ error: 'Cette adresse e-mail est déjà utilisée.' });
    console.error('POST /api/admin/administrators', error);
    return res.status(500).json({ error: 'Impossible de créer cet administrateur.' });
  }
});

router.patch('/administrators/:id/status', requireAdmin, requireSuperAdmin, async (req, res) => {
  if (typeof req.body?.isActive !== 'boolean') return res.status(400).json({ error: 'État du compte invalide.' });
  if (req.params.id === req.admin.id) return res.status(400).json({ error: 'Vous ne pouvez pas désactiver votre propre compte.' });
  try {
    const result = await prisma.user.updateMany({
      where: { id: req.params.id, role: 'ADMIN' },
      data: { isActive: req.body.isActive },
    });
    if (!result.count) return res.status(404).json({ error: 'Administrateur introuvable.' });
    return res.json({ id: req.params.id, isActive: req.body.isActive });
  } catch (error) {
    console.error('PATCH /api/admin/administrators/:id/status', error);
    return res.status(500).json({ error: 'Impossible de modifier l’accès à cet administrateur.' });
  }
});

router.delete('/administrators/:id', requireAdmin, requireSuperAdmin, async (req, res) => {
  if (req.params.id === req.admin.id) return res.status(400).json({ error: 'Vous ne pouvez pas supprimer votre propre compte.' });
  try {
    const result = await prisma.user.deleteMany({
      where: { id: req.params.id, role: 'ADMIN' },
    });
    if (!result.count) return res.status(404).json({ error: 'Administrateur introuvable.' });
    return res.status(204).end();
  } catch (error) {
    console.error('DELETE /api/admin/administrators/:id', error);
    return res.status(500).json({ error: 'Impossible de supprimer cet administrateur.' });
  }
});

export default router;
