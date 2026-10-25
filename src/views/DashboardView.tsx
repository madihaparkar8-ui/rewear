import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import {
  Listing,
  SwapRequest,
  Conversation,
  Message,
  CalendarEvent,
} from '../types.ts';
import { ListingCard } from '../components/ListingCard.tsx';
import {
  User as UserIcon,
  Shirt,
  Repeat,
  MessageSquare,
  Heart,
  Calendar as CalendarIcon,
  PlusCircle,
  Clock,
  CheckCircle,
  XCircle,
  MapPin,
  Send,
  AlertCircle,
  Trash2,
  Edit3,
  CalendarPlus,
} from 'lucide-react';

interface DashboardViewProps {
  initialTab?: string;
  userListings: Listing[];
  favorites: Listing[];
  onOpenCreateListing: () => void;
  onEditListing: (listing: Listing) => void;
  onDeleteListing: (listingId: string) => void;
  onSelectListing: (listing: Listing) => void;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  onRefreshData: () => Promise<void>;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  initialTab = 'wardrobe',
  userListings,
  favorites,
  onOpenCreateListing,
  onEditListing,
  onDeleteListing,
  onSelectListing,
  onToggleFavorite,
  onRefreshData,
}) => {
  const { user, authHeaders, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<string>(initialTab);

  // Swaps state
  const [incomingSwaps, setIncomingSwaps] = useState<SwapRequest[]>([]);
  const [outgoingSwaps, setOutgoingSwaps] = useState<SwapRequest[]>([]);
  const [swapsLoading, setSwapsLoading] = useState(false);

  // Conversations state
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConvId, setSelectedConvId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessageText, setNewMessageText] = useState('');
  const [sendingMsg, setSendingMsg] = useState(false);

  // Calendar state
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  const [newCalTitle, setNewCalTitle] = useState('');
  const [newCalDate, setNewCalDate] = useState('');
  const [newCalLocation, setNewCalLocation] = useState('');
  const [newCalNotes, setNewCalNotes] = useState('');

  // Profile Edit State
  const [profileName, setProfileName] = useState(user?.name || '');
  const [profileBio, setProfileBio] = useState(user?.bio || '');
  const [profileLocation, setProfileLocation] = useState(user?.location || '');
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [profileSaving, setProfileSaving] = useState(false);

  // Status feedback
  const [actionError, setActionError] = useState<string | null>(null);

  // Fetch swaps
  const fetchSwaps = async () => {
    try {
      setSwapsLoading(true);
      const res = await fetch('/api/swaps', { headers: authHeaders() });
      if (res.ok) {
        const data = await res.json();
        setIncomingSwaps(data.incoming || []);
        setOutgoingSwaps(data.outgoing || []);
      }
    } catch (err) {
      console.error('Error fetching swaps:', err);
    } finally {
      setSwapsLoading(false);
    }
  };

  // Fetch conversations
  const fetchConversations = async () => {
    try {
      const res = await fetch('/api/conversations', { headers: authHeaders() });
      if (res.ok) {
        const data = await res.json();
        setConversations(data.conversations || []);
        if (data.conversations?.length > 0 && !selectedConvId) {
          setSelectedConvId(data.conversations[0].id);
        }
      }
    } catch (err) {
      console.error('Error fetching conversations:', err);
    }
  };

  // Fetch messages for selected conversation
  const fetchMessages = async (convId: string) => {
    try {
      const res = await fetch(`/api/conversations/${convId}/messages`, {
        headers: authHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages || []);
      }
    } catch (err) {
      console.error('Error fetching messages:', err);
    }
  };

  // Fetch calendar events
  const fetchCalendar = async () => {
    try {
      const res = await fetch('/api/calendar', { headers: authHeaders() });
      if (res.ok) {
        const data = await res.json();
        setCalendarEvents(data.events || []);
      }
    } catch (err) {
      console.error('Error fetching calendar:', err);
    }
  };

  useEffect(() => {
    fetchSwaps();
    fetchConversations();
    fetchCalendar();
  }, [user]);

  useEffect(() => {
    if (selectedConvId) {
      fetchMessages(selectedConvId);
    }
  }, [selectedConvId]);

  // Handle Swap Status Update (Accept, Reject, Cancel, Complete)
  const handleUpdateSwapStatus = async (
    swapId: string,
    status: 'accepted' | 'rejected' | 'cancelled' | 'completed',
    scheduledDate?: string
  ) => {
    setActionError(null);
    try {
      const res = await fetch(`/api/swaps/${swapId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders(),
        },
        body: JSON.stringify({
          status,
          scheduledDate: scheduledDate || new Date().toISOString().split('T')[0],
          meetupLocation: 'Tracked Postal Exchange / Designated drop-point',
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to update swap status');
      }

      await fetchSwaps();
      await onRefreshData();
      await fetchCalendar();
    } catch (err: any) {
      setActionError(err.message || 'Error updating swap request');
    }
  };

  // Send Chat Message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedConvId || !newMessageText.trim()) return;

    try {
      setSendingMsg(true);
      const res = await fetch(`/api/conversations/${selectedConvId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders(),
        },
        body: JSON.stringify({ content: newMessageText.trim() }),
      });

      if (res.ok) {
        setNewMessageText('');
        await fetchMessages(selectedConvId);
        await fetchConversations();
      }
    } catch (err) {
      console.error('Error sending message:', err);
    } finally {
      setSendingMsg(false);
    }
  };

  // Add Calendar Event
  const handleAddCalendarEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCalTitle.trim() || !newCalDate) return;

    try {
      const res = await fetch('/api/calendar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders(),
        },
        body: JSON.stringify({
          title: newCalTitle.trim(),
          date: newCalDate,
          location: newCalLocation.trim() || 'Tracked delivery mailer',
          notes: newCalNotes.trim(),
        }),
      });

      if (res.ok) {
        setNewCalTitle('');
        setNewCalDate('');
        setNewCalLocation('');
        setNewCalNotes('');
        await fetchCalendar();
      }
    } catch (err) {
      console.error('Error creating calendar event:', err);
    }
  };

  const handleDeleteCalendarEvent = async (id: string) => {
    try {
      await fetch(`/api/calendar/${id}`, {
        method: 'DELETE',
        headers: authHeaders(),
      });
      await fetchCalendar();
    } catch (err) {
      console.error('Error deleting calendar event:', err);
    }
  };

  // Save Profile
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setProfileSaving(true);
      setProfileSuccess(false);
      await updateProfile({
        name: profileName.trim(),
        bio: profileBio.trim(),
        location: profileLocation.trim(),
      });
      setProfileSuccess(true);
      setTimeout(() => setProfileSuccess(false), 3000);
    } catch (err: any) {
      setActionError(err.message || 'Failed to update profile');
    } finally {
      setProfileSaving(false);
    }
  };

  if (!user) {
    return (
      <div className="max-w-xl mx-auto py-16 px-4 text-center">
        <p className="font-serif text-2xl font-bold text-[#24483D]">
          Please log in to view your dashboard
        </p>
      </div>
    );
  }

  const selectedConversation = conversations.find((c) => c.id === selectedConvId);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* User Header Profile Card */}
      <div className="bg-white rounded-xl border border-[#E9E1D5] p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={user.avatar}
            alt={user.name}
            referrerPolicy="no-referrer"
            className="w-16 h-16 rounded-full object-cover border-2 border-[#A8B8A0]"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif text-2xl font-bold text-[#24483D]">{user.name}</h1>
              <span className="text-[10px] text-[#24483D] font-semibold bg-[#A8B8A0]/20 px-2 py-0.5 rounded">
                {user.role === 'admin' ? 'Curator & Admin' : 'Active Member'}
              </span>
            </div>
            <p className="text-xs text-[#262A27]/70 mt-0.5 flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-[#A8B8A0]" />
              <span>{user.location}</span>
              <span>·</span>
              <span>Member since {user.memberSince}</span>
            </p>
            <p className="text-xs text-[#262A27]/80 mt-1 max-w-lg">{user.bio}</p>
          </div>
        </div>

        {/* Stats Badges */}
        <div className="flex items-center gap-6 border-t md:border-t-0 md:border-l border-[#E9E1D5] pt-4 md:pt-0 md:pl-6 text-xs">
          <div>
            <span className="font-serif text-2xl font-bold text-[#24483D] tabular-nums block">
              {userListings.length}
            </span>
            <span className="text-[11px] text-[#262A27]/60">Listed Items</span>
          </div>
          <div>
            <span className="font-serif text-2xl font-bold text-[#24483D] tabular-nums block">
              {user.swapsCompleted ?? 0}
            </span>
            <span className="text-[11px] text-[#262A27]/60">Completed Swaps</span>
          </div>
          <div>
            <span className="font-serif text-2xl font-bold text-[#24483D] tabular-nums block">
              {favorites.length}
            </span>
            <span className="text-[11px] text-[#262A27]/60">Saved Items</span>
          </div>
        </div>
      </div>

      {actionError && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-md text-xs text-rose-800 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <span>{actionError}</span>
        </div>
      )}

      {/* Dashboard Navigation Tabs */}
      <div className="flex border-b border-[#E9E1D5] overflow-x-auto gap-2">
        <button
          onClick={() => setActiveTab('wardrobe')}
          className={`py-3 px-4 text-xs font-semibold whitespace-nowrap border-b-2 flex items-center gap-2 cursor-pointer transition-colors ${
            activeTab === 'wardrobe'
              ? 'border-[#24483D] text-[#24483D]'
              : 'border-transparent text-[#262A27]/60 hover:text-[#262A27]'
          }`}
        >
          <Shirt className="w-4 h-4" />
          <span>My Wardrobe ({userListings.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('swaps')}
          className={`py-3 px-4 text-xs font-semibold whitespace-nowrap border-b-2 flex items-center gap-2 cursor-pointer transition-colors ${
            activeTab === 'swaps'
              ? 'border-[#24483D] text-[#24483D]'
              : 'border-transparent text-[#262A27]/60 hover:text-[#262A27]'
          }`}
        >
          <Repeat className="w-4 h-4" />
          <span>
            Swap Requests ({incomingSwaps.length + outgoingSwaps.length})
          </span>
        </button>

        <button
          onClick={() => setActiveTab('messages')}
          className={`py-3 px-4 text-xs font-semibold whitespace-nowrap border-b-2 flex items-center gap-2 cursor-pointer transition-colors ${
            activeTab === 'messages'
              ? 'border-[#24483D] text-[#24483D]'
              : 'border-transparent text-[#262A27]/60 hover:text-[#262A27]'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Conversations ({conversations.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('calendar')}
          className={`py-3 px-4 text-xs font-semibold whitespace-nowrap border-b-2 flex items-center gap-2 cursor-pointer transition-colors ${
            activeTab === 'calendar'
              ? 'border-[#24483D] text-[#24483D]'
              : 'border-transparent text-[#262A27]/60 hover:text-[#262A27]'
          }`}
        >
          <CalendarIcon className="w-4 h-4" />
          <span>Swap Calendar ({calendarEvents.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('favorites')}
          className={`py-3 px-4 text-xs font-semibold whitespace-nowrap border-b-2 flex items-center gap-2 cursor-pointer transition-colors ${
            activeTab === 'favorites'
              ? 'border-[#24483D] text-[#24483D]'
              : 'border-transparent text-[#262A27]/60 hover:text-[#262A27]'
          }`}
        >
          <Heart className="w-4 h-4" />
          <span>Saved Pieces ({favorites.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`py-3 px-4 text-xs font-semibold whitespace-nowrap border-b-2 flex items-center gap-2 cursor-pointer transition-colors ${
            activeTab === 'profile'
              ? 'border-[#24483D] text-[#24483D]'
              : 'border-transparent text-[#262A27]/60 hover:text-[#262A27]'
          }`}
        >
          <UserIcon className="w-4 h-4" />
          <span>Profile Settings</span>
        </button>
      </div>

      {/* TAB 1: My Wardrobe */}
      {activeTab === 'wardrobe' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-serif text-2xl font-bold text-[#24483D]">
                My Listed Garments
              </h2>
              <p className="text-xs text-[#262A27]/70">
                Manage your available items, track active exchanges, or publish new pieces.
              </p>
            </div>
            <button
              onClick={onOpenCreateListing}
              className="px-4 py-2 text-xs font-semibold text-white bg-[#24483D] hover:bg-[#1a342c] rounded-md transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>List a New Garment</span>
            </button>
          </div>

          {userListings.length === 0 ? (
            <div className="bg-white rounded-xl border border-[#E9E1D5] p-12 text-center space-y-3">
              <Shirt className="w-10 h-10 text-gray-300 mx-auto" />
              <p className="font-serif text-xl font-bold text-[#24483D]">
                Your wardrobe is currently empty
              </p>
              <p className="text-xs text-[#262A27]/70 max-w-sm mx-auto">
                List pre-loved garments to start receiving swap proposals from members worldwide.
              </p>
              <div className="pt-2">
                <button
                  onClick={onOpenCreateListing}
                  className="px-4 py-2 text-xs font-semibold text-white bg-[#24483D] rounded-md hover:bg-[#1a342c] cursor-pointer"
                >
                  List Your First Piece
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {userListings.map((item) => (
                <div key={item.id} className="relative flex flex-col">
                  <ListingCard
                    listing={item}
                    onClick={onSelectListing}
                    onToggleFavorite={onToggleFavorite}
                  />
                  {/* Quick Edit/Delete bar below card */}
                  <div className="mt-2 flex items-center justify-between px-2 text-xs">
                    <span
                      className={`text-[10px] uppercase font-semibold px-2 py-0.5 rounded ${
                        item.status === 'available'
                          ? 'bg-emerald-100 text-emerald-800'
                          : item.status === 'in_swap'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {item.status === 'available' ? 'Available' : item.status === 'in_swap' ? 'In Swap' : 'Swapped'}
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditListing(item);
                        }}
                        className="text-[#24483D] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteListing(item.id);
                        }}
                        className="text-rose-600 hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Swap Requests */}
      {activeTab === 'swaps' && (
        <div className="space-y-8">
          
          {/* Incoming Swaps */}
          <div>
            <div className="mb-4">
              <h3 className="font-serif text-xl font-bold text-[#24483D]">
                Incoming Swap Requests ({incomingSwaps.length})
              </h3>
              <p className="text-xs text-[#262A27]/70">
                Other community members offering exchanges for your wardrobe items.
              </p>
            </div>

            {incomingSwaps.length === 0 ? (
              <div className="bg-white rounded-lg border border-[#E9E1D5] p-6 text-center text-xs text-[#262A27]/60">
                No incoming swap requests at this time.
              </div>
            ) : (
              <div className="space-y-4">
                {incomingSwaps.map((swap) => (
                  <div
                    key={swap.id}
                    className="bg-white rounded-xl border border-[#E9E1D5] p-5 shadow-xs space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-[#F8F6F0]">
                      <div className="flex items-center gap-3">
                        <img
                          src={swap.proposerAvatar}
                          alt={swap.proposerName}
                          className="w-9 h-9 rounded-full object-cover"
                        />
                        <div>
                          <p className="font-semibold text-xs text-[#24483D]">
                            {swap.proposerName} wants to swap with you
                          </p>
                          <p className="text-[11px] text-gray-500">
                            Sent {new Date(swap.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <span
                        className={`text-xs font-semibold px-2.5 py-1 rounded capitalize ${
                          swap.status === 'pending'
                            ? 'bg-amber-100 text-amber-800'
                            : swap.status === 'accepted'
                            ? 'bg-emerald-100 text-emerald-800'
                            : swap.status === 'completed'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        Status: {swap.status}
                      </span>
                    </div>

                    {/* Side by side items */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div className="p-3 rounded-lg bg-[#F8F6F0] flex items-center gap-3">
                        <img
                          src={swap.targetListingImage}
                          alt={swap.targetListingTitle}
                          className="w-14 h-14 rounded object-cover"
                        />
                        <div className="min-w-0">
                          <span className="text-[10px] text-gray-500 uppercase block">Your Piece</span>
                          <p className="font-semibold text-[#24483D] truncate">{swap.targetListingTitle}</p>
                          <p className="text-xs font-bold text-[#C77D62] tabular-nums">${swap.targetListingValue}</p>
                        </div>
                      </div>

                      <div className="p-3 rounded-lg bg-[#F8F6F0] flex items-center gap-3">
                        <img
                          src={swap.offeredListings[0]?.image}
                          alt={swap.offeredListings[0]?.title}
                          className="w-14 h-14 rounded object-cover"
                        />
                        <div className="min-w-0">
                          <span className="text-[10px] text-gray-500 uppercase block">Their Offer</span>
                          <p className="font-semibold text-[#24483D] truncate">{swap.offeredListings[0]?.title}</p>
                          <p className="text-xs font-bold text-[#C77D62] tabular-nums">${swap.offeredListings[0]?.indicativeValue}</p>
                        </div>
                      </div>
                    </div>

                    {/* Note */}
                    {swap.proposerMessage && (
                      <p className="text-xs text-[#262A27]/80 italic bg-[#F8F6F0]/50 p-2.5 rounded">
                        "{swap.proposerMessage}"
                      </p>
                    )}

                    {/* Actions */}
                    {swap.status === 'pending' && (
                      <div className="flex items-center gap-3 pt-2">
                        <button
                          onClick={() => handleUpdateSwapStatus(swap.id, 'accepted')}
                          className="px-4 py-2 text-xs font-semibold text-white bg-[#24483D] hover:bg-[#1a342c] rounded-md transition-all cursor-pointer"
                        >
                          Accept Swap Proposal
                        </button>
                        <button
                          onClick={() => handleUpdateSwapStatus(swap.id, 'rejected')}
                          className="px-4 py-2 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-md transition-all cursor-pointer"
                        >
                          Decline
                        </button>
                      </div>
                    )}

                    {swap.status === 'accepted' && (
                      <div className="flex items-center justify-between pt-2">
                        <p className="text-xs text-emerald-800 font-medium">
                          Exchange accepted! Coordinate shipping or meetup details.
                        </p>
                        <button
                          onClick={() => handleUpdateSwapStatus(swap.id, 'completed')}
                          className="px-4 py-2 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-md transition-all cursor-pointer"
                        >
                          Mark Completed
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Outgoing Swaps */}
          <div>
            <div className="mb-4">
              <h3 className="font-serif text-xl font-bold text-[#24483D]">
                Outgoing Swap Proposals ({outgoingSwaps.length})
              </h3>
              <p className="text-xs text-[#262A27]/70">
                Proposals you have sent to other members for their garments.
              </p>
            </div>

            {outgoingSwaps.length === 0 ? (
              <div className="bg-white rounded-lg border border-[#E9E1D5] p-6 text-center text-xs text-[#262A27]/60">
                You have not submitted any swap proposals yet.
              </div>
            ) : (
              <div className="space-y-4">
                {outgoingSwaps.map((swap) => (
                  <div
                    key={swap.id}
                    className="bg-white rounded-xl border border-[#E9E1D5] p-5 shadow-xs space-y-4"
                  >
                    <div className="flex items-center justify-between pb-3 border-b border-[#F8F6F0]">
                      <div>
                        <p className="font-semibold text-xs text-[#24483D]">
                          Proposal to {swap.targetOwnerName}
                        </p>
                        <p className="text-[11px] text-gray-500">
                          Proposed {new Date(swap.createdAt).toLocaleDateString()}
                        </p>
                      </div>

                      <span
                        className={`text-xs font-semibold px-2.5 py-1 rounded capitalize ${
                          swap.status === 'pending'
                            ? 'bg-amber-100 text-amber-800'
                            : swap.status === 'accepted'
                            ? 'bg-emerald-100 text-emerald-800'
                            : swap.status === 'completed'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        Status: {swap.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div className="p-3 rounded-lg bg-[#F8F6F0] flex items-center gap-3">
                        <img
                          src={swap.targetListingImage}
                          alt={swap.targetListingTitle}
                          className="w-14 h-14 rounded object-cover"
                        />
                        <div className="min-w-0">
                          <span className="text-[10px] text-gray-500 uppercase block">Requested Piece</span>
                          <p className="font-semibold text-[#24483D] truncate">{swap.targetListingTitle}</p>
                          <p className="text-xs font-bold text-[#C77D62] tabular-nums">${swap.targetListingValue}</p>
                        </div>
                      </div>

                      <div className="p-3 rounded-lg bg-[#F8F6F0] flex items-center gap-3">
                        <img
                          src={swap.offeredListings[0]?.image}
                          alt={swap.offeredListings[0]?.title}
                          className="w-14 h-14 rounded object-cover"
                        />
                        <div className="min-w-0">
                          <span className="text-[10px] text-gray-500 uppercase block">You Offered</span>
                          <p className="font-semibold text-[#24483D] truncate">{swap.offeredListings[0]?.title}</p>
                          <p className="text-xs font-bold text-[#C77D62] tabular-nums">${swap.offeredListings[0]?.indicativeValue}</p>
                        </div>
                      </div>
                    </div>

                    {swap.status === 'pending' && (
                      <div className="pt-2 flex justify-end">
                        <button
                          onClick={() => handleUpdateSwapStatus(swap.id, 'cancelled')}
                          className="px-3.5 py-1.5 text-xs text-rose-700 hover:bg-rose-50 rounded border border-rose-200 cursor-pointer"
                        >
                          Cancel Proposal
                        </button>
                      </div>
                    )}

                    {swap.status === 'accepted' && (
                      <div className="flex items-center justify-between pt-2">
                        <p className="text-xs text-emerald-800 font-medium">
                          The member accepted your swap! Prepare your package.
                        </p>
                        <button
                          onClick={() => handleUpdateSwapStatus(swap.id, 'completed')}
                          className="px-4 py-2 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-md transition-all cursor-pointer"
                        >
                          Mark Completed
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: Conversations & Real-time Chat */}
      {activeTab === 'messages' && (
        <div className="bg-white rounded-xl border border-[#E9E1D5] overflow-hidden shadow-xs grid grid-cols-1 md:grid-cols-12 min-h-[500px]">
          
          {/* Conversation list */}
          <div className="md:col-span-4 border-r border-[#E9E1D5] p-3 space-y-1">
            <h3 className="font-serif text-lg font-bold text-[#24483D] px-2 py-1">
              Messages
            </h3>

            {conversations.length === 0 ? (
              <p className="p-4 text-xs text-gray-500 text-center">No active conversations yet.</p>
            ) : (
              conversations.map((conv) => {
                const partnerId = conv.participants.find((p) => p !== user.id) || '';
                const partner = conv.participantDetails[partnerId];
                return (
                  <button
                    key={conv.id}
                    onClick={() => setSelectedConvId(conv.id)}
                    className={`w-full text-left p-3 rounded-lg transition-colors cursor-pointer flex items-start gap-3 ${
                      selectedConvId === conv.id ? 'bg-[#24483D]/10' : 'hover:bg-[#F8F6F0]'
                    }`}
                  >
                    <img
                      src={partner?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
                      alt=""
                      className="w-9 h-9 rounded-full object-cover shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline justify-between">
                        <p className="font-semibold text-xs text-[#24483D] truncate">{partner?.name || 'Member'}</p>
                        <span className="text-[10px] text-gray-400">
                          {new Date(conv.lastMessageAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#262A27]/70 truncate mt-0.5">{conv.lastMessage}</p>
                      {conv.listingTitle && (
                        <p className="text-[10px] text-[#C77D62] font-medium truncate mt-0.5">
                          Re: {conv.listingTitle}
                        </p>
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>

          {/* Active Chat Thread */}
          <div className="md:col-span-8 flex flex-col justify-between h-[520px]">
            {selectedConversation ? (
              <>
                {/* Chat Header */}
                <div className="p-3.5 border-b border-[#E9E1D5] bg-[#F8F6F0]/40 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-xs text-[#24483D]">
                      Exchange Conversation
                    </p>
                    {selectedConversation.listingTitle && (
                      <p className="text-[11px] text-[#C77D62]">
                        Regarding: {selectedConversation.listingTitle}
                      </p>
                    )}
                  </div>
                </div>

                {/* Messages Body */}
                <div className="p-4 flex-1 overflow-y-auto space-y-3">
                  {messages.map((m) => {
                    const isMe = m.senderId === user.id;
                    return (
                      <div
                        key={m.id}
                        className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                      >
                        <div
                          className={`max-w-xs sm:max-w-md p-3 rounded-lg text-xs leading-relaxed ${
                            isMe
                              ? 'bg-[#24483D] text-white rounded-br-none'
                              : 'bg-[#F8F6F0] text-[#262A27] border border-[#E9E1D5] rounded-bl-none'
                          }`}
                        >
                          <p>{m.content}</p>
                        </div>
                        <span className="text-[10px] text-gray-400 mt-1">
                          {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Input form */}
                <form
                  onSubmit={handleSendMessage}
                  className="p-3 border-t border-[#E9E1D5] flex items-center gap-2 bg-white"
                >
                  <input
                    type="text"
                    value={newMessageText}
                    onChange={(e) => setNewMessageText(e.target.value)}
                    placeholder="Type your message to arrange swap details..."
                    className="flex-1 text-xs p-2.5 rounded-lg border border-[#E9E1D5] focus:outline-none focus:ring-1 focus:ring-[#24483D]"
                  />
                  <button
                    type="submit"
                    disabled={sendingMsg || !newMessageText.trim()}
                    className="px-4 py-2.5 bg-[#24483D] text-white rounded-lg hover:bg-[#1a342c] disabled:opacity-50 text-xs font-semibold cursor-pointer flex items-center gap-1"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send</span>
                  </button>
                </form>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center p-8 text-center text-xs text-gray-400">
                Select a conversation on the left to read or reply.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 4: Swap Calendar */}
      {activeTab === 'calendar' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-baseline justify-between gap-2 border-b border-[#E9E1D5] pb-4">
            <div>
              <h2 className="font-serif text-2xl font-bold text-[#24483D]">
                Swap Exchange Calendar
              </h2>
              <p className="text-xs text-[#262A27]/70">
                Plan drop-off dates, courier parcel tracking, and exchange meetups.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Scheduled events */}
            <div className="lg:col-span-7 space-y-3">
              <h3 className="font-serif text-lg font-bold text-[#24483D]">
                Upcoming Scheduled Exchanges
              </h3>

              {calendarEvents.length === 0 ? (
                <div className="bg-white rounded-xl border border-[#E9E1D5] p-8 text-center text-xs text-gray-500">
                  No upcoming exchange events scheduled. Use the form to add a planned date!
                </div>
              ) : (
                calendarEvents.map((evt) => (
                  <div
                    key={evt.id}
                    className="bg-white rounded-xl border border-[#E9E1D5] p-4 flex items-start justify-between shadow-xs"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-lg bg-[#24483D] text-white flex flex-col items-center justify-center shrink-0">
                        <span className="text-[10px] uppercase">{new Date(evt.date).toLocaleString('default', { month: 'short' })}</span>
                        <span className="font-serif text-lg font-bold leading-none">{new Date(evt.date).getDate()}</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-xs text-[#24483D]">{evt.title}</h4>
                        <p className="text-[11px] text-[#262A27]/70 mt-0.5 flex items-center gap-1.5">
                          <Clock className="w-3 h-3 text-[#A8B8A0]" />
                          <span>{evt.time}</span>
                          <span>·</span>
                          <MapPin className="w-3 h-3 text-[#A8B8A0]" />
                          <span>{evt.location}</span>
                        </p>
                        {evt.notes && (
                          <p className="text-[11px] text-[#262A27]/80 mt-1 italic">
                            "{evt.notes}"
                          </p>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => handleDeleteCalendarEvent(evt.id)}
                      className="text-gray-400 hover:text-rose-600 p-1 cursor-pointer"
                      aria-label="Remove event"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Schedule new event form */}
            <div className="lg:col-span-5 bg-white rounded-xl border border-[#E9E1D5] p-5 shadow-xs">
              <h3 className="font-serif text-lg font-bold text-[#24483D] flex items-center gap-2 mb-3">
                <CalendarPlus className="w-4 h-4 text-[#C77D62]" />
                Schedule Swap Event
              </h3>

              <form onSubmit={handleAddCalendarEvent} className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-[#24483D] mb-1">Exchange Title *</label>
                  <input
                    type="text"
                    required
                    value={newCalTitle}
                    onChange={(e) => setNewCalTitle(e.target.value)}
                    placeholder="e.g. Courier Drop-off: Trench coat for Linen dress"
                    className="w-full p-2.5 rounded-md border border-[#E9E1D5] focus:outline-none focus:ring-1 focus:ring-[#24483D]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#24483D] mb-1">Target Date *</label>
                  <input
                    type="date"
                    required
                    value={newCalDate}
                    onChange={(e) => setNewCalDate(e.target.value)}
                    className="w-full p-2.5 rounded-md border border-[#E9E1D5] focus:outline-none focus:ring-1 focus:ring-[#24483D]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#24483D] mb-1">Location or Courier Service</label>
                  <input
                    type="text"
                    value={newCalLocation}
                    onChange={(e) => setNewCalLocation(e.target.value)}
                    placeholder="e.g. EcoPost Tracked Mail / Local Drop"
                    className="w-full p-2.5 rounded-md border border-[#E9E1D5] focus:outline-none focus:ring-1 focus:ring-[#24483D]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#24483D] mb-1">Packaging / Note</label>
                  <textarea
                    rows={2}
                    value={newCalNotes}
                    onChange={(e) => setNewCalNotes(e.target.value)}
                    placeholder="e.g. Garment fresh pressed and placed in recycled kraft box"
                    className="w-full p-2.5 rounded-md border border-[#E9E1D5] focus:outline-none focus:ring-1 focus:ring-[#24483D]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 text-xs font-semibold text-white bg-[#24483D] hover:bg-[#1a342c] rounded-md transition-all shadow-sm cursor-pointer"
                >
                  Save to Swap Calendar
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: Saved Favorites */}
      {activeTab === 'favorites' && (
        <div className="space-y-6">
          <div className="border-b border-[#E9E1D5] pb-4">
            <h2 className="font-serif text-2xl font-bold text-[#24483D]">
              Saved Pieces ({favorites.length})
            </h2>
            <p className="text-xs text-[#262A27]/70">
              Garments you've saved to your wishlist. Propose an exchange whenever ready!
            </p>
          </div>

          {favorites.length === 0 ? (
            <div className="bg-white rounded-xl border border-[#E9E1D5] p-12 text-center text-xs text-gray-500">
              You haven't saved any pieces yet. Click the heart icon on any garment to keep track of it!
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {favorites.map((item) => (
                <ListingCard
                  key={item.id}
                  listing={item}
                  onClick={onSelectListing}
                  onToggleFavorite={onToggleFavorite}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 6: Profile Settings */}
      {activeTab === 'profile' && (
        <div className="max-w-xl mx-auto bg-white rounded-xl border border-[#E9E1D5] p-6 shadow-xs space-y-5">
          <div className="border-b border-[#E9E1D5] pb-3">
            <h3 className="font-serif text-2xl font-bold text-[#24483D]">
              Edit Profile & Wardrobe Preferences
            </h3>
            <p className="text-xs text-[#262A27]/70">
              Updates persist directly in the ReWear database.
            </p>
          </div>

          {profileSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-md text-xs text-emerald-800 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>Profile updated successfully!</span>
            </div>
          )}

          <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-[#24483D] mb-1">Full Name</label>
              <input
                type="text"
                required
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                className="w-full p-2.5 rounded-md border border-[#E9E1D5] focus:outline-none focus:ring-1 focus:ring-[#24483D]"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#24483D] mb-1">City & Country</label>
              <input
                type="text"
                value={profileLocation}
                onChange={(e) => setProfileLocation(e.target.value)}
                className="w-full p-2.5 rounded-md border border-[#E9E1D5] focus:outline-none focus:ring-1 focus:ring-[#24483D]"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#24483D] mb-1">Bio / Style Philosophy</label>
              <textarea
                rows={3}
                value={profileBio}
                onChange={(e) => setProfileBio(e.target.value)}
                placeholder="Tell other swappers about your preferred styles, textile interests, or sizing tips..."
                className="w-full p-2.5 rounded-md border border-[#E9E1D5] focus:outline-none focus:ring-1 focus:ring-[#24483D]"
              />
            </div>

            <button
              type="submit"
              disabled={profileSaving}
              className="px-5 py-2.5 text-xs font-semibold text-white bg-[#24483D] hover:bg-[#1a342c] rounded-md transition-all shadow-sm active:scale-98 cursor-pointer"
            >
              {profileSaving ? 'Saving Changes...' : 'Update Profile'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
