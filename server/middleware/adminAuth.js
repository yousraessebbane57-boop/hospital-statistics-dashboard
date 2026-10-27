import jwt from 'jsonwebtoken';
import { prisma } from '../prisma.js';

export async function requireSession(req, res, next) {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) {
    return res.status(503).json({ error: 'Authentification non configurée sur le serveur.' });
  }

  const token = req.cookies?.admin_session;
  if (!token) return res.status(401).json({ error: 'Connexion requise.' });

  try {
    const payload = jwt.verify(token, secret);
    if (typeof payload !== 'object' || typeof payload.sub !== 'string') {
      return res.status(401).json({ error: 'Session invalide.' });
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      select: { id: true, name: true, email: true, role: true, isActive: true },
    });
    if (!user || !user.isActive) {
      return res.status(401).json({ error: 'Session invalide ou compte désactivé.' });
    }

    req.user = user;
    return next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError || error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ error: 'Session expirée. Veuillez vous reconnecter.' });
    }
    return next(error);
  }
}

export async function requireAdmin(req, res, next) {
  return requireSession(req, res, (error) => {
    if (error) return next(error);
    if (req.user?.role === 'PERSONNEL') {
      return res.status(403).json({ error: 'Accès réservé aux administrateurs.' });
    }
    req.admin = req.user;
    return next();
  });
}

export function requireSuperAdmin(req, res, next) {
  if (req.admin?.role !== 'SUPER_ADMIN') {
    return res.status(403).json({ error: 'Droits super-admin requis.' });
  }
  return next();
}
