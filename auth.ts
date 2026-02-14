
import { Router, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import prisma from '../lib/prisma';
import { requireAuth, AuthRequest } from '../middleware/auth';
import rateLimit from 'express-rate-limit';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'super-tajni-kljuc';

// Initialize rate limiter with explicit type casting for configuration
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'Previše pokušaja prijave, pokušajte ponovo kasnije.' } as any
});

const registerSchema = z.object({
  ime: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  telefon: z.string().min(6)
});

// Registration handler with type casting for req/res access
router.post('/register', async (req: Request, res: Response) => {
  try {
    const r = req as any;
    const s = res as any;
    const data = registerSchema.parse(r.body);
    const exists = await prisma.user.findUnique({ where: { email: data.email } });
    
    if (exists) return s.status(400).json({ error: 'Email je već u upotrebi' });

    const passwordHash = await bcrypt.hash(data.password, 10);

    const user = await prisma.user.create({
      data: {
        ime: data.ime,
        email: data.email,
        passwordHash,
        telefon: data.telefon
      }
    });

    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

    const { passwordHash: _, ...userSansHash } = user;
    s.status(201).json({ accessToken: token, user: userSansHash });
  } catch (err: any) {
    (res as any).status(400).json({ error: err.errors || 'Greška pri registraciji' });
  }
});

// Login handler with type casting for req/res and limiter
router.post('/login', loginLimiter as any, async (req: Request, res: Response) => {
  const r = req as any;
  const s = res as any;
  const { email, password } = r.body;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return s.status(401).json({ error: 'Pogrešni kredencijali' });

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return s.status(401).json({ error: 'Pogrešni kredencijali' });

  const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

  const { passwordHash: _, ...userSansHash } = user;
  s.json({ accessToken: token, user: userSansHash });
});

// Me handler utilizing AuthRequest cast for user context
router.get('/me', requireAuth as any, async (req: Request, res: Response) => {
  const authReq = req as AuthRequest;
  const user = await prisma.user.findUnique({ where: { id: authReq.user?.userId } });
  if (!user) return (res as any).status(404).json({ error: 'Korisnik nije pronađen' });

  const { passwordHash: _, ...userSansHash } = user;
  (res as any).json(userSansHash);
});

export default router;
