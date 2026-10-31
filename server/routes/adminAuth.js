import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../prisma.js';
import { requireSession } from '../middleware/adminAuth.js';

const router = Router();
const cookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  path: '/api',
});

router.post('/login', async (req, res) => {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) {
    return res.status(503).json({ error: 'Authentification non configurée sur le serveur.' });
  }

  const email = typeof req.body?.email === 'string' ? req.body.email.trim().toLowerCase() : '';
  const password = typeof req.body?.password === 'string' ? req.body.password : '';
  const requestedRole = req.body?.accessRole;
  if (requestedRole !== 'admin' && requestedRole !== 'personnel') {
    return res.status(400).json({ error: 'Type de connexion invalide.' });
  }
  if (!email || !password) {
    return res.status(400).json({ error: 'Adresse e-mail et mot de passe obligatoires.' });
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    const passwordMatches = user ? await bcrypt.compare(password, user.passwordHash) : false;
    if (!user || !passwordMatches || !user.isActive) {
      return res.status(401).json({ error: 'Identifiants invalides ou compte désactivé.' });
    }
    const roleMatches = requestedRole === 'personnel'
      ? user.role === 'PERSONNEL'
      : user.role === 'ADMIN' || user.role === 'SUPER_ADMIN';
    if (!roleMatches) {
      return res.status(403).json({
        error: requestedRole === 'admin'
          ? 'Ce compte est réservé au personnel. Utilisez la connexion du personnel.'
          : 'Ce compte est réservé aux administrateurs. Utilisez la connexion administrateur.',
      });
    }

    const token = jwt.sign({}, secret, { subject: user.id, expiresIn: '8h' });
    res.cookie('admin_session', token, { ...cookieOptions(), maxAge: 8 * 60 * 60 * 1000 });
    return res.json({
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error('POST /api/admin/auth/login', error);
    return res.status(500).json({ error: 'Erreur serveur lors de la connexion.' });
  }
});

router.post('/logout', (req, res) => {
  res.clearCookie('admin_session', cookieOptions());
  res.status(204).end();
});

router.get('/me', requireSession, (req, res) => {
  res.json({ user: req.user });
});

export default router;
