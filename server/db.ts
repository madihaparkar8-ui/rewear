import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  salt: string;
  avatar: string;
  bio: string;
  location: string;
  preferredSizes: string[];
  memberSince: string;
  role: 'admin' | 'user';
  rating: number;
  swapsCompleted: number;
}

export interface Listing {
  id: string;
  ownerId: string;
  ownerName: string;
  ownerAvatar: string;
  ownerLocation: string;
  title: string;
  description: string;
  category: string;
  size: string;
  brand: string;
  condition: 'New with tags' | 'Like new' | 'Gently worn' | 'Good';
  originalPrice: number;
  indicativeValue: number;
  location: string;
  images: string[];
  material?: string;
  color?: string;
  gender?: 'Women' | 'Men' | 'Unisex';
  status: 'available' | 'in_swap' | 'swapped';
  isFeatured?: boolean;
  createdAt: string;
  updatedAt: string;
  views?: number;
}

export interface SwapRequest {
  id: string;
  targetListingId: string;
  targetListingTitle: string;
  targetListingImage: string;
  targetListingValue: number;
  targetOwnerId: string;
  targetOwnerName: string;
  proposerId: string;
  proposerName: string;
  proposerAvatar: string;
  offeredListingIds: string[];
  offeredListings: {
    id: string;
    title: string;
    image: string;
    indicativeValue: number;
  }[];
  status: 'pending' | 'accepted' | 'rejected' | 'cancelled' | 'completed';
  proposerMessage: string;
  responseMessage?: string;
  createdAt: string;
  updatedAt: string;
  scheduledDate?: string;
  meetupLocation?: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  content: string;
  createdAt: string;
}

export interface Conversation {
  id: string;
  participants: string[];
  participantDetails: Record<string, { name: string; avatar: string; email: string }>;
  listingId?: string;
  listingTitle?: string;
  swapRequestId?: string;
  lastMessage: string;
  lastMessageAt: string;
  updatedAt: string;
}

export interface CalendarEvent {
  id: string;
  userId: string;
  swapRequestId: string;
  title: string;
  date: string; // YYYY-MM-DD
  time: string;
  location: string;
  notes: string;
  partnerName: string;
  partnerId: string;
  createdAt: string;
}

export interface Favorite {
  userId: string;
  listingId: string;
  createdAt: string;
}

export interface SupportInquiry {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
  status: 'new' | 'reviewed';
}

interface DatabaseSchema {
  users: User[];
  sessions: Record<string, string>; // token -> userId
  listings: Listing[];
  swaps: SwapRequest[];
  conversations: Conversation[];
  messages: Message[];
  calendarEvents: CalendarEvent[];
  favorites: Favorite[];
  supportInquiries: SupportInquiry[];
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_PATH = path.join(DATA_DIR, 'db.json');

// Security helper: hash passwords using scrypt
export function hashPassword(password: string, salt = crypto.randomBytes(16).toString('hex')): { hash: string; salt: string } {
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return { hash, salt };
}

export function verifyPassword(password: string, hash: string, salt: string): boolean {
  const checkHash = crypto.scryptSync(password, salt, 64).toString('hex');
  return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(checkHash, 'hex'));
}

