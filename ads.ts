
import { Router, Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../lib/prisma';
import { requireAuth, AuthRequest, requireAdmin } from '../middleware/auth';

const router = Router();

// Simple HTML tag removal for basic sanitation
const sanitize = (text: string) => text.replace(/<[^>]*>?/gm, '').trim();

const adSchema = z.object({
  naslov: z.string().min(5),
  opis: z.string().min(10),
  kategorija: z.string(),
  cijena: z.number().positive(),
  lokacija: z.string(),
  images: z.array(z.string()).optional()
});

// GET list of active ads with type casting for query parameters
router.get('/', async (req: Request, res: Response) => {
  const r = req as any;
  const { q, priceMin, priceMax, kategorija, lokacija } = r.query;

  const where: any = {
    status: 'AKTIVAN'
  };

  if (q) {
    where.OR = [
      { naslov: { contains: q as string, mode: 'insensitive' } },
      { opis: { contains: q as string, mode: 'insensitive' } }
    ];
  }

  if (kategorija) where.kategorija = kategorija as string;
  if (lokacija) where.lokacija = lokacija as string;
  
  if (priceMin || priceMax) {
    where.cijena = {};
    if (priceMin) where.cijena.gte = Number(priceMin);
    if (priceMax) where.cijena.lte = Number(priceMax);
  }

  const ads = await prisma.ad.findMany({
    where,
    include: { images: { orderBy: { order: 'asc' } } },
    orderBy: { createdAt: 'desc' }
  });

  (res as any).json(ads);
});

// GET ad details by slug with type casting for params
router.get('/:slug', async (req: Request, res: Response) => {
  const r = req as any;
  const ad = await prisma.ad.findUnique({
    where: { slug: r.params.slug },
    include: { 
      images: { orderBy: { order: 'asc' } },
      vlasnik: { select: { id: true, ime: true, telefon: true } }
    }
  });

  if (!ad) return (res as any).status(404).json({ error: 'Oglas nije pronađen' });
  (res as any).json(ad);
});

// POST a new advertisement with AuthRequest context
router.post('/', requireAuth as any, async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthRequest;
    const r = req as any;
    const data = adSchema.parse(r.body);
    const slug = data.naslov.toLowerCase()
      .replace(/ /g, '-')
      .replace(/[^\w-]+/g, '') + '-' + Math.random().toString(36).substring(2, 7);

    const ad = await prisma.ad.create({
      data: {
        naslov: data.naslov,
        slug,
        opis: sanitize(data.opis),
        kategorija: data.kategorija,
        cijena: data.cijena,
        lokacija: data.lokacija,
        vlasnikId: authReq.user!.userId,
        images: {
          create: (data.images || []).map((url, index) => ({ url, order: index }))
        }
      },
      include: { images: true }
    });

    (res as any).status(201).json(ad);
  } catch (err: any) {
    (res as any).status(400).json({ error: err.errors || 'Validacija nije uspela' });
  }
});

// PUT update handler with ownership and role checks
router.put('/:id', requireAuth as any, async (req: Request, res: Response) => {
  const authReq = req as AuthRequest;
  const r = req as any;
  const ad = await prisma.ad.findUnique({ where: { id: r.params.id } });
  if (!ad) return (res as any).status(404).json({ error: 'Oglas nije pronađen' });
  
  // Permissions check
  if (ad.vlasnikId !== authReq.user!.userId && authReq.user!.role !== 'ADMIN') {
    return (res as any).status(403).json({ error: 'Nemate dozvolu za izmenu' });
  }

  try {
    const data = adSchema.partial().parse(r.body);
    const updated = await prisma.ad.update({
      where: { id: r.params.id },
      data: {
        ...data,
        opis: data.opis ? sanitize(data.opis) : undefined
      }
    });
    (res as any).json(updated);
  } catch (err) {
    (res as any).status(400).json({ error: 'Neispravni podaci' });
  }
});

// DELETE handler with permissions check
router.delete('/:id', requireAuth as any, async (req: Request, res: Response) => {
  const authReq = req as AuthRequest;
  const r = req as any;
  const ad = await prisma.ad.findUnique({ where: { id: r.params.id } });
  if (!ad) return (res as any).status(404).json({ error: 'Oglas nije pronađen' });
  
  // Permissions check
  if (ad.vlasnikId !== authReq.user!.userId && authReq.user!.role !== 'ADMIN') {
    return (res as any).status(403).json({ error: 'Nemate dozvolu za brisanje' });
  }

  await prisma.ad.delete({ where: { id: r.params.id } });
  (res as any).json({ message: 'Oglas obrisan' });
});

// PATCH handler for status updates
router.patch('/:id/status', requireAuth as any, async (req: Request, res: Response) => {
  const authReq = req as AuthRequest;
  const r = req as any;
  const { status } = r.body;
  const ad = await prisma.ad.findUnique({ where: { id: r.params.id } });
  
  if (!ad) return (res as any).status(404).json({ error: 'Oglas nije pronađen' });

  // Status-specific role restrictions
  if (status === 'ISTEKAO' && authReq.user!.role !== 'ADMIN') {
    return (res as any).status(403).json({ error: 'Samo admin može postaviti status ISTEKAO' });
  }
  
  // Ownership check
  if (ad.vlasnikId !== authReq.user!.userId && authReq.user!.role !== 'ADMIN') {
    return (res as any).status(403).json({ error: 'Nemate dozvolu' });
  }

  const updated = await prisma.ad.update({
    where: { id: r.params.id },
    data: { status }
  });

  (res as any).json(updated);
});

export default router;
