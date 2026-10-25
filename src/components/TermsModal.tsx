import React from 'react';
import { X, ShieldCheck, FileText } from 'lucide-react';

interface TermsModalProps {
  mode: 'terms' | 'privacy';
  onClose: () => void;
}

export const TermsModal: React.FC<TermsModalProps> = ({ mode, onClose }) => {
  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl border border-[#E9E1D5] max-w-xl w-full max-h-[85vh] overflow-y-auto shadow-2xl relative p-6 sm:p-8 animate-in fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-[#F8F6F0] text-gray-400 hover:text-gray-700 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-2">
          <div className="p-2 rounded-full bg-[#24483D]/10 text-[#24483D]">
            {mode === 'terms' ? <FileText className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />}
          </div>
          <div>
            <h3 className="font-serif text-2xl font-bold text-[#24483D]">
              {mode === 'terms' ? 'Terms of Clothing Exchange' : 'Privacy & Community Standards'}
            </h3>
            <p className="text-xs text-[#262A27]/70">
              {mode === 'terms' ? 'Standards of fair circular exchange on ReWear' : 'How we safeguard your information'}
            </p>
          </div>
        </div>

        <div className="mt-5 space-y-4 text-xs sm:text-sm text-[#262A27]/80 leading-relaxed border-t border-[#E9E1D5] pt-4">
          {mode === 'terms' ? (
            <>
              <div>
                <h4 className="font-semibold text-[#24483D] mb-1">1. Garment Hygiene & Authenticity</h4>
                <p>
                  Every participant agrees to thoroughly wash, steam, or dry-clean garments before dispatching them. Items must match photographs faithfully and disclose any pulls, vintage fading, or mended seams.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-[#24483D] mb-1">2. 1-to-1 Parity & Respect</h4>
                <p>
                  ReWear facilitates honest, non-monetary exchanges. Proposers and recipients negotiate mutually agreeable terms. No harassment, counterfeiting, or unauthorized commercial resale is permitted.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-[#24483D] mb-1">3. Exchange Fulfillment & Tracking</h4>
                <p>
                  Once a swap request is accepted, participants are requested to dispatch items within 5 business days using tracked courier services and upload tracking details in the conversation thread.
                </p>
              </div>
            </>
          ) : (
            <>
              <div>
                <h4 className="font-semibold text-[#24483D] mb-1">1. Minimal Data Collection</h4>
                <p>
                  ReWear strictly collects only the information necessary to facilitate peer-to-peer wardrobe swaps (name, email, approximate city location, and garment photos). We never sell personal data to advertisers.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-[#24483D] mb-1">2. Secure Cryptographic Storage</h4>
                <p>
                  User credentials are mathematically hashed using salted scrypt cryptography. Passwords are never stored in plain text.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-[#24483D] mb-1">3. Account Deletion Rights</h4>
                <p>
                  You retain complete ownership over your listings. You can edit, unpublish, or delete your items and account profile at any time directly from the dashboard.
                </p>
              </div>
            </>
          )}

          <div className="pt-4 border-t border-[#E9E1D5] flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-white bg-[#24483D] rounded-md hover:bg-[#1a342c] cursor-pointer"
            >
              Understood
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