// Initial seed data
function getInitialSeed(): DatabaseSchema {
  // Password for all seeded demo accounts is "rewear2026"
  const defaultPw = hashPassword('rewear2026', 'fixed_salt_rewear_demo_2026');

  const users: User[] = [
    {
      id: 'usr_admin',
      name: 'Madiha Parkar',
      email: 'madihaparkar8@gmail.com',
      passwordHash: defaultPw.hash,
      salt: defaultPw.salt,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      bio: 'Curator & Administrator at ReWear. Passionate about slow fashion, timeless tailoring, and textile longevity.',
      location: 'San Francisco, CA',
      preferredSizes: ['S', 'M', '38'],
      memberSince: 'March 2025',
      role: 'admin',
      rating: 5.0,
      swapsCompleted: 24,
    },
    {
      id: 'usr_clara',
      name: 'Clara Moreau',
      email: 'clara.moreau@example.com',
      passwordHash: defaultPw.hash,
      salt: defaultPw.salt,
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
      bio: 'Lover of natural fabrics, French silhouettes, and minimal linen tailoring.',
      location: 'Paris, France',
      preferredSizes: ['S', 'M', '36'],
      memberSince: 'January 2026',
      role: 'user',
      rating: 4.9,
      swapsCompleted: 14,
    },
    {
      id: 'usr_soren',
      name: 'Soren Lind',
      email: 'soren.lind@example.com',
      passwordHash: defaultPw.hash,
      salt: defaultPw.salt,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
      bio: 'Nordic minimalist and vintage denim archivist. Preserving heritage workwear.',
      location: 'Copenhagen, Denmark',
      preferredSizes: ['L', '32/32', '42'],
      memberSince: 'February 2026',
      role: 'user',
      rating: 4.8,
      swapsCompleted: 11,
    },
    {
      id: 'usr_arjun',
      name: 'Arjun Mehta',
      email: 'arjun.mehta@example.com',
      passwordHash: defaultPw.hash,
      salt: defaultPw.salt,
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
      bio: 'Textile researcher fascinated by Indian heritage weaves, Jamdani, and raw tussar silk.',
      location: 'Mumbai, India',
      preferredSizes: ['M', 'L', '40'],
      memberSince: 'October 2025',
      role: 'user',
      rating: 5.0,
      swapsCompleted: 19,
    },
    {
      id: 'usr_maya',
      name: 'Maya Lin',
      email: 'maya.lin@example.com',
      passwordHash: defaultPw.hash,
      salt: defaultPw.salt,
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
      bio: 'Architect & sustainable wardrobe capsule advocate. Reusing keeps the planet clean.',
      location: 'Brooklyn, NY',
      preferredSizes: ['XS', 'S', '37'],
      memberSince: 'November 2025',
      role: 'user',
      rating: 4.9,
      swapsCompleted: 16,
    },
  ];

  // 28 realistic demonstration listings
  const listings: Listing[] = [
    {
      id: 'lst_1',
      ownerId: 'usr_clara',
      ownerName: 'Clara Moreau',
      ownerAvatar: users[1].avatar,
      ownerLocation: 'Paris, France',
      title: 'Terracotta Tiered Organic Linen Midi Dress',
      description: 'Handcrafted from 100% certified Normandy organic linen. Features gentle puff sleeves, a relaxed tiered silhouette, and invisible mother-of-pearl rear buttons. Perfectly breathable for warm seasons.',
      category: 'Dresses',
      size: 'M',
      brand: 'Dôen',
      condition: 'Like new',
      originalPrice: 260,
      indicativeValue: 145,
      location: 'Paris, France',
      images: ['/src/assets/images/fashion_linen_dress_1792904133888.jpg'],
      material: '100% Organic Linen',
      color: 'Terracotta',
      gender: 'Women',
      status: 'available',
      isFeatured: true,
      createdAt: '2026-10-18T10:00:00.000Z',
      updatedAt: '2026-10-18T10:00:00.000Z',
      views: 142,
    },
    {
      id: 'lst_2',
      ownerId: 'usr_admin',
      ownerName: 'Madiha Parkar',
      ownerAvatar: users[0].avatar,
      ownerLocation: 'San Francisco, CA',
      title: 'Tailored Forest Green Belted Trench Coat',
      description: 'Double-breasted heavyweight wool-blend trench coat in rich forest green. Horn buttons, storm flap, and a detachable waist tie. Exquisite craftsmanship that repels wind and rain.',
      category: 'Jackets & Coats',
      size: 'M',
      brand: 'Margaret Howell',
      condition: 'Like new',
      originalPrice: 420,
      indicativeValue: 220,
      location: 'San Francisco, CA',
      images: ['/src/assets/images/fashion_trench_coat_1792904134314.jpg'],
      material: 'Wool & Organic Cotton Blend',
      color: 'Forest Green',
      gender: 'Unisex',
      status: 'available',
      isFeatured: true,
      createdAt: '2026-10-19T14:30:00.000Z',
      updatedAt: '2026-10-19T14:30:00.000Z',
      views: 188,
    },
    {
      id: 'lst_3',
      ownerId: 'usr_soren',
      ownerName: 'Soren Lind',
      ownerAvatar: users[2].avatar,
      ownerLocation: 'Copenhagen, Denmark',
      title: 'Chunky Fisherman Cable-Knit Merino Sweater',
      description: 'Pure untreated Scottish merino wool sweater with traditional honeycomb and cable aran patterns. Deep ribbed neck and cuffs. Super warm and resilient.',
      category: 'Tops',
      size: 'M',
      brand: 'The Isle Heritage',
      condition: 'Like new',
      originalPrice: 195,
      indicativeValue: 115,
      location: 'Copenhagen, Denmark',
      images: ['/src/assets/images/fashion_knitwear_sweater_1792904136197.jpg'],
      material: '100% Merino Wool',
      color: 'Ivory / Natural Cream',
      gender: 'Unisex',
      status: 'available',
      isFeatured: true,
      createdAt: '2026-10-20T09:15:00.000Z',
      updatedAt: '2026-10-20T09:15:00.000Z',
      views: 97,
    },
    {
      id: 'lst_4',
      ownerId: 'usr_soren',
      ownerName: 'Soren Lind',
      ownerAvatar: users[2].avatar,
      ownerLocation: 'Copenhagen, Denmark',
      title: 'Vintage Washed 14oz Selvedge Denim Trucker Jacket',
      description: 'Heavyweight selvedge denim from Okayama mills with natural honeycombs and fades. Copper hardware, dual chest flap pockets, and boxy vintage workwear fit.',
      category: 'Jackets & Coats',
      size: 'L',
      brand: 'Iron Heart',
      condition: 'Gently worn',
      originalPrice: 290,
      indicativeValue: 140,
      location: 'Copenhagen, Denmark',
      images: ['/src/assets/images/fashion_denim_jacket_1792904134671.jpg'],
      material: '100% Selvedge Cotton',
      color: 'Indigo Washed',
      gender: 'Men',
      status: 'available',
      isFeatured: true,
      createdAt: '2026-10-21T11:45:00.000Z',
      updatedAt: '2026-10-21T11:45:00.000Z',
      views: 115,
    },
    {
      id: 'lst_5',
      ownerId: 'usr_clara',
      ownerName: 'Clara Moreau',
      ownerAvatar: users[1].avatar,
      ownerLocation: 'Paris, France',
      title: 'Oversized Natural Linen Button-Down Shirt',
      description: 'Effortless relaxed silhouette in airy off-white washed linen. Dropped shoulder, chest patch pocket, and genuine shell buttons. Elegant drape over trousers or skirts.',
      category: 'Shirts',
      size: 'M',
      brand: 'De Bonne Facture',
      condition: 'New with tags',
      originalPrice: 175,
      indicativeValue: 110,
      location: 'Paris, France',
      images: ['/src/assets/images/hero_editorial_garments_1792904133219.jpg'],
      material: '100% French Linen',
      color: 'Warm Ivory',
      gender: 'Unisex',
      status: 'available',
      isFeatured: true,
      createdAt: '2026-10-22T08:00:00.000Z',
      updatedAt: '2026-10-22T08:00:00.000Z',
      views: 89,
    },
    {
      id: 'lst_6',
      ownerId: 'usr_arjun',
      ownerName: 'Arjun Mehta',
      ownerAvatar: users[3].avatar,
      ownerLocation: 'Mumbai, India',
      title: 'Chanderi Silk Handwoven Zari Kurta Set',
      description: 'Authentic Chanderi silk tunic with delicate golden zari embroidery along the mandarin neckline and cuffs. Accompanied by silk churidar and sheer organza dupatta.',
      category: 'Ethnic Wear',
      size: 'M',
      brand: 'Raw Mango',
      condition: 'Like new',
      originalPrice: 350,
      indicativeValue: 195,
      location: 'Mumbai, India',
      images: ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80'],
      material: 'Chanderi Silk & Zari',
      color: 'Sage & Gold',
      gender: 'Women',
      status: 'available',
      isFeatured: true,
      createdAt: '2026-10-22T13:20:00.000Z',
      updatedAt: '2026-10-22T13:20:00.000Z',
      views: 204,
    },
    {
      id: 'lst_7',
      ownerId: 'usr_maya',
      ownerName: 'Maya Lin',
      ownerAvatar: users[4].avatar,
      ownerLocation: 'Brooklyn, NY',
      title: 'Minimalist Caroline Structured Leather Shoulder Bag',
      description: 'Crafted from ultra-durable vegan apple leather with a smooth pebbled finish and champagne gold custom hardware. Designed to fit a 13-inch laptop, planner, and daily essentials.',
      category: 'Bags',
      size: 'One Size',
      brand: 'Freja New York',
      condition: 'Like new',
      originalPrice: 280,
      indicativeValue: 165,
      location: 'Brooklyn, NY',
      images: ['https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80'],
      material: 'Bio-based Apple Leather',
      color: 'Chestnut Brown',
      gender: 'Women',
      status: 'available',
      isFeatured: true,
      createdAt: '2026-10-23T10:10:00.000Z',
      updatedAt: '2026-10-23T10:10:00.000Z',
      views: 130,
    },
    {
      id: 'lst_8',
      ownerId: 'usr_maya',
      ownerName: 'Maya Lin',
      ownerAvatar: users[4].avatar,
      ownerLocation: 'Brooklyn, NY',
      title: 'Campo Chrome-Free Leather Low-Top Sneakers',
      description: 'Clean white sustainable sneakers with sage green V-logo. Made from Brazilian chrome-free leather and wild Amazonian rubber soles. Extremely comfortable.',
      category: 'Shoes',
      size: '38 / US 7.5',
      brand: 'Veja',
      condition: 'Like new',
      originalPrice: 175,
      indicativeValue: 95,
      location: 'Brooklyn, NY',
      images: ['https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80'],
      material: 'ChromeFree Leather & Amazonian Rubber',
      color: 'White & Sage',
      gender: 'Unisex',
      status: 'available',
      isFeatured: false,
      createdAt: '2026-10-23T14:00:00.000Z',
      updatedAt: '2026-10-23T14:00:00.000Z',
      views: 74,
    },
    {
      id: 'lst_9',
      ownerId: 'usr_soren',
      ownerName: 'Soren Lind',
      ownerAvatar: users[2].avatar,
      ownerLocation: 'Copenhagen, Denmark',
      title: 'High-Rise Straight Selvedge Raw 501 Jeans',
      description: 'Reissued 1947 specification with Cone Mills red-line selvedge denim. Straight leg, button fly, and natural leather patch. Gently broken in with beautiful natural creases.',
      category: 'Jeans & Pants',
      size: '31/32',
      brand: "Levi's Vintage Clothing",
      condition: 'Gently worn',
      originalPrice: 220,
      indicativeValue: 110,
      location: 'Copenhagen, Denmark',
      images: ['https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=800&q=80'],
      material: '100% Selvedge Denim',
      color: 'Raw Indigo',
      gender: 'Men',
      status: 'available',
      isFeatured: false,
      createdAt: '2026-10-23T15:30:00.000Z',
      updatedAt: '2026-10-23T15:30:00.000Z',
      views: 88,
    },
    {
      id: 'lst_10',
      ownerId: 'usr_admin',
      ownerName: 'Madiha Parkar',
      ownerAvatar: users[0].avatar,
      ownerLocation: 'San Francisco, CA',
      title: 'Hand-Rolled Flora Twill Silk Square Scarf',
      description: 'Lustrous heavyweight 100% mulberry silk twill scarf with hand-rolled edges. Botanical illustrative print in sage, terracotta, and soft ivory. Wear around the neck, hair, or bag handle.',
      category: 'Accessories',
      size: '90cm x 90cm',
      brand: 'Hermès Heritage Vintage',
      condition: 'Like new',
      originalPrice: 320,
      indicativeValue: 175,
      location: 'San Francisco, CA',
      images: ['https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?auto=format&fit=crop&w=800&q=80'],
      material: '100% Mulberry Silk',
      color: 'Sage & Botanical',
      gender: 'Unisex',
      status: 'available',
      isFeatured: false,
      createdAt: '2026-10-23T16:00:00.000Z',
      updatedAt: '2026-10-23T16:00:00.000Z',
      views: 92,
    },
    {
      id: 'lst_11',
      ownerId: 'usr_clara',
      ownerName: 'Clara Moreau',
      ownerAvatar: users[1].avatar,
      ownerLocation: 'Paris, France',
      title: 'Silk Bias-Cut Midi Slip Dress in Olive',
      description: 'Lustrous washable silk with adjustable thin straps and a classic 90s bias drape that contours without clinging. Perfect layered over a t-shirt or dressed up for evenings.',
      category: 'Dresses',
      size: 'S',
      brand: 'Reformation',
      condition: 'New with tags',
      originalPrice: 240,
      indicativeValue: 155,
      location: 'Paris, France',
      images: ['https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80'],
      material: '100% Silk Charmeuse',
      color: 'Olive Green',
      gender: 'Women',
      status: 'available',
      isFeatured: false,
      createdAt: '2026-10-23T17:10:00.000Z',
      updatedAt: '2026-10-23T17:10:00.000Z',
      views: 65,
    },
    {
      id: 'lst_12',
      ownerId: 'usr_arjun',
      ownerName: 'Arjun Mehta',
      ownerAvatar: users[3].avatar,
      ownerLocation: 'Mumbai, India',
      title: 'Botanical Hand-Block Printed Khadi Cotton Shirt',
      description: 'Handspun and handwoven khadi cotton dyed with fermented plant indigo and madder root. Woodblock printed by 4th-generation master artisans in Rajasthan.',
      category: 'Shirts',
      size: 'M',
      brand: 'Story mfg.',
      condition: 'Like new',
      originalPrice: 190,
      indicativeValue: 98,
      location: 'Mumbai, India',
      images: ['https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80'],
      material: '100% Handspun Khadi Cotton',
      color: 'Indigo & Clay',
      gender: 'Men',
      status: 'available',
      isFeatured: false,
      createdAt: '2026-10-23T18:00:00.000Z',
      updatedAt: '2026-10-23T18:00:00.000Z',
      views: 52,
    },
    {
      id: 'lst_13',
      ownerId: 'usr_maya',
      ownerName: 'Maya Lin',
      ownerAvatar: users[4].avatar,
      ownerLocation: 'Brooklyn, NY',
      title: 'Pleated Wide-Leg Organic Cotton Trousers',
      description: 'Deep double forward pleats and clean tapered hem. Made from heavy organic twill that holds its architectural structure throughout the day.',
      category: 'Jeans & Pants',
      size: 'M / 30',
      brand: 'Studio Nicholson',
      condition: 'Like new',
      originalPrice: 245,
      indicativeValue: 135,
      location: 'Brooklyn, NY',
      images: ['https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?auto=format&fit=crop&w=800&q=80'],
      material: '100% Organic Cotton Twill',
      color: 'Warm Beige',
      gender: 'Unisex',
      status: 'available',
      isFeatured: false,
      createdAt: '2026-10-23T18:30:00.000Z',
      updatedAt: '2026-10-23T18:30:00.000Z',
      views: 81,
    },
    {
      id: 'lst_14',
      ownerId: 'usr_soren',
      ownerName: 'Soren Lind',
      ownerAvatar: users[2].avatar,
      ownerLocation: 'Copenhagen, Denmark',
      title: 'Retro-X Windproof Deep Pile Fleece Jacket',
      description: 'Classic Patagonia deep-pile fleece jacket with windproof membrane barrier and recycled nylon chest contrast pocket. Extremely warm and durable.',
      category: 'Jackets & Coats',
      size: 'L',
      brand: 'Patagonia',
      condition: 'Gently worn',
      originalPrice: 229,
      indicativeValue: 90,
      location: 'Copenhagen, Denmark',
      images: ['https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80'],
      material: '85% Recycled Polyester Fleece',
      color: 'Natural Cream & Navy',
      gender: 'Men',
      status: 'available',
      isFeatured: false,
      createdAt: '2026-10-23T19:00:00.000Z',
      updatedAt: '2026-10-23T19:00:00.000Z',
      views: 79,
    },
    {
      id: 'lst_15',
      ownerId: 'usr_arjun',
      ownerName: 'Arjun Mehta',
      ownerAvatar: users[3].avatar,
      ownerLocation: 'Mumbai, India',
      title: 'Handspun Jamdani Cotton Anarkali Tunic',
      description: 'Featherlight muslin khadi cotton woven on a manual pit loom using centuries-old Jamdani geometric motifs. Airy flared silhouette with subtle wooden buttons.',
      category: 'Ethnic Wear',
      size: 'S',
      brand: 'FabIndia Heritage',
      condition: 'Gently worn',
      originalPrice: 160,
      indicativeValue: 75,
      location: 'Mumbai, India',
      images: ['https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80'],
      material: '100% Jamdani Muslin Cotton',
      color: 'Ivory & Ecru',
      gender: 'Women',
      status: 'available',
      isFeatured: false,
      createdAt: '2026-10-23T19:30:00.000Z',
      updatedAt: '2026-10-23T19:30:00.000Z',
      views: 43,
    },
    {
      id: 'lst_16',
      ownerId: 'usr_clara',
      ownerName: 'Clara Moreau',
      ownerAvatar: users[1].avatar,
      ownerLocation: 'Paris, France',
      title: 'Vegetable-Tanned Saddle Leather Demi-Lune Crossbody',
      description: 'Iconic half-moon minimalist shoulder bag in smooth vegetable-tanned Italian leather that develops a rich individual patina with age. Top zip closure with embossed gold logo.',
      category: 'Bags',
      size: 'One Size',
      brand: 'A.P.C.',
      condition: 'Gently worn',
      originalPrice: 380,
      indicativeValue: 170,
      location: 'Paris, France',
      images: ['https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80'],
      material: '100% Vegetable-Tanned Calfskin',
      color: 'Dark Caramel',
      gender: 'Women',
      status: 'available',
      isFeatured: false,
      createdAt: '2026-10-23T20:00:00.000Z',
      updatedAt: '2026-10-23T20:00:00.000Z',
      views: 112,
    },
    {
      id: 'lst_17',
      ownerId: 'usr_admin',
      ownerName: 'Madiha Parkar',
      ownerAvatar: users[0].avatar,
      ownerLocation: 'San Francisco, CA',
      title: 'Relaxed Tapered Linen-Tencel Drawstring Pants',
      description: 'Sustainable eco-friendly blend of European flax and lyocell. Pull-on elasticated waistband with drawstring, side slant pockets, and subtle ankle cuffs.',
      category: 'Jeans & Pants',
      size: 'M',
      brand: 'Eileen Fisher',
      condition: 'Like new',
      originalPrice: 198,
      indicativeValue: 85,
      location: 'San Francisco, CA',
      images: ['https://images.unsplash.com/photo-1517445312882-bc9910d016b7?auto=format&fit=crop&w=800&q=80'],
      material: 'Linen & Tencel Lyocell',
      color: 'Charcoal Grey',
      gender: 'Women',
      status: 'available',
      isFeatured: false,
      createdAt: '2026-10-23T20:45:00.000Z',
      updatedAt: '2026-10-23T20:45:00.000Z',
      views: 58,
    },
    {
      id: 'lst_18',
      ownerId: 'usr_soren',
      ownerName: 'Soren Lind',
      ownerAvatar: users[2].avatar,
      ownerLocation: 'Copenhagen, Denmark',
      title: 'Handcrafted Goodyear-Welted Chelsea Boots',
      description: 'English bench-made Chelsea boots in pull-up burnished brown calf leather with tonal elastic gussets and storm welt commando rubber soles. Resoleable for life.',
      category: 'Shoes',
      size: '42 / US 9',
      brand: 'Grenson',
      condition: 'Gently worn',
      originalPrice: 380,
      indicativeValue: 160,
      location: 'Copenhagen, Denmark',
      images: ['https://images.unsplash.com/photo-1638247025967-b4e38f787b76?auto=format&fit=crop&w=800&q=80'],
      material: 'Full-Grain Calfskin Leather',
      color: 'Dark Chocolate Brown',
      gender: 'Men',
      status: 'available',
      isFeatured: false,
      createdAt: '2026-10-23T21:15:00.000Z',
      updatedAt: '2026-10-23T21:15:00.000Z',
      views: 70,
    },
    {
      id: 'lst_19',
      ownerId: 'usr_clara',
      ownerName: 'Clara Moreau',
      ownerAvatar: users[1].avatar,
      ownerLocation: 'Paris, France',
      title: 'Ribbed Cashmere-Wool Sleeveless Knit Vest',
      description: 'Chic chunky mock-neck vest spun from recycled Italian cashmere and extrafine lambswool. Great over oversized poplin shirts or standalone.',
      category: 'Tops',
      size: 'S',
      brand: 'Sézane',
      condition: 'Like new',
      originalPrice: 145,
      indicativeValue: 78,
      location: 'Paris, France',
      images: ['https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=800&q=80'],
      material: '70% Lambswool, 30% Cashmere',
      color: 'Oatmeal Melange',
      gender: 'Women',
      status: 'available',
      isFeatured: false,
      createdAt: '2026-10-23T21:30:00.000Z',
      updatedAt: '2026-10-23T21:30:00.000Z',
      views: 86,
    },
    {
      id: 'lst_20',
      ownerId: 'usr_arjun',
      ownerName: 'Arjun Mehta',
      ownerAvatar: users[3].avatar,
      ownerLocation: 'Mumbai, India',
      title: 'Ajrakh Natural Dye Modal Silk Saree',
      description: 'Traditional 14-stage block printed Ajrakh saree using pomegranate peel, turmeric, and fermented iron acetate. Soft, fluid modal silk with rich border detailing.',
      category: 'Ethnic Wear',
      size: 'Free Size (5.5m)',
      brand: 'Kalamkari Heritage Collective',
      condition: 'New with tags',
      originalPrice: 210,
      indicativeValue: 140,
      location: 'Mumbai, India',
      images: ['https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80'],
      material: 'Eco-Modal Silk',
      color: 'Madder Red & Indigo',
      gender: 'Women',
      status: 'available',
      isFeatured: false,
      createdAt: '2026-10-23T21:40:00.000Z',
      updatedAt: '2026-10-23T21:40:00.000Z',
      views: 94,
    },
    {
      id: 'lst_21',
      ownerId: 'usr_maya',
      ownerName: 'Maya Lin',
      ownerAvatar: users[4].avatar,
      ownerLocation: 'Brooklyn, NY',
      title: 'Handwoven Alpaca Wool Reversible Fringe Scarf',
      description: 'Ethically sheared baby alpaca fibers woven by cooperatives in the Peruvian Andes. Hypoallergenic, featherlight, and twice as warm as conventional sheep wool.',
      category: 'Accessories',
      size: '200cm x 50cm',
      brand: 'Cuyana',
      condition: 'New with tags',
      originalPrice: 128,
      indicativeValue: 75,
      location: 'Brooklyn, NY',
      images: ['https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?auto=format&fit=crop&w=800&q=80'],
      material: '100% Baby Alpaca Wool',
      color: 'Camel & Biscuit',
      gender: 'Unisex',
      status: 'available',
      isFeatured: false,
      createdAt: '2026-10-23T22:00:00.000Z',
      updatedAt: '2026-10-23T22:00:00.000Z',
      views: 49,
    },
    {
      id: 'lst_22',
      ownerId: 'usr_soren',
      ownerName: 'Soren Lind',
      ownerAvatar: users[2].avatar,
      ownerLocation: 'Copenhagen, Denmark',
      title: 'Heavy Waxed Cotton Canvas & Brass Field Rucksack',
      description: 'Water-resistant British Millerain 18oz waxed canvas with vegetable-tanned bridle leather straps and solid unlacquered brass buckles. Internal padded laptop sleeve.',
      category: 'Bags',
      size: '22 Liters',
      brand: 'Bleu de Chauffe',
      condition: 'Gently worn',
      originalPrice: 310,
      indicativeValue: 145,
      location: 'Copenhagen, Denmark',
      images: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80'],
      material: 'Waxed Canvas & Bridle Leather',
      color: 'Olive Green & Saddle Brown',
      gender: 'Unisex',
      status: 'available',
      isFeatured: false,
      createdAt: '2026-10-23T22:15:00.000Z',
      updatedAt: '2026-10-23T22:15:00.000Z',
      views: 63,
    },
    {
      id: 'lst_23',
      ownerId: 'usr_clara',
      ownerName: 'Clara Moreau',
      ownerAvatar: users[1].avatar,
      ownerLocation: 'Paris, France',
      title: 'Artisanal Woven Leather Huarache Mules',
      description: 'Hand-interlaced vegetable-tanned leather strips crafted in Michoacán. Breathable footbed with shock-absorbing recycled rubber outer sole.',
      category: 'Shoes',
      size: '37 / US 6.5',
      brand: 'Nisolo',
      condition: 'Good',
      originalPrice: 135,
      indicativeValue: 50,
      location: 'Paris, France',
      images: ['https://images.unsplash.com/photo-1562273138-f46be4ebdf33?auto=format&fit=crop&w=800&q=80'],
      material: '100% Woven Cowhide',
      color: 'Natural Tan',
      gender: 'Women',
      status: 'available',
      isFeatured: false,
      createdAt: '2026-10-23T22:30:00.000Z',
      updatedAt: '2026-10-23T22:30:00.000Z',
      views: 55,
    },
    {
      id: 'lst_24',
      ownerId: 'usr_admin',
      ownerName: 'Madiha Parkar',
      ownerAvatar: users[0].avatar,
      ownerLocation: 'San Francisco, CA',
      title: 'Upcycled Boro Patchwork Denim Chore Jacket',
      description: 'Artisanal workwear jacket meticulously constructed from repurposed vintage sashiko-stitched indigo cloths. Each patch tells a unique textile preservation story.',
      category: 'Jackets & Coats',
      size: 'M',
      brand: 'Artisanal Studio',
      condition: 'Like new',
      originalPrice: 380,
      indicativeValue: 210,
      location: 'San Francisco, CA',
      images: ['https://images.unsplash.com/photo-1578932750294-f5075e85f44a?auto=format&fit=crop&w=800&q=80'],
      material: 'Upcycled Vintage Indigo Cotton',
      color: 'Multi Indigo',
      gender: 'Unisex',
      status: 'available',
      isFeatured: false,
      createdAt: '2026-10-23T22:45:00.000Z',
      updatedAt: '2026-10-23T22:45:00.000Z',
      views: 108,
    },
    {
      id: 'lst_25',
      ownerId: 'usr_arjun',
      ownerName: 'Arjun Mehta',
      ownerAvatar: users[3].avatar,
      ownerLocation: 'Mumbai, India',
      title: 'Embroidered Linen Mandarin Waistcoat',
      description: 'Single-breasted bandhgala vest crafted from natural Irish linen with tone-on-tone pick stitching. Antique brass coin buttons and contrast silk interior lining.',
      category: 'Ethnic Wear',
      size: '40 / L',
      brand: 'Nicobar',
      condition: 'Like new',
      originalPrice: 170,
      indicativeValue: 90,
      location: 'Mumbai, India',
      images: ['https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80'],
      material: '100% Irish Linen',
      color: 'Raw Sand',
      gender: 'Men',
      status: 'available',
      isFeatured: false,
      createdAt: '2026-10-23T23:00:00.000Z',
      updatedAt: '2026-10-23T23:00:00.000Z',
      views: 48,
    },
    {
      id: 'lst_26',
      ownerId: 'usr_maya',
      ownerName: 'Maya Lin',
      ownerAvatar: users[4].avatar,
      ownerLocation: 'Brooklyn, NY',
      title: 'Textured Waffle Knit Organic Cotton Henley',
      description: 'Heavyweight organic thermal knit with 3-button placket and uncurling ribbed cuffs. Garment-dyed for a vintage soft hand-feel from day one.',
      category: 'Tops',
      size: 'S',
      brand: 'Nudie Jeans Co',
      condition: 'Like new',
      originalPrice: 98,
      indicativeValue: 48,
      location: 'Brooklyn, NY',
      images: ['https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80'],
      material: '100% Fairtrade Organic Cotton',
      color: 'Washed Sage',
      gender: 'Unisex',
      status: 'available',
      isFeatured: false,
      createdAt: '2026-10-23T23:15:00.000Z',
      updatedAt: '2026-10-23T23:15:00.000Z',
      views: 42,
    },
    {
      id: 'lst_27',
      ownerId: 'usr_clara',
      ownerName: 'Clara Moreau',
      ownerAvatar: users[1].avatar,
      ownerLocation: 'Paris, France',
      title: 'Flared Bohemian Block-Print Maxi Dress',
      description: 'Tiered maxi dress in featherlight cotton voile, patterned with small floral sprays. Features a ruffled neckline and drawstring waist with beaded tassels.',
      category: 'Dresses',
      size: 'L',
      brand: 'Toast',
      condition: 'Gently worn',
      originalPrice: 215,
      indicativeValue: 95,
      location: 'Paris, France',
      images: ['https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=80'],
      material: '100% Cotton Voile',
      color: 'Navy & Rust Floral',
      gender: 'Women',
      status: 'available',
      isFeatured: false,
      createdAt: '2026-10-23T23:30:00.000Z',
      updatedAt: '2026-10-23T23:30:00.000Z',
      views: 61,
    },
    {
      id: 'lst_28',
      ownerId: 'usr_soren',
      ownerName: 'Soren Lind',
      ownerAvatar: users[2].avatar,
      ownerLocation: 'Copenhagen, Denmark',
      title: 'Hand-Cast Brass Pin & Veg-Tan Minimalist Belt',
      description: 'Solid sand-cast unlacquered brass roller buckle paired with 4mm thick English bridle leather strap. Hand-beveled edges and natural wax seal.',
      category: 'Accessories',
      size: '34 / 85cm',
      brand: 'Tanner Goods',
      condition: 'Gently worn',
      originalPrice: 110,
      indicativeValue: 55,
      location: 'Copenhagen, Denmark',
      images: ['https://images.unsplash.com/photo-1624222247344-550fb60583dc?auto=format&fit=crop&w=800&q=80'],
      material: 'English Bridle Leather & Brass',
      color: 'Natural Tan',
      gender: 'Men',
      status: 'available',
      isFeatured: false,
      createdAt: '2026-10-23T23:45:00.000Z',
      updatedAt: '2026-10-23T23:45:00.000Z',
      views: 39,
    },
  ];

  // Demo active and completed swaps
  const swaps: SwapRequest[] = [
    {
      id: 'swp_1',
      targetListingId: 'lst_1',
      targetListingTitle: 'Terracotta Tiered Organic Linen Midi Dress',
      targetListingImage: '/src/assets/images/fashion_linen_dress_1792904133888.jpg',
      targetListingValue: 145,
      targetOwnerId: 'usr_clara',
      targetOwnerName: 'Clara Moreau',
      proposerId: 'usr_admin',
      proposerName: 'Madiha Parkar',
      proposerAvatar: users[0].avatar,
      offeredListingIds: ['lst_2'],
      offeredListings: [
        {
          id: 'lst_2',
          title: 'Tailored Forest Green Belted Trench Coat',
          image: '/src/assets/images/fashion_trench_coat_1792904134314.jpg',
          indicativeValue: 220,
        },
      ],
      status: 'pending',
      proposerMessage: 'Bonjour Clara! I adore this linen dress. Would you consider an exchange for my Margaret Howell trench coat? Both are like-new condition.',
      createdAt: '2026-10-24T12:00:00.000Z',
      updatedAt: '2026-10-24T12:00:00.000Z',
    },
    {
      id: 'swp_2',
      targetListingId: 'lst_3',
      targetListingTitle: 'Chunky Fisherman Cable-Knit Merino Sweater',
      targetListingImage: '/src/assets/images/fashion_knitwear_sweater_1792904136197.jpg',
      targetListingValue: 115,
      targetOwnerId: 'usr_soren',
      targetOwnerName: 'Soren Lind',
      proposerId: 'usr_maya',
      proposerName: 'Maya Lin',
      proposerAvatar: users[4].avatar,
      offeredListingIds: ['lst_8'],
      offeredListings: [
        {
          id: 'lst_8',
          title: 'Campo Chrome-Free Leather Low-Top Sneakers',
          image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80',
          indicativeValue: 95,
        },
      ],
      status: 'accepted',
      proposerMessage: 'Hi Soren! I would love to swap my Veja Campo sneakers for your fisherman cable-knit sweater. Perfect for Brooklyn winter!',
      responseMessage: 'Sounds wonderful Maya! The values are very close. Accepted!',
      createdAt: '2026-10-22T10:00:00.000Z',
      updatedAt: '2026-10-23T08:30:00.000Z',
      scheduledDate: '2026-10-28',
      meetupLocation: 'Postal Tracked Exchange / Packaging via EcoPost',
    },
  ];

  const conversations: Conversation[] = [
    {
      id: 'conv_1',
      participants: ['usr_clara', 'usr_admin'],
      participantDetails: {
        usr_clara: { name: 'Clara Moreau', avatar: users[1].avatar, email: 'clara.moreau@example.com' },
        usr_admin: { name: 'Madiha Parkar', avatar: users[0].avatar, email: 'madihaparkar8@gmail.com' },
      },
      listingId: 'lst_1',
      listingTitle: 'Terracotta Tiered Organic Linen Midi Dress',
      swapRequestId: 'swp_1',
      lastMessage: 'Bonjour Clara! I adore this linen dress. Would you consider an exchange for my Margaret Howell trench coat?',
      lastMessageAt: '2026-10-24T12:00:00.000Z',
      updatedAt: '2026-10-24T12:00:00.000Z',
    },
  ];

  const messages: Message[] = [
    {
      id: 'msg_1',
      conversationId: 'conv_1',
      senderId: 'usr_admin',
      senderName: 'Madiha Parkar',
      senderAvatar: users[0].avatar,
      content: 'Bonjour Clara! I adore this linen dress. Would you consider an exchange for my Margaret Howell trench coat? Both are like-new condition.',
      createdAt: '2026-10-24T12:00:00.000Z',
    },
  ];

  const calendarEvents: CalendarEvent[] = [
    {
      id: 'cal_1',
      userId: 'usr_admin',
      swapRequestId: 'swp_1',
      title: 'Estimated Swap Arrival: Clara (Linen Dress)',
      date: '2026-10-30',
      time: '14:00',
      location: 'San Francisco Courier Drop-off',
      notes: 'Prepare sustainable recycled cardboard mailer with cotton ribbon.',
      partnerName: 'Clara Moreau',
      partnerId: 'usr_clara',
      createdAt: '2026-10-24T12:05:00.000Z',
    },
  ];

  const favorites: Favorite[] = [
    { userId: 'usr_admin', listingId: 'lst_1', createdAt: '2026-10-24T11:00:00.000Z' },
    { userId: 'usr_admin', listingId: 'lst_3', createdAt: '2026-10-24T11:05:00.000Z' },
    { userId: 'usr_admin', listingId: 'lst_6', createdAt: '2026-10-24T11:10:00.000Z' },
  ];

  return {
    users,
    sessions: {},
    listings,
    swaps,
    conversations,
    messages,
    calendarEvents,
    favorites,
    supportInquiries: [],
  };
}

