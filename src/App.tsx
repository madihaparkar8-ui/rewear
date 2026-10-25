/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext.tsx';
import { Listing } from './types.ts';
import { Navbar } from './components/Navbar.tsx';
import { Footer } from './components/Footer.tsx';
import { LandingPage } from './views/LandingPage.tsx';
import { MarketplaceView } from './views/MarketplaceView.tsx';
import { DashboardView } from './views/DashboardView.tsx';
import { AdminPanelView } from './views/AdminPanelView.tsx';
import { ListingDetailModal } from './components/ListingDetailModal.tsx';
import { SwapOfferModal } from './components/SwapOfferModal.tsx';
import { CreateListingModal } from './components/CreateListingModal.tsx';
import { AuthModal } from './components/AuthModal.tsx';
import { SwapValueCalculatorModal } from './components/SwapValueCalculatorModal.tsx';
import { AboutModal } from './components/AboutModal.tsx';
import { ContactModal } from './components/ContactModal.tsx';
import { TermsModal } from './components/TermsModal.tsx';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

function ReWearApp() {
  const { user, authHeaders, isAdmin } = useAuth();

  // Navigation & View State
  const [activeView, setActiveView] = useState<string>('landing');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Listings State
  const [listings, setListings] = useState<Listing[]>([]);
  const [loadingListings, setLoadingListings] = useState<boolean>(true);

  // Modals
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [offeringSwapFor, setOfferingSwapFor] = useState<Listing | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup'>('login');
  const [createListingModalOpen, setCreateListingModalOpen] = useState(false);
  const [editingListing, setEditingListing] = useState<Listing | null>(null);
  const [calculatorModalOpen, setCalculatorModalOpen] = useState(false);
  const [aboutModalOpen, setAboutModalOpen] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [termsModalOpen, setTermsModalOpen] = useState(false);
  const [termsModalMode, setTermsModalMode] = useState<'terms' | 'privacy'>('terms');

  // Toast notification
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Fetch all active listings from the backend
  const fetchListings = useCallback(async () => {
    try {
      setLoadingListings(true);
      const res = await fetch('/api/listings', {
        headers: authHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        setListings(data.listings || []);
      }
    } catch (err) {
      console.error('Error fetching listings:', err);
    } finally {
      setLoadingListings(false);
    }
  }, [authHeaders]);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  // Favorite toggle handler
  const handleToggleFavorite = async (listingId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!user) {
      setAuthModalMode('login');
      setAuthModalOpen(true);
      return;
    }

    try {
      const res = await fetch(`/api/listings/${listingId}/favorite`, {
        method: 'POST',
        headers: authHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        setListings((prev) =>
          prev.map((l) => (l.id === listingId ? { ...l, isFavorited: data.isFavorited } : l))
        );
        if (selectedListing && selectedListing.id === listingId) {
          setSelectedListing((prev) => (prev ? { ...prev, isFavorited: data.isFavorited } : null));
        }
        showToast(data.isFavorited ? 'Saved to your favourite pieces' : 'Removed from favourites', 'info');
      }
    } catch (err) {
      console.error('Error toggling favorite:', err);
    }
  };

  // Offer Swap action
  const handleOfferSwap = (listing: Listing) => {
    if (!user) {
      setAuthModalMode('login');
      setAuthModalOpen(true);
      return;
    }

    if (listing.ownerId === user.id) {
      showToast('You cannot propose a swap on your own listing', 'error');
      return;
    }

    setOfferingSwapFor(listing);
    setSelectedListing(null);
  };

  // Submit Swap proposal
  const handleSubmitSwap = async (payload: {
    targetListingId: string;
    offeredListingIds: string[];
    message: string;
  }) => {
    const res = await fetch('/api/swaps', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders(),
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to submit swap proposal');
    }

    showToast('Swap proposal sent successfully! Track it in your dashboard.');
    await fetchListings();
    setOfferingSwapFor(null);
  };

  // Message Owner directly
  const handleMessageOwner = async (ownerId: string, listingId: string, title: string) => {
    if (!user) {
      setAuthModalMode('login');
      setAuthModalOpen(true);
      return;
    }

    if (ownerId === user.id) {
      showToast('You cannot message yourself', 'error');
      return;
    }

    try {
      const res = await fetch('/api/conversations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders(),
        },
        body: JSON.stringify({
          recipientId: ownerId,
          listingId,
          initialMessage: `Hi! I am interested in your ${title}. Could you tell me more about the fit?`,
        }),
      });

      if (res.ok) {
        setSelectedListing(null);
        setActiveView('dashboard-messages');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (err) {
      console.error('Error initiating conversation:', err);
    }
  };

  // Create or Update Listing
  const handleSaveListing = async (listingData: Partial<Listing>) => {
    if (!user) {
      setAuthModalMode('login');
      setAuthModalOpen(true);
      return;
    }

    const isEdit = Boolean(editingListing);
    const url = isEdit ? `/api/listings/${editingListing!.id}` : '/api/listings';
    const method = isEdit ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders(),
      },
      body: JSON.stringify(listingData),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to save listing');
    }

    showToast(isEdit ? 'Listing updated successfully!' : 'Garment published to ReWear wardrobe!');
    setEditingListing(null);
    setCreateListingModalOpen(false);
    await fetchListings();
  };

  // Delete Listing
  const handleDeleteListing = async (listingId: string) => {
    if (!confirm('Are you sure you want to remove this garment from your wardrobe?')) return;
    try {
      const res = await fetch(`/api/listings/${listingId}`, {
        method: 'DELETE',
        headers: authHeaders(),
      });
      if (res.ok) {
        showToast('Listing removed from wardrobe');
        setSelectedListing(null);
        await fetchListings();
      }
    } catch (err) {
      console.error('Error deleting listing:', err);
    }
  };

  // Navigation router
  const userListings = listings.filter((l) => l.ownerId === user?.id);
  const favoriteListings = listings.filter((l) => l.isFavorited);

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F6F0] text-[#262A27] selection:bg-[#A8B8A0]/30 selection:text-[#24483D]">
      
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-24 right-4 z-50 animate-in fade-in slide-in-from-top-3">
          <div
            className={`px-4 py-3 rounded-lg shadow-lg border text-xs font-medium flex items-center gap-2.5 max-w-sm ${
              toast.type === 'success'
                ? 'bg-[#24483D] text-white border-[#24483D]'
                : toast.type === 'error'
                ? 'bg-rose-700 text-white border-rose-800'
                : 'bg-white text-[#24483D] border-[#E9E1D5]'
            }`}
          >
            {toast.type === 'success' ? (
              <CheckCircle className="w-4 h-4 text-[#A8B8A0] shrink-0" />
            ) : toast.type === 'error' ? (
              <AlertCircle className="w-4 h-4 text-white shrink-0" />
            ) : (
              <Info className="w-4 h-4 text-[#C77D62] shrink-0" />
            )}
            <span className="flex-1">{toast.message}</span>
            <button onClick={() => setToast(null)} className="p-0.5 hover:opacity-75 cursor-pointer">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Top Navbar */}
      <Navbar
        activeView={activeView}
        setActiveView={setActiveView}
        onOpenAuth={(mode = 'login') => {
          setAuthModalMode(mode);
          setAuthModalOpen(true);
        }}
        onOpenCreateListing={() => {
          if (!user) {
            setAuthModalMode('login');
            setAuthModalOpen(true);
          } else {
            setEditingListing(null);
            setCreateListingModalOpen(true);
          }
        }}
        onOpenCalculator={() => setCalculatorModalOpen(true)}
        onOpenContact={() => setContactModalOpen(true)}
        onOpenAbout={() => setAboutModalOpen(true)}
      />

      {/* Main View Area */}
      <main className="flex-1">
        {activeView === 'landing' && (
          <LandingPage
            listings={listings}
            onExploreWardrobe={(cat) => {
              if (cat) setSelectedCategory(cat);
              setActiveView('marketplace');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenCreateListing={() => {
              if (!user) {
                setAuthModalMode('signup');
                setAuthModalOpen(true);
              } else {
                setEditingListing(null);
                setCreateListingModalOpen(true);
              }
            }}
            onSelectListing={(listing) => setSelectedListing(listing)}
            onToggleFavorite={handleToggleFavorite}
            onOpenCalculator={() => setCalculatorModalOpen(true)}
          />
        )}

        {activeView === 'marketplace' && (
          <MarketplaceView
            listings={listings}
            initialCategory={selectedCategory}
            onSelectListing={(listing) => setSelectedListing(listing)}
            onToggleFavorite={handleToggleFavorite}
            onOpenCreateListing={() => {
              if (!user) {
                setAuthModalMode('login');
                setAuthModalOpen(true);
              } else {
                setEditingListing(null);
                setCreateListingModalOpen(true);
              }
            }}
            onOpenCalculator={() => setCalculatorModalOpen(true)}
          />
        )}

        {activeView.startsWith('dashboard') && (
          <DashboardView
            initialTab={
              activeView === 'dashboard-swaps'
                ? 'swaps'
                : activeView === 'dashboard-messages'
                ? 'messages'
                : activeView === 'dashboard-calendar'
                ? 'calendar'
                : activeView === 'dashboard-favorites'
                ? 'favorites'
                : 'wardrobe'
            }
            userListings={userListings}
            favorites={favoriteListings}
            onOpenCreateListing={() => {
              setEditingListing(null);
              setCreateListingModalOpen(true);
            }}
            onEditListing={(item) => {
              setEditingListing(item);
              setCreateListingModalOpen(true);
            }}
            onDeleteListing={handleDeleteListing}
            onSelectListing={(listing) => setSelectedListing(listing)}
            onToggleFavorite={handleToggleFavorite}
            onRefreshData={fetchListings}
          />
        )}

        {activeView === 'admin' && (
          <AdminPanelView
            onSelectListing={(listing) => setSelectedListing(listing)}
            onRefreshData={fetchListings}
          />
        )}
      </main>

      {/* Footer */}
      <Footer
        onNavigate={(view) => {
          setActiveView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenAbout={() => setAboutModalOpen(true)}
        onOpenContact={() => setContactModalOpen(true)}
        onOpenCalculator={() => setCalculatorModalOpen(true)}
        onOpenTerms={() => {
          setTermsModalMode('terms');
          setTermsModalOpen(true);
        }}
        onOpenPrivacy={() => {
          setTermsModalMode('privacy');
          setTermsModalOpen(true);
        }}
      />

      {/* MODALS */}

      {/* Item Detail View Modal */}
      {selectedListing && (
        <ListingDetailModal
          listing={selectedListing}
          currentUser={user}
          onClose={() => setSelectedListing(null)}
          onOfferSwap={handleOfferSwap}
          onMessageOwner={handleMessageOwner}
          onToggleFavorite={(id) => handleToggleFavorite(id)}
          onEditListing={(item) => {
            setSelectedListing(null);
            setEditingListing(item);
            setCreateListingModalOpen(true);
          }}
          onDeleteListing={handleDeleteListing}
        />
      )}

      {/* Swap Offer Modal */}
      {offeringSwapFor && user && (
        <SwapOfferModal
          targetListing={offeringSwapFor}
          currentUser={user}
          userListings={userListings}
          onClose={() => setOfferingSwapFor(null)}
          onSubmitSwap={handleSubmitSwap}
          onOpenCreateListing={() => {
            setOfferingSwapFor(null);
            setCreateListingModalOpen(true);
          }}
        />
      )}

      {/* Create / Edit Listing Modal */}
      {createListingModalOpen && (
        <CreateListingModal
          initialListing={editingListing}
          onClose={() => {
            setCreateListingModalOpen(false);
            setEditingListing(null);
          }}
          onSubmit={handleSaveListing}
        />
      )}

      {/* Auth Modal (Login / Sign Up) */}
      {authModalOpen && (
        <AuthModal
          initialMode={authModalMode}
          onClose={() => setAuthModalOpen(false)}
          onSuccess={() => {
            fetchListings();
            showToast('Signed in successfully!');
          }}
        />
      )}

      {/* Swap Value Calculator Modal */}
      {calculatorModalOpen && (
        <SwapValueCalculatorModal
          onClose={() => setCalculatorModalOpen(false)}
        />
      )}

      {/* About Modal */}
      {aboutModalOpen && (
        <AboutModal
          onClose={() => setAboutModalOpen(false)}
          onOpenMarketplace={() => {
            setAboutModalOpen(false);
            setActiveView('marketplace');
          }}
        />
      )}

      {/* Contact Modal */}
      {contactModalOpen && (
        <ContactModal onClose={() => setContactModalOpen(false)} />
      )}

      {/* Terms and Privacy Modal */}
      {termsModalOpen && (
        <TermsModal
          mode={termsModalMode}
          onClose={() => setTermsModalOpen(false)}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ReWearApp />
    </AuthProvider>
  );
}
