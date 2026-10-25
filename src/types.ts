export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  bio: string;
  location: string;
  preferredSizes: string[];
  memberSince: string;
  role: 'admin' | 'user';
  rating: number;
  swapsCompleted: number;
}

export type GarmentCondition = 'New with tags' | 'Like new' | 'Gently worn' | 'Good';

export type GarmentCategory =
  | 'Tops'
  | 'Shirts'
  | 'Jeans & Pants'
  | 'Dresses'
  | 'Jackets & Coats'
  | 'Ethnic Wear'
  | 'Shoes'
  | 'Bags'
  | 'Accessories';

export interface Listing {
  id: string;
  ownerId: string;
  ownerName: string;
  ownerAvatar: string;
  ownerLocation: string;
  title: string;
  description: string;
  category: GarmentCategory | string;
  size: string;
  brand: string;
  condition: GarmentCondition;
  originalPrice: number;
  indicativeValue: number;
  location: string;
  images: string[];
  material?: string;
  color?: string;
  gender?: 'Women' | 'Men' | 'Unisex';
  status: 'available' | 'in_swap' | 'swapped';
  isFeatured?: boolean;
  isFavorited?: boolean;
  createdAt: string;
  updatedAt: string;
  views?: number;
  owner?: {
    id: string;
    name: string;
    avatar: string;
    bio: string;
    location: string;
    rating: number;
    swapsCompleted: number;
    memberSince: string;
  } | null;
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

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  content: string;
  createdAt: string;
}

export interface CalendarEvent {
  id: string;
  userId: string;
  swapRequestId: string;
  title: string;
  date: string;
  time: string;
  location: string;
  notes: string;
  partnerName: string;
  partnerId: string;
  createdAt: string;
}

export interface AdminStats {
  totalUsers: number;
  totalListings: number;
  availableListings: number;
  inSwapListings: number;
  swappedListings: number;
  totalSwaps: number;
  completedSwaps: number;
  pendingSwaps: number;
  totalMessages: number;
  supportInquiriesCount: number;
  categoryDistribution: Record<string, number>;
}
