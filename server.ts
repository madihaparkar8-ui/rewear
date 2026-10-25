import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import {
  db,
  hashPassword,
  verifyPassword,
  User,
} from './server/db.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// Body parsing with 15mb limit for uploaded clothing photos
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Auth Middleware
export interface AuthenticatedRequest extends Request {
  user?: User;
  token?: string;
}

function authMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  const token = authHeader.split(' ')[1];
  const userId = db.getUserIdFromSession(token);
  if (!userId) {
    return res.status(401).json({ error: 'Invalid or expired session' });
  }

  const user = db.getUserById(userId);
  if (!user) {
    return res.status(401).json({ error: 'User not found' });
  }

  req.user = user;
  req.token = token;
  next();
}

// Optional Auth (for public listings where we also check if user has favorited)
function optionalAuthMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    const userId = db.getUserIdFromSession(token);
    if (userId) {
      req.user = db.getUserById(userId);
      req.token = token;
    }
  }
  next();
}

// --- Auth Routes ---

app.post('/api/auth/signup', (req: Request, res: Response) => {
  try {
    const { name, email, password, location, avatar, bio, preferredSizes } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const existing = db.getUserByEmail(email);
    if (existing) {
      return res.status(400).json({ error: 'An account with this email already exists' });
    }

    const { hash, salt } = hashPassword(password);
    const role = email.toLowerCase() === 'madihaparkar8@gmail.com' ? 'admin' : 'user';

    const newUser = db.createUser({
      name,
      email: email.toLowerCase(),
      passwordHash: hash,
      salt,
      avatar: avatar || `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80`,
      bio: bio || 'Sustainable fashion enthusiast swapping high-quality wardrobe essentials.',
      location: location || 'San Francisco, CA',
      preferredSizes: preferredSizes || ['M'],
      role,
    });

    const token = db.createSession(newUser.id);
    const { passwordHash: _, salt: __, ...userPublic } = newUser;

    return res.status(201).json({ user: userPublic, token });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Signup failed' });
  }
});

app.post('/api/auth/login', (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = db.getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isValid = verifyPassword(password, user.passwordHash, user.salt);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = db.createSession(user.id);
    const { passwordHash: _, salt: __, ...userPublic } = user;

    return res.json({ user: userPublic, token });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Login failed' });
  }
});

app.get('/api/auth/me', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const { passwordHash: _, salt: __, ...userPublic } = req.user!;
  res.json({ user: userPublic });
});

app.post('/api/auth/logout', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  if (req.token) {
    db.deleteSession(req.token);
  }
  res.json({ success: true });
});

app.put('/api/auth/profile', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  try {
    const { name, bio, location, avatar, preferredSizes } = req.body;
    const updated = db.updateUser(req.user!.id, {
      ...(name ? { name } : {}),
      ...(bio !== undefined ? { bio } : {}),
      ...(location ? { location } : {}),
      ...(avatar ? { avatar } : {}),
      ...(preferredSizes ? { preferredSizes } : {}),
    });

    if (!updated) return res.status(404).json({ error: 'User not found' });
    const { passwordHash: _, salt: __, ...userPublic } = updated;
    res.json({ user: userPublic });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Profile update failed' });
  }
});

// --- Listings Routes ---

app.get('/api/listings', optionalAuthMiddleware, (req: AuthenticatedRequest, res: Response) => {
  try {
    const { category, condition, size, search, location, sort, ownerId, status } = req.query;
    const listings = db.getListings({
      category: category as string,
      condition: condition as string,
      size: size as string,
      search: search as string,
      location: location as string,
      sort: sort as string,
      ownerId: ownerId as string,
      status: status as string,
    });

    const userFavorites = req.user ? db.getUserFavorites(req.user.id) : [];

    const decorated = listings.map(l => ({
      ...l,
      isFavorited: userFavorites.includes(l.id),
    }));

    res.json({ listings: decorated, total: decorated.length });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch listings' });
  }
});

