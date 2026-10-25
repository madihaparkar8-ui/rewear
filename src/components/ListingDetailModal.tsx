import React, { useState } from 'react';
import { Listing, User } from '../types.ts';
import {
  X,
  Heart,
  Repeat,
  MessageSquare,
  MapPin,
  ShieldCheck,
  Sparkles,
  Info,
  Calendar,
  Trash2,
  Edit3,
} from 'lucide-react';
import { calculateSwapValue } from '../utils/swapValueCalculator.ts';

interface ListingDetailModalProps {
  listing: Listing;
  currentUser: User | null;
  onClose: () => void;
  onOfferSwap: (listing: Listing) => void;
  onMessageOwner: (ownerId: string, listingId: string, title: string) => void;
  onToggleFavorite: (listingId: string) => void;
  onEditListing?: (listing: Listing) => void;
  onDeleteListing?: (listingId: string) => void;
  onSelectOtherListing?: (listing: Listing) => void;
}

export const ListingDetailModal: React.FC<ListingDetailModalProps> = ({
  listing,
  currentUser,
  onClose,
  onOfferSwap,
  onMessageOwner,
  onToggleFavorite,
  onEditListing,
  onDeleteListing,
}) => {
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [showValuationDetails, setShowValuationDetails] = useState(false);

  const isOwner = currentUser?.id === listing.ownerId;
  const isAdmin = currentUser?.role === 'admin' || currentUser?.email.toLowerCase() === 'madihaparkar8@gmail.com';

  const valueCalc = calculateSwapValue({
    originalPrice: listing.originalPrice,
    category: listing.category as any,
    condition: listing.condition,
    material: listing.material?.includes('Linen') || listing.material?.includes('Silk') || listing.material?.includes('Wool')
      ? 'Noble Natural (Linen, Silk, Cashmere, Merino)'
      : 'Sustainable Natural (Organic Cotton, Hemp, Tencel)',
  });

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 md:p-6"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl border border-[#E9E1D5] max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl relative animate-in fade-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/90 text-[#262A27] hover:bg-[#F8F6F0] border border-[#E9E1D5] transition-all cursor-pointer shadow-xs"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-8">
          
          {/* Left Column: Image Gallery */}
          <div className="p-4 sm:p-6 md:pr-0 flex flex-col justify-between bg-[#F8F6F0]/40">
            <div>
              <div className="relative aspect-[4/3] sm:aspect-square rounded-lg overflow-hidden bg-[#F8F6F0] border border-[#E9E1D5]">
                <img
                  src={listing.images[selectedImageIdx] || listing.images[0]}
                  alt={listing.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />

                {listing.status === 'in_swap' && (
                  <div className="absolute top-3 left-3 px-3 py-1 bg-[#24483D] text-white text-xs font-medium rounded shadow-sm">
                    In Active Swap
                  </div>
                )}
              </div>

              {/* Thumbnails if multiple images exist */}
              {listing.images.length > 1 && (
                <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
                  {listing.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImageIdx(idx)}
                      className={`relative w-16 h-16 rounded-md overflow-hidden border-2 cursor-pointer transition-all shrink-0 ${
                        selectedImageIdx === idx ? 'border-[#24483D]' : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Owner Info Snippet */}
            <div className="mt-6 p-4 rounded-lg bg-white border border-[#E9E1D5]">
              <div className="flex items-center gap-3">
                <img
                  src={listing.owner?.avatar || listing.ownerAvatar}
                  alt={listing.ownerName}
                  referrerPolicy="no-referrer"
                  className="w-11 h-11 rounded-full object-cover border border-[#A8B8A0]/40"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-sm text-[#24483D] truncate">
                      {listing.owner?.name || listing.ownerName}
                    </p>
                    <span className="text-[10px] text-[#24483D] font-medium bg-[#A8B8A0]/20 px-1.5 py-0.5 rounded flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-[#24483D]" />
                      Verified
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-[#262A27]/60 mt-0.5">
                    <span>{listing.owner?.location || listing.ownerLocation}</span>
                    <span>·</span>
                    <span>{listing.owner?.swapsCompleted ?? 12} completed swaps</span>
                  </div>
                </div>
              </div>
              {listing.owner?.bio && (
                <p className="text-xs text-[#262A27]/80 mt-2.5 italic border-t border-[#F8F6F0] pt-2">
                  "{listing.owner.bio}"
                </p>
              )}
            </div>
          </div>

          {/* Right Column: Garment Specs & Purchase/Swap Actions */}
          <div className="p-4 sm:p-6 md:pl-0 flex flex-col justify-between">
            <div className="space-y-4">
              
              {/* Category & Brand */}
              <div>
                <div className="flex items-center justify-between text-xs uppercase tracking-wider text-[#262A27]/60 font-medium">
                  <span>{listing.brand}</span>
                  <div className="flex items-center gap-1 text-[#262A27]/50">
                    <MapPin className="w-3 h-3 text-[#A8B8A0]" />
                    <span>{listing.location}</span>
                  </div>
                </div>

                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#24483D] mt-1 leading-tight">
                  {listing.title}
                </h2>
              </div>

              {/* Value and Pricing Breakdown */}
              <div className="p-3.5 rounded-lg bg-[#F8F6F0] border border-[#E9E1D5]">
                <div className="flex items-baseline justify-between">
                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-[#262A27]/60 font-medium">
                      Indicative Swap Value
                    </span>
                    <div className="flex items-baseline gap-2 mt-0.5">
                      <span className="text-2xl font-bold font-serif tabular-nums text-[#24483D]">
                        ${listing.indicativeValue}
                      </span>
                      <span className="text-xs text-[#262A27]/60">
                        (Orig. retail ~${listing.originalPrice})
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => setShowValuationDetails(!showValuationDetails)}
                    className="text-xs text-[#C77D62] hover:text-[#b0674d] font-medium flex items-center gap-1 cursor-pointer"
                  >
                    <Info className="w-3.5 h-3.5" />
                    <span>{showValuationDetails ? 'Hide formula' : 'How valued?'}</span>
                  </button>
                </div>

                {/* Expanded Transparent Calculation Explanations */}
                {showValuationDetails && (
                  <div className="mt-3 pt-3 border-t border-[#E9E1D5] text-xs space-y-1.5 text-[#262A27]/80 animate-in fade-in">
                    <p className="font-medium text-[#24483D] flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#C77D62]" />
                      Transparent Rule-Based Valuation:
                    </p>
                    {valueCalc.explanation.map((item, i) => (
                      <p key={i} className="pl-4 text-[11px]">
                        • {item}
                      </p>
                    ))}
                    <p className="text-[10px] text-gray-500 pt-1 italic">
                      Formula: Baseline × Condition Multiplier × Fabric Profile = Swap Parity Value.
                    </p>
                  </div>
                )}
              </div>

              {/* Garment Specifications Grid */}
              <div className="grid grid-cols-2 gap-2 text-xs py-2 border-y border-[#F8F6F0]">
                <div>
                  <span className="text-[#262A27]/50 block text-[11px]">Category</span>
                  <span className="font-semibold text-[#262A27]">{listing.category}</span>
                </div>
                <div>
                  <span className="text-[#262A27]/50 block text-[11px]">Size</span>
                  <span className="font-semibold text-[#262A27]">{listing.size}</span>
                </div>
                <div>
                  <span className="text-[#262A27]/50 block text-[11px]">Condition</span>
                  <span className="font-semibold text-[#262A27]">{listing.condition}</span>
                </div>
                <div>
                  <span className="text-[#262A27]/50 block text-[11px]">Fabric / Material</span>
                  <span className="font-semibold text-[#262A27] truncate block">
                    {listing.material || 'Natural fiber blend'}
                  </span>
                </div>
                {listing.color && (
                  <div>
                    <span className="text-[#262A27]/50 block text-[11px]">Color</span>
                    <span className="font-semibold text-[#262A27]">{listing.color}</span>
                  </div>
                )}
                {listing.gender && (
                  <div>
                    <span className="text-[#262A27]/50 block text-[11px]">Fit / Cut</span>
                    <span className="font-semibold text-[#262A27]">{listing.gender}</span>
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[#262A27]/60 mb-1.5">
                  About this Piece
                </h4>
                <p className="text-xs sm:text-sm text-[#262A27]/80 leading-relaxed">
                  {listing.description}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-6 mt-4 border-t border-[#E9E1D5] space-y-2.5">
              {!isOwner ? (
                <div className="flex flex-col sm:flex-row gap-2.5">
                  <button
                    onClick={() => onOfferSwap(listing)}
                    disabled={listing.status !== 'available'}
                    className={`flex-1 py-3 px-4 rounded-md font-semibold text-xs text-white flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer ${
                      listing.status === 'available'
                        ? 'bg-[#24483D] hover:bg-[#1a342c] active:scale-98'
                        : 'bg-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <Repeat className="w-4 h-4" />
                    <span>
                      {listing.status === 'available' ? 'Offer a Swap' : 'Currently in Exchange'}
                    </span>
                  </button>

                  <button
                    onClick={() => onMessageOwner(listing.ownerId, listing.id, listing.title)}
                    className="py-3 px-4 rounded-md font-semibold text-xs text-[#24483D] border border-[#24483D] hover:bg-[#24483D]/5 flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Message Member</span>
                  </button>

                  <button
                    onClick={() => onToggleFavorite(listing.id)}
                    className={`p-3 rounded-md border flex items-center justify-center transition-colors cursor-pointer ${
                      listing.isFavorited
                        ? 'border-rose-300 bg-rose-50 text-rose-600'
                        : 'border-[#E9E1D5] text-[#262A27]/70 hover:bg-[#F8F6F0]'
                    }`}
                    aria-label="Save to favourites"
                  >
                    <Heart className={`w-4 h-4 ${listing.isFavorited ? 'fill-current' : ''}`} />
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-md text-xs text-amber-900">
                    This is your active listing. You can edit garment details or remove it from your wardrobe.
                  </div>
                  <div className="flex gap-2">
                    {onEditListing && (
                      <button
                        onClick={() => onEditListing(listing)}
                        className="flex-1 py-2.5 px-3 border border-[#24483D] text-[#24483D] rounded-md text-xs font-semibold hover:bg-[#24483D]/5 flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit Listing</span>
                      </button>
                    )}
                    {onDeleteListing && (
                      <button
                        onClick={() => onDeleteListing(listing.id)}
                        className="py-2.5 px-3 border border-rose-300 text-rose-700 hover:bg-rose-50 rounded-md text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    )}
                  </div>
                </div>
              )}

              {isAdmin && !isOwner && onDeleteListing && (
                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => onDeleteListing(listing.id)}
                    className="text-[11px] text-rose-600 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Admin Moderation: Remove this listing</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