class Database {
  private data: DatabaseSchema;
  private isLoaded = false;

  constructor() {
    this.data = getInitialSeed();
    this.load();
  }

  private load() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }

      if (fs.existsSync(DB_PATH)) {
        const raw = fs.readFileSync(DB_PATH, 'utf-8');
        const parsed = JSON.parse(raw);
        // Ensure all required collections exist
        this.data = {
          users: parsed.users || [],
          sessions: parsed.sessions || {},
          listings: parsed.listings || [],
          swaps: parsed.swaps || [],
          conversations: parsed.conversations || [],
          messages: parsed.messages || [],
          calendarEvents: parsed.calendarEvents || [],
          favorites: parsed.favorites || [],
          supportInquiries: parsed.supportInquiries || [],
        };

        // If listings array is empty or low, re-seed demo listings
        if (this.data.listings.length < 20) {
          const seed = getInitialSeed();
          this.data.listings = seed.listings;
          this.save();
        }
      } else {
        this.save();
      }
      this.isLoaded = true;
    } catch (err) {
      console.error('Error loading database file, initializing with seed data:', err);
      this.data = getInitialSeed();
      this.save();
      this.isLoaded = true;
    }
  }

  private save() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      const tmpPath = `${DB_PATH}.tmp`;
      fs.writeFileSync(tmpPath, JSON.stringify(this.data, null, 2), 'utf-8');
      fs.renameSync(tmpPath, DB_PATH);
    } catch (err) {
      console.error('Error saving database to file:', err);
    }
  }

  // --- Auth & Users ---
  getUserById(id: string): User | undefined {
    return this.data.users.find(u => u.id === id);
  }

  getUserByEmail(email: string): User | undefined {
    return this.data.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  createUser(userData: Omit<User, 'id' | 'memberSince' | 'rating' | 'swapsCompleted'>): User {
    const newUser: User = {
      ...userData,
      id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      memberSince: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      rating: 5.0,
      swapsCompleted: 0,
    };
    this.data.users.push(newUser);
    this.save();
    return newUser;
  }

  updateUser(id: string, updates: Partial<Omit<User, 'id' | 'passwordHash' | 'salt' | 'email'>>): User | null {
    const idx = this.data.users.findIndex(u => u.id === id);
    if (idx === -1) return null;
    this.data.users[idx] = { ...this.data.users[idx], ...updates };
    this.save();
    return this.data.users[idx];
  }

  createSession(userId: string): string {
    const token = crypto.randomBytes(32).toString('hex');
    this.data.sessions[token] = userId;
    this.save();
    return token;
  }

  getUserIdFromSession(token: string): string | undefined {
    return this.data.sessions[token];
  }

  deleteSession(token: string): void {
    delete this.data.sessions[token];
    this.save();
  }

  // --- Listings ---
  getListings(options: {
    category?: string;
    condition?: string;
    size?: string;
    search?: string;
    location?: string;
    sort?: string;
    ownerId?: string;
    status?: string;
  } = {}): Listing[] {
    let list = [...this.data.listings];

    if (options.status) {
      list = list.filter(l => l.status === options.status);
    } else {
      // Default: show available listings
      list = list.filter(l => l.status !== 'swapped');
    }

    if (options.ownerId) {
      list = list.filter(l => l.ownerId === options.ownerId);
    }

    if (options.category && options.category !== 'All') {
      list = list.filter(l => l.category.toLowerCase() === options.category!.toLowerCase());
    }

    if (options.condition && options.condition !== 'All') {
      list = list.filter(l => l.condition === options.condition);
    }

    if (options.size && options.size !== 'All') {
      list = list.filter(l => l.size.toLowerCase().includes(options.size!.toLowerCase()));
    }

    if (options.location && options.location !== 'All') {
      list = list.filter(l => l.location.toLowerCase().includes(options.location!.toLowerCase()));
    }

    if (options.search) {
      const q = options.search.toLowerCase().trim();
      list = list.filter(l =>
        l.title.toLowerCase().includes(q) ||
        l.description.toLowerCase().includes(q) ||
        l.brand.toLowerCase().includes(q) ||
        l.category.toLowerCase().includes(q) ||
        (l.material && l.material.toLowerCase().includes(q))
      );
    }

    // Sorting
    switch (options.sort) {
      case 'value_asc':
        list.sort((a, b) => a.indicativeValue - b.indicativeValue);
        break;
      case 'value_desc':
        list.sort((a, b) => b.indicativeValue - a.indicativeValue);
        break;
      case 'views':
        list.sort((a, b) => (b.views || 0) - (a.views || 0));
        break;
      case 'newest':
      default:
        list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
    }

    return list;
  }

  getListingById(id: string): Listing | undefined {
    const item = this.data.listings.find(l => l.id === id);
    if (item) {
      item.views = (item.views || 0) + 1;
      this.save();
    }
    return item;
  }

  createListing(listingData: Omit<Listing, 'id' | 'createdAt' | 'updatedAt' | 'views'>): Listing {
    const newListing: Listing = {
      ...listingData,
      id: `lst_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      views: 0,
    };
    this.data.listings.unshift(newListing);
    this.save();
    return newListing;
  }

  updateListing(id: string, ownerId: string, updates: Partial<Listing>, isAdmin = false): Listing | null {
    const idx = this.data.listings.findIndex(l => l.id === id);
    if (idx === -1) return null;
    const existing = this.data.listings[idx];
    if (existing.ownerId !== ownerId && !isAdmin) {
      throw new Error('Unauthorized to modify this listing');
    }
    this.data.listings[idx] = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.save();
    return this.data.listings[idx];
  }

  deleteListing(id: string, ownerId: string, isAdmin = false): boolean {
    const idx = this.data.listings.findIndex(l => l.id === id);
    if (idx === -1) return false;
    const existing = this.data.listings[idx];
    if (existing.ownerId !== ownerId && !isAdmin) {
      throw new Error('Unauthorized to delete this listing');
    }
    this.data.listings.splice(idx, 1);
    // Also remove from favorites
    this.data.favorites = this.data.favorites.filter(f => f.listingId !== id);
    this.save();
    return true;
  }

  // --- Favorites ---
  getUserFavorites(userId: string): string[] {
    return this.data.favorites.filter(f => f.userId === userId).map(f => f.listingId);
  }

  toggleFavorite(userId: string, listingId: string): boolean {
    const idx = this.data.favorites.findIndex(f => f.userId === userId && f.listingId === listingId);
    if (idx >= 0) {
      this.data.favorites.splice(idx, 1);
      this.save();
      return false; // Removed
    } else {
      this.data.favorites.push({
        userId,
        listingId,
        createdAt: new Date().toISOString(),
      });
      this.save();
      return true; // Added
    }
  }

  // --- Swaps ---
  getSwapsForUser(userId: string): { incoming: SwapRequest[]; outgoing: SwapRequest[] } {
    const incoming = this.data.swaps.filter(s => s.targetOwnerId === userId);
    const outgoing = this.data.swaps.filter(s => s.proposerId === userId);
    return { incoming, outgoing };
  }

  getSwapById(id: string): SwapRequest | undefined {
    return this.data.swaps.find(s => s.id === id);
  }

  createSwapRequest(payload: {
    proposerId: string;
    targetListingId: string;
    offeredListingIds: string[];
    message: string;
  }): SwapRequest {
    const targetListing = this.getListingById(payload.targetListingId);
    if (!targetListing) throw new Error('Target listing does not exist');
    if (targetListing.ownerId === payload.proposerId) {
      throw new Error('You cannot swap an item with yourself');
    }
    if (targetListing.status !== 'available') {
      throw new Error('Target item is currently not available for swaps');
    }

    // Check duplicate pending request
    const existingPending = this.data.swaps.find(
      s => s.proposerId === payload.proposerId &&
           s.targetListingId === payload.targetListingId &&
           s.status === 'pending'
    );
    if (existingPending) {
      throw new Error('An active swap request for this item is already pending');
    }

    const proposer = this.getUserById(payload.proposerId);
    if (!proposer) throw new Error('Proposer not found');

    const offeredItems = this.data.listings.filter(
      l => payload.offeredListingIds.includes(l.id) && l.ownerId === payload.proposerId && l.status === 'available'
    );
    if (offeredItems.length === 0) {
      throw new Error('Must offer at least one available item from your wardrobe');
    }

    const newSwap: SwapRequest = {
      id: `swp_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      targetListingId: targetListing.id,
      targetListingTitle: targetListing.title,
      targetListingImage: targetListing.images[0] || '',
      targetListingValue: targetListing.indicativeValue,
      targetOwnerId: targetListing.ownerId,
      targetOwnerName: targetListing.ownerName,
      proposerId: proposer.id,
      proposerName: proposer.name,
      proposerAvatar: proposer.avatar,
      offeredListingIds: offeredItems.map(i => i.id),
      offeredListings: offeredItems.map(i => ({
        id: i.id,
        title: i.title,
        image: i.images[0] || '',
        indicativeValue: i.indicativeValue,
      })),
      status: 'pending',
      proposerMessage: payload.message || 'I would like to propose a swap for this piece.',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.data.swaps.unshift(newSwap);

    // Auto-create initial message in conversation
    const conv = this.getOrCreateConversation(proposer.id, targetListing.ownerId, targetListing.id, newSwap.id);
    this.addMessage(conv.id, proposer.id, payload.message || `Hi ${targetListing.ownerName}, I sent a swap proposal for your ${targetListing.title}!`);

    this.save();
    return newSwap;
  }

  updateSwapStatus(
    swapId: string,
    userId: string,
    status: 'accepted' | 'rejected' | 'cancelled' | 'completed',
    responseMessage?: string,
    scheduledDate?: string,
    meetupLocation?: string
  ): SwapRequest {
    const swap = this.data.swaps.find(s => s.id === swapId);
    if (!swap) throw new Error('Swap request not found');

    const isTargetOwner = swap.targetOwnerId === userId;
    const isProposer = swap.proposerId === userId;

    if (!isTargetOwner && !isProposer) {
      throw new Error('Not authorized to update this swap request');
    }

    // Role state validations
    if (status === 'accepted' || status === 'rejected') {
      if (!isTargetOwner) throw new Error('Only the recipient can accept or reject a swap request');
      if (swap.status !== 'pending') throw new Error(`Cannot ${status} a swap that is ${swap.status}`);
    }

    if (status === 'cancelled') {
      if (!isProposer) throw new Error('Only the proposer can cancel a pending swap');
      if (swap.status !== 'pending') throw new Error('Cannot cancel a non-pending swap');
    }

    if (status === 'completed') {
      if (swap.status !== 'accepted') throw new Error('Only accepted swaps can be marked as completed');
    }

    swap.status = status;
    swap.updatedAt = new Date().toISOString();
    if (responseMessage) swap.responseMessage = responseMessage;
    if (scheduledDate) swap.scheduledDate = scheduledDate;
    if (meetupLocation) swap.meetupLocation = meetupLocation;

    // Side effects on listing statuses
    if (status === 'accepted') {
      // Mark items as in_swap
      const target = this.data.listings.find(l => l.id === swap.targetListingId);
      if (target) target.status = 'in_swap';
      swap.offeredListingIds.forEach(id => {
        const item = this.data.listings.find(l => l.id === id);
        if (item) item.status = 'in_swap';
      });

      // Auto-schedule calendar event if date specified
      if (scheduledDate) {
        this.addCalendarEvent({
          userId: swap.targetOwnerId,
          swapRequestId: swap.id,
          title: `Exchange with ${swap.proposerName}`,
          date: scheduledDate,
          time: '14:00',
          location: meetupLocation || 'Designated exchange point / Mailer',
          notes: `Swap items: ${swap.targetListingTitle} <-> ${swap.offeredListings.map(o => o.title).join(', ')}`,
          partnerName: swap.proposerName,
          partnerId: swap.proposerId,
        });
      }
    } else if (status === 'completed') {
      // Mark items as swapped
      const target = this.data.listings.find(l => l.id === swap.targetListingId);
      if (target) target.status = 'swapped';
      swap.offeredListingIds.forEach(id => {
        const item = this.data.listings.find(l => l.id === id);
        if (item) item.status = 'swapped';
      });

      // Increment swapsCompleted for both users
      const targetUser = this.data.users.find(u => u.id === swap.targetOwnerId);
      if (targetUser) targetUser.swapsCompleted = (targetUser.swapsCompleted || 0) + 1;
      const propUser = this.data.users.find(u => u.id === swap.proposerId);
      if (propUser) propUser.swapsCompleted = (propUser.swapsCompleted || 0) + 1;
    } else if (status === 'rejected' || status === 'cancelled') {
      // Return items to available if previously locked
      const target = this.data.listings.find(l => l.id === swap.targetListingId);
      if (target && target.status === 'in_swap') target.status = 'available';
      swap.offeredListingIds.forEach(id => {
        const item = this.data.listings.find(l => l.id === id);
        if (item && item.status === 'in_swap') item.status = 'available';
      });
    }

    this.save();
    return swap;
  }

  // --- Conversations & Messages ---
  getOrCreateConversation(userId1: string, userId2: string, listingId?: string, swapRequestId?: string): Conversation {
    const existing = this.data.conversations.find(
      c => c.participants.includes(userId1) &&
           c.participants.includes(userId2) &&
           (!listingId || c.listingId === listingId)
    );
    if (existing) return existing;

    const u1 = this.getUserById(userId1);
    const u2 = this.getUserById(userId2);
    const listing = listingId ? this.getListingById(listingId) : undefined;

    const newConv: Conversation = {
      id: `conv_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      participants: [userId1, userId2],
      participantDetails: {
        [userId1]: { name: u1?.name || 'User', avatar: u1?.avatar || '', email: u1?.email || '' },
        [userId2]: { name: u2?.name || 'User', avatar: u2?.avatar || '', email: u2?.email || '' },
      },
      listingId,
      listingTitle: listing?.title,
      swapRequestId,
      lastMessage: 'Conversation started',
      lastMessageAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.data.conversations.unshift(newConv);
    this.save();
    return newConv;
  }

  getUserConversations(userId: string): Conversation[] {
    return this.data.conversations
      .filter(c => c.participants.includes(userId))
      .sort((a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime());
  }

  getMessages(conversationId: string, userId: string): Message[] {
    const conv = this.data.conversations.find(c => c.id === conversationId);
    if (!conv || !conv.participants.includes(userId)) {
      throw new Error('Unauthorized or conversation not found');
    }
    return this.data.messages.filter(m => m.conversationId === conversationId);
  }

  addMessage(conversationId: string, senderId: string, content: string): Message {
    const conv = this.data.conversations.find(c => c.id === conversationId);
    if (!conv) throw new Error('Conversation not found');
    const sender = this.getUserById(senderId);

    const msg: Message = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      conversationId,
      senderId,
      senderName: sender?.name || 'Member',
      senderAvatar: sender?.avatar || '',
      content,
      createdAt: new Date().toISOString(),
    };

    this.data.messages.push(msg);
    conv.lastMessage = content;
    conv.lastMessageAt = msg.createdAt;
    conv.updatedAt = msg.createdAt;
    this.save();
    return msg;
  }

  // --- Calendar Events ---
  getCalendarEvents(userId: string): CalendarEvent[] {
    return this.data.calendarEvents
      .filter(e => e.userId === userId || e.partnerId === userId)
      .sort((a, b) => a.date.localeCompare(b.date));
  }

  addCalendarEvent(eventData: Omit<CalendarEvent, 'id' | 'createdAt'>): CalendarEvent {
    const newEvent: CalendarEvent = {
      ...eventData,
      id: `cal_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      createdAt: new Date().toISOString(),
    };
    this.data.calendarEvents.push(newEvent);
    this.save();
    return newEvent;
  }

  deleteCalendarEvent(id: string, userId: string): boolean {
    const idx = this.data.calendarEvents.findIndex(e => e.id === id && e.userId === userId);
    if (idx === -1) return false;
    this.data.calendarEvents.splice(idx, 1);
    this.save();
    return true;
  }

  // --- Support ---
  createSupportInquiry(data: Omit<SupportInquiry, 'id' | 'createdAt' | 'status'>): SupportInquiry {
    const inquiry: SupportInquiry = {
      ...data,
      id: `inq_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      createdAt: new Date().toISOString(),
      status: 'new',
    };
    this.data.supportInquiries.unshift(inquiry);
    this.save();
    return inquiry;
  }

  // --- Admin Stats ---
  getAdminStats() {
    return {
      totalUsers: this.data.users.length,
      totalListings: this.data.listings.length,
      availableListings: this.data.listings.filter(l => l.status === 'available').length,
      inSwapListings: this.data.listings.filter(l => l.status === 'in_swap').length,
      swappedListings: this.data.listings.filter(l => l.status === 'swapped').length,
      totalSwaps: this.data.swaps.length,
      completedSwaps: this.data.swaps.filter(s => s.status === 'completed').length,
      pendingSwaps: this.data.swaps.filter(s => s.status === 'pending').length,
      totalMessages: this.data.messages.length,
      supportInquiriesCount: this.data.supportInquiries.length,
      categoryDistribution: this.data.listings.reduce((acc, l) => {
        acc[l.category] = (acc[l.category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
    };
  }

  getAllListingsForAdmin(): Listing[] {
    return [...this.data.listings];
  }
}

export const db = new Database();