app.get('/api/listings/:id', optionalAuthMiddleware, (req: AuthenticatedRequest, res: Response) => {
  try {
    const listing = db.getListingById(req.params.id);
    if (!listing) return res.status(404).json({ error: 'Listing not found' });

    const owner = db.getUserById(listing.ownerId);
    const isFavorited = req.user ? db.getUserFavorites(req.user.id).includes(listing.id) : false;

    // Get other listings by the same owner
    const otherListings = db.getListings({ ownerId: listing.ownerId })
      .filter(l => l.id !== listing.id)
      .slice(0, 4);

    res.json({
      listing: {
        ...listing,
        isFavorited,
        owner: owner ? {
          id: owner.id,
          name: owner.name,
          avatar: owner.avatar,
          bio: owner.bio,
          location: owner.location,
          rating: owner.rating,
          swapsCompleted: owner.swapsCompleted,
          memberSince: owner.memberSince,
        } : null,
      },
      otherListings,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch listing' });
  }
});

app.post('/api/listings', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  try {
    const {
      title,
      description,
      category,
      size,
      brand,
      condition,
      originalPrice,
      indicativeValue,
      location,
      images,
      material,
      color,
      gender,
    } = req.body;

    if (!title || !category || !size || !brand || !condition) {
      return res.status(400).json({ error: 'Please provide title, category, size, brand, and condition' });
    }

    const newListing = db.createListing({
      ownerId: req.user!.id,
      ownerName: req.user!.name,
      ownerAvatar: req.user!.avatar,
      ownerLocation: location || req.user!.location,
      title,
      description: description || 'Pre-loved garment in great condition ready for a conscious wardrobe swap.',
      category,
      size,
      brand,
      condition,
      originalPrice: Number(originalPrice) || 80,
      indicativeValue: Number(indicativeValue) || 45,
      location: location || req.user!.location,
      images: images && images.length > 0 ? images : ['/src/assets/images/fashion_knitwear_sweater_1792904136197.jpg'],
      material: material || 'Organic Cotton / Natural blend',
      color: color || 'Neutral',
      gender: gender || 'Unisex',
      status: 'available',
      isFeatured: false,
    });

    res.status(201).json({ listing: newListing });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to create listing' });
  }
});

app.put('/api/listings/:id', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  try {
    const isAdmin = req.user!.role === 'admin';
    const updated = db.updateListing(req.params.id, req.user!.id, req.body, isAdmin);
    if (!updated) return res.status(404).json({ error: 'Listing not found' });
    res.json({ listing: updated });
  } catch (err: any) {
    res.status(403).json({ error: err.message || 'Failed to update listing' });
  }
});

app.delete('/api/listings/:id', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  try {
    const isAdmin = req.user!.role === 'admin';
    const success = db.deleteListing(req.params.id, req.user!.id, isAdmin);
    if (!success) return res.status(404).json({ error: 'Listing not found' });
    res.json({ success: true });
  } catch (err: any) {
    res.status(403).json({ error: err.message || 'Failed to delete listing' });
  }
});

// --- Favorites Routes ---

app.post('/api/listings/:id/favorite', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  try {
    const isFavorited = db.toggleFavorite(req.user!.id, req.params.id);
    res.json({ isFavorited });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to toggle favorite' });
  }
});

app.get('/api/favorites', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  try {
    const favoriteIds = db.getUserFavorites(req.user!.id);
    const listings = db.getListings().filter(l => favoriteIds.includes(l.id));
    res.json({ favorites: listings });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch favorites' });
  }
});

// --- Swaps Routes ---

app.get('/api/swaps', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  try {
    const swaps = db.getSwapsForUser(req.user!.id);
    res.json(swaps);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch swap requests' });
  }
});

app.post('/api/swaps', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  try {
    const { targetListingId, offeredListingIds, message } = req.body;
    if (!targetListingId || !offeredListingIds || !offeredListingIds.length) {
      return res.status(400).json({ error: 'Target item and at least one offered item are required' });
    }

    const swap = db.createSwapRequest({
      proposerId: req.user!.id,
      targetListingId,
      offeredListingIds,
      message,
    });

    res.status(201).json({ swap });
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Failed to propose swap' });
  }
});

app.put('/api/swaps/:id/status', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  try {
    const { status, responseMessage, scheduledDate, meetupLocation } = req.body;
    if (!['accepted', 'rejected', 'cancelled', 'completed'].includes(status)) {
      return res.status(400).json({ error: 'Invalid swap status' });
    }

    const updated = db.updateSwapStatus(
      req.params.id,
      req.user!.id,
      status,
      responseMessage,
      scheduledDate,
      meetupLocation
    );

    res.json({ swap: updated });
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Failed to update swap status' });
  }
});

