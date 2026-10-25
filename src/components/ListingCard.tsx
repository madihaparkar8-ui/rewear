import React from 'react';
import { Listing } from '../types.ts';
import { Heart, MapPin, Repeat } from 'lucide-react';

interface ListingCardProps {
  listing: Listing;
  onClick: (listing: Listing) => void;
  onToggleFavorite?: (id: string, e: React.MouseEvent) => void;
}

export const ListingCard: React.FC<ListingCardProps> = ({
  listing,
  onClick,
  onToggleFavorite,
}) => {
  return (
    <article
      onClick={() => onClick(listing)}
      className="group bg-white rounded-lg border border-[#E9E1D5] overflow-hidden hover:border-[#A8B8A0] transition-all duration-200 hover:shadow-md cursor-pointer flex flex-col h-full"
    >
      {/* Image Container with 4:3 / portrait ratio and neutral backdrop */}
      <div className="relative aspect-[4/3] bg-[#F8F6F0] overflow-hidden">
        <img
          src={listing.images[0] || '/src/assets/images/fashion_knitwear_sweater_1792904136197.jpg'}
          alt={listing.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center group-hover:scale-103 transition-transform duration-300"
          loading="lazy"
          onError={(e) => {
            // Resilient fallback container if an image fails to load
            (e.target as HTMLImageElement).src = '/src/assets/images/fashion_linen_dress_1792904133888.jpg';
          }}
        />

        {/* Favorite Button */}
        {onToggleFavorite && (
          <button
            onClick={(e) => onToggleFavorite(listing.id, e)}
            className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all cursor-pointer ${
              listing.isFavorited
                ? 'bg-rose-50 text-rose-600 shadow-sm'
                : 'bg-white/80 text-[#262A27]/70 hover:text-rose-600 hover:bg-white'
            }`}
            aria-label={listing.isFavorited ? 'Remove from favorites' : 'Save to favorites'}
          >
            <Heart className={`w-4 h-4 ${listing.isFavorited ? 'fill-current' : ''}`} />
          </button>
        )}

        {/* Status Indicator if in_swap */}
        {listing.status === 'in_swap' && (
          <div className="absolute bottom-2 left-2 px-2.5 py-1 bg-[#24483D]/90 text-white text-[11px] font-medium rounded backdrop-blur-sm flex items-center gap-1">
            <Repeat className="w-3 h-3" />
            <span>Exchange In Progress</span>
          </div>
        )}
      </div>

      {/* Card Content with Zero-Pill Typography */}
      <div className="p-4 flex flex-col flex-1 justify-between">
        <div>
          {/* Brand & Category in muted text */}
          <div className="flex items-center justify-between text-[11px] uppercase tracking-wider text-[#262A27]/60 font-medium mb-1">
            <span className="truncate">{listing.brand}</span>
            <span>{listing.category}</span>
          </div>

          {/* Title */}
          <h3 className="font-serif text-base font-semibold text-[#24483D] line-clamp-2 leading-snug group-hover:text-[#C77D62] transition-colors mb-2">
            {listing.title}
          </h3>

          {/* Unboxed Metadata with · separator */}
          <div className="flex items-center gap-1.5 text-xs text-[#262A27]/70 mb-3">
            <span>Size {listing.size}</span>
            <span aria-hidden="true">·</span>
            <span>{listing.condition}</span>
            {listing.material && (
              <>
                <span aria-hidden="true">·</span>
                <span className="truncate max-w-[100px]">{listing.material.split(' ')[0]}</span>
              </>
            )}
          </div>
        </div>

        {/* Bottom row: Value and Location */}
        <div className="pt-3 border-t border-[#F8F6F0] flex items-center justify-between text-xs">
          <div>
            <span className="text-[10px] uppercase text-[#262A27]/50 block">Est. Swap Value</span>
            <span className="font-semibold text-sm tabular-nums text-[#24483D]">
              ${listing.indicativeValue}
            </span>
          </div>

          <div className="flex items-center gap-1 text-[#262A27]/60 text-[11px] max-w-[130px] truncate">
            <MapPin className="w-3 h-3 shrink-0 text-[#A8B8A0]" />
            <span className="truncate">{listing.location.split(',')[0]}</span>
          </div>
        </div>
      </div>
    </article>
  );
};
