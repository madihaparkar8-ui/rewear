import React from 'react';
import { X, Sparkles, Leaf, Repeat, HeartHandshake, CheckCircle } from 'lucide-react';

interface AboutModalProps {
  onClose: () => void;
  onOpenMarketplace: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ onClose, onOpenMarketplace }) => {
  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl border border-[#E9E1D5] max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative p-6 sm:p-8 animate-in fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-[#F8F6F0] text-gray-400 hover:text-gray-700 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-6">
          <div className="border-b border-[#E9E1D5] pb-4">
            <span className="text-[11px] uppercase tracking-widest text-[#C77D62] font-semibold">
              Independent Circular Fashion
            </span>
            <h2 className="font-serif text-3xl font-bold text-[#24483D] mt-1">
              About ReWear
            </h2>
            <p className="text-sm text-[#262A27]/80 mt-2 leading-relaxed">
              Founded on a simple realization: the most sustainable garment is already hanging in someone's closet.
            </p>
          </div>

          <div className="space-y-4 text-xs sm:text-sm text-[#262A27]/80 leading-relaxed">
            <p>
              ReWear was built as an independent collective for fashion enthusiasts who refuse to participate in the cycle of disposable micro-trends. Every year, over 92 million tons of textile waste end up in landfills, while billions of high-quality wool, linen, and silk pieces remain unworn.
            </p>

            <div className="p-4 rounded-lg bg-[#F8F6F0] border border-[#E9E1D5] space-y-3">
              <h4 className="font-serif text-base font-bold text-[#24483D] flex items-center gap-2">
                <Leaf className="w-4 h-4 text-[#24483D]" />
                Our Core Principles
              </h4>
              <ul className="space-y-2 text-xs">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-[#24483D] shrink-0 mt-0.5" />
                  <span><strong>Zero-Cost Wardrobe Renewals:</strong> Swap garment for garment without high resale commissions or inflated markups.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-[#24483D] shrink-0 mt-0.5" />
                  <span><strong>Transparent Valuation Parity:</strong> We provide an open mathematical estimate based on materials and original price to keep trades honest.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-[#24483D] shrink-0 mt-0.5" />
                  <span><strong>Quality Over Quantity:</strong> We champion durable natural textiles: French flax linen, Scottish wool, selvedge denim, and handloom khadi.</span>
                </li>
              </ul>
            </div>

            <p>
              When you swap a piece on ReWear, you keep natural fibers in circulation, save approximately 2,700 liters of freshwater per garment, and connect directly with mindful individuals across the globe.
            </p>
          </div>

          <div className="pt-4 border-t border-[#E9E1D5] flex items-center justify-between">
            <span className="text-xs text-[#262A27]/60">Independent & community supported</span>
            <button
              onClick={() => {
                onClose();
                onOpenMarketplace();
              }}
              className="px-5 py-2.5 text-xs font-semibold text-white bg-[#24483D] hover:bg-[#1a342c] rounded-md transition-all cursor-pointer"
            >
              Explore the Wardrobe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