// --- Conversations & Messages Routes ---

app.get('/api/conversations', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  try {
    const convs = db.getUserConversations(req.user!.id);
    res.json({ conversations: convs });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch conversations' });
  }
});

app.get('/api/conversations/:id/messages', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  try {
    const messages = db.getMessages(req.params.id, req.user!.id);
    res.json({ messages });
  } catch (err: any) {
    res.status(403).json({ error: err.message || 'Failed to fetch messages' });
  }
});

app.post('/api/conversations/:id/messages', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  try {
    const { content } = req.body;
    if (!content || !content.trim()) {
      return res.status(400).json({ error: 'Message content cannot be empty' });
    }

    const msg = db.addMessage(req.params.id, req.user!.id, content.trim());
    res.status(201).json({ message: msg });
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Failed to send message' });
  }
});

// Direct start conversation with listing owner
app.post('/api/conversations', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  try {
    const { recipientId, listingId, initialMessage } = req.body;
    if (!recipientId) return res.status(400).json({ error: 'Recipient ID required' });
    if (recipientId === req.user!.id) return res.status(400).json({ error: 'Cannot message yourself' });

    const conv = db.getOrCreateConversation(req.user!.id, recipientId, listingId);
    if (initialMessage && initialMessage.trim()) {
      db.addMessage(conv.id, req.user!.id, initialMessage.trim());
    }
    res.json({ conversation: conv });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to create conversation' });
  }
});

// --- Calendar Routes ---

app.get('/api/calendar', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  try {
    const events = db.getCalendarEvents(req.user!.id);
    res.json({ events });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch calendar events' });
  }
});

app.post('/api/calendar', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  try {
    const { swapRequestId, title, date, time, location, notes, partnerName, partnerId } = req.body;
    if (!title || !date) {
      return res.status(400).json({ error: 'Title and date are required' });
    }

    const event = db.addCalendarEvent({
      userId: req.user!.id,
      swapRequestId: swapRequestId || '',
      title,
      date,
      time: time || '12:00',
      location: location || 'Designated swap meet / Tracked mail',
      notes: notes || '',
      partnerName: partnerName || 'Swap Member',
      partnerId: partnerId || '',
    });

    res.status(201).json({ event });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to create calendar event' });
  }
});

app.delete('/api/calendar/:id', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  try {
    const success = db.deleteCalendarEvent(req.params.id, req.user!.id);
    if (!success) return res.status(404).json({ error: 'Event not found' });
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to delete calendar event' });
  }
});

// --- Support / Contact ---

app.post('/api/support', (req: Request, res: Response) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required' });
    }

    const inquiry = db.createSupportInquiry({
      name,
      email,
      subject: subject || 'General Community Inquiry',
      message,
    });

    res.status(201).json({ success: true, inquiryId: inquiry.id });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to submit inquiry' });
  }
});

// --- Admin Panel Routes (Protected) ---

function adminOnlyMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  if (req.user?.role !== 'admin' && req.user?.email.toLowerCase() !== 'madihaparkar8@gmail.com') {
    return res.status(403).json({ error: 'Administrator access required' });
  }
  next();
}

app.get('/api/admin/stats', authMiddleware, adminOnlyMiddleware, (_req: AuthenticatedRequest, res: Response) => {
  try {
    const stats = db.getAdminStats();
    res.json({ stats });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to load admin stats' });
  }
});

app.get('/api/admin/listings', authMiddleware, adminOnlyMiddleware, (_req: AuthenticatedRequest, res: Response) => {
  try {
    const listings = db.getAllListingsForAdmin();
    res.json({ listings });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to load admin listings' });
  }
});

app.put('/api/admin/listings/:id/featured', authMiddleware, adminOnlyMiddleware, (req: AuthenticatedRequest, res: Response) => {
  try {
    const { isFeatured } = req.body;
    const updated = db.updateListing(req.params.id, '', { isFeatured: Boolean(isFeatured) }, true);
    res.json({ listing: updated });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to toggle featured status' });
  }
});

// --- Static assets & Vite Dev Middleware ---

async function startServer() {
  // Expose image assets directly under /src/assets
  app.use('/src/assets', express.static(path.resolve(__dirname, 'src/assets')));

  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`ReWear Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start ReWear server:', err);
});
