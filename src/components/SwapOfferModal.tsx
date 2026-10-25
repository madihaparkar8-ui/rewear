import React, { useState, useEffect } from 'react';
import { Listing, User } from '../types.ts';
import { X, Repeat, CheckCircle, AlertCircle, Sparkles, PlusCircle } from 'lucide-react';
import { compareSwapItems } from '../utils/swapValueCalculator.ts';

interface SwapOfferModalProps {
  targetListing: Listing;
  currentUser: User;
  userListings: Listing[];
  onClose: () => void;
  onSubmitSwap: (payload: {
    targetListingId: string;
    offeredListingIds: string[];
    message: string;
  }) => Promise<void>;
  onOpenCreateListing: () => void;
}

export const SwapOfferModal: React.FC<SwapOfferModalProps> = ({
  targetListing,
  currentUser,
  userListings,
  onClose,
  onSubmitSwap,
  onOpenCreateListing,
}) => {
  const [selectedOfferId, setSelectedOfferId] = useState<string>('');
  const [message, setMessage] = useState<string>(
    `Hello ${targetListing.ownerName}! I love this ${targetListing.title} and would love to exchange it for a piece from my wardrobe.`
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filter user's listings to only available ones
  const availableItems = userListings.filter(
    (item) => item.status === 'available' && item.id !== targetListing.id
  );

  useEffect(() => {
    if (availableItems.length > 0 && !selectedOfferId) {
      setSelectedOfferId(availableItems[0].id);
    }
  }, [availableItems, selectedOfferId]);

  const selectedOfferedItem = availableItems.find((i) => i.id === selectedOfferId);

  // Compare values
  const comparison = selectedOfferedItem
    ? compareSwapItems(selectedOfferedItem.indicativeValue, targetListing.indicativeValue)
    : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOfferId) {
      setError('Please select an item from your wardrobe to offer.');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      await onSubmitSwap({
        targetListingId: targetListing.id,
        offeredListingIds: [selectedOfferId],
        message: message.trim(),
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to submit swap proposal');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 md:p-6"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl border border-[#E9E1D5] max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl relative p-6 animate-in fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#E9E1D5]">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-full bg-[#24483D]/10 text-[#24483D]">
              <Repeat className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-xl font-bold text-[#24483D]">
                Propose a Clothing Swap
              </h3>
              <p className="text-xs text-[#262A27]/70">
                Offer one of your pieces to exchange with {targetListing.ownerName}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-[#F8F6F0] text-gray-400 hover:text-gray-700 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-rose-50 border border-rose-200 rounded-md text-xs text-rose-800 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Available Items check */}
        {availableItems.length === 0 ? (
          <div className="py-8 text-center space-y-3">
            <p className="text-sm text-[#262A27]/80">
              You do not have any available items in your wardrobe to offer for this swap.
            </p>
            <button
              onClick={() => {
                onClose();
                onOpenCreateListing();
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#24483D] rounded-md hover:bg-[#1a342c] cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>List a Garment First</span>
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-5 space-y-6">
            
            {/* Step 1: Select Your Offer */}
            <div>
              <label className="block text-xs font-semibold text-[#24483D] uppercase tracking-wider mb-2">
                1. Select what you are offering in exchange:
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-48 overflow-y-auto p-1">
                {availableItems.map((item) => (
                  <button
                    type="button"
                    key={item.id}
                    onClick={() => setSelectedOfferId(item.id)}
                    className={`p-2.5 rounded-lg border text-left cursor-pointer transition-all flex flex-col justify-between ${
                      selectedOfferId === item.id
                        ? 'border-[#24483D] bg-[#24483D]/5 ring-1 ring-[#24483D]'
                        : 'border-[#E9E1D5] hover:border-[#A8B8A0]'
                    }`}
                  >
                    <div className="aspect-[4/3] rounded bg-gray-100 overflow-hidden mb-2">
                      <img
                        src={item.images[0]}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-[#24483D] truncate">{item.title}</p>
                      <p className="text-[11px] text-[#262A27]/60 truncate">{item.brand} · Size {item.size}</p>
                      <p className="text-xs font-bold text-[#C77D62] mt-1 tabular-nums">
                        ${item.indicativeValue}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Side-by-Side Value Comparison */}
            {selectedOfferedItem && comparison && (
              <div className="p-4 rounded-lg bg-[#F8F6F0] border border-[#E9E1D5] space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold uppercase tracking-wider text-[#24483D]">
                    Value Exchange Parity
                  </span>
                  <span
                    className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                      comparison.verdict === 'Fair exchange'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {comparison.verdict}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs pt-1">
                  <div className="p-2.5 bg-white rounded border border-[#E9E1D5]">
                    <span className="text-[10px] text-gray-500 uppercase block">Your Piece</span>
                    <p className="font-semibold text-[#24483D] truncate">{selectedOfferedItem.title}</p>
                    <p className="text-sm font-bold text-[#24483D] mt-0.5 tabular-nums">
                      ${selectedOfferedItem.indicativeValue}
                    </p>
                  </div>

                  <div className="p-2.5 bg-white rounded border border-[#E9E1D5]">
                    <span className="text-[10px] text-gray-500 uppercase block">Their Piece</span>
                    <p className="font-semibold text-[#24483D] truncate">{targetListing.title}</p>
                    <p className="text-sm font-bold text-[#24483D] mt-0.5 tabular-nums">
                      ${targetListing.indicativeValue}
                    </p>
                  </div>
                </div>

                <p className="text-[11px] text-[#262A27]/75 leading-relaxed flex items-center gap-1.5 pt-1">
                  <Sparkles className="w-3.5 h-3.5 text-[#C77D62] shrink-0" />
                  <span>{comparison.guidance}</span>
                </p>
              </div>
            )}

            {/* Step 3: Message to Member */}
            <div>
              <label className="block text-xs font-semibold text-[#24483D] uppercase tracking-wider mb-1.5">
                2. Add a friendly note to {targetListing.ownerName}:
              </label>
              <textarea
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Mention why you are interested in this piece, condition notes, or shipping preference..."
                className="w-full text-xs p-3 rounded-lg border border-[#E9E1D5] focus:outline-none focus:ring-1 focus:ring-[#24483D] bg-white"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E9E1D5]">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-[#262A27]/70 hover:bg-[#F8F6F0] rounded-md cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting || !selectedOfferId}
                className="px-5 py-2.5 text-xs font-semibold text-white bg-[#24483D] hover:bg-[#1a342c] rounded-md transition-all shadow-sm active:scale-98 disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
              >
                {submitting ? (
                  <span>Sending Proposal...</span>
                ) : (
                  <>
                    <Repeat className="w-3.5 h-3.5" />
                    <span>Send Swap Proposal</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
