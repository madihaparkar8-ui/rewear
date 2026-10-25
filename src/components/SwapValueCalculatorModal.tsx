import React, { useState } from 'react';
import {
  calculateSwapValue,
  GarmentCategory,
  GarmentCondition,
  AgeEra,
  MaterialTier,
  BrandTier,
} from '../utils/swapValueCalculator.ts';
import { X, Sparkles, HelpCircle } from 'lucide-react';

interface SwapValueCalculatorModalProps {
  onClose: () => void;
  onApplyValue?: (value: number) => void;
}

export const SwapValueCalculatorModal: React.FC<SwapValueCalculatorModalProps> = ({
  onClose,
  onApplyValue,
}) => {
  const [originalPrice, setOriginalPrice] = useState<number>(180);
  const [category, setCategory] = useState<GarmentCategory>('Jackets & Coats');
  const [condition, setCondition] = useState<GarmentCondition>('Like new');
  const [ageEra, setAgeEra] = useState<AgeEra>('1-3 years');
  const [material, setMaterial] = useState<MaterialTier>(
    'Noble Natural (Linen, Silk, Cashmere, Merino)'
  );
  const [brandTier, setBrandTier] = useState<BrandTier>('Sustainable Premium');

  const result = calculateSwapValue({
    originalPrice,
    category,
    condition,
    ageEra,
    material,
    brandTier,
  });

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl border border-[#E9E1D5] max-w-xl w-full shadow-2xl relative p-6 animate-in fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-[#F8F6F0] text-gray-400 hover:text-gray-700 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-2">
          <div className="p-2 rounded-full bg-[#C77D62]/10 text-[#C77D62]">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif text-2xl font-bold text-[#24483D]">
              Transparent Swap-Value Estimator
            </h3>
            <p className="text-xs text-[#262A27]/70">
              Rule-based, open formula determining fair exchange parity without black-box AI.
            </p>
          </div>
        </div>

        {/* Inputs */}
        <div className="mt-5 space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-[#24483D] mb-1">
              Estimated Original Retail Price ($ USD)
            </label>
            <input
              type="number"
              min={10}
              max={5000}
              value={originalPrice}
              onChange={(e) => setOriginalPrice(Number(e.target.value))}
              className="w-full p-2.5 rounded-md border border-[#E9E1D5] bg-white focus:outline-none focus:ring-1 focus:ring-[#24483D]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-[#24483D] mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as GarmentCategory)}
                className="w-full p-2.5 rounded-md border border-[#E9E1D5] bg-white focus:outline-none focus:ring-1 focus:ring-[#24483D]"
              >
                <option value="Tops">Tops</option>
                <option value="Shirts">Shirts</option>
                <option value="Jeans & Pants">Jeans & Pants</option>
                <option value="Dresses">Dresses</option>
                <option value="Jackets & Coats">Jackets & Coats</option>
                <option value="Ethnic Wear">Ethnic Wear</option>
                <option value="Shoes">Shoes</option>
                <option value="Bags">Bags</option>
                <option value="Accessories">Accessories</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-[#24483D] mb-1">Condition</label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value as GarmentCondition)}
                className="w-full p-2.5 rounded-md border border-[#E9E1D5] bg-white focus:outline-none focus:ring-1 focus:ring-[#24483D]"
              >
                <option value="New with tags">New with tags (70% retention)</option>
                <option value="Like new">Like new (55% retention)</option>
                <option value="Gently worn">Gently worn (40% retention)</option>
                <option value="Good">Good (25% retention)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-[#24483D] mb-1">Age / Era</label>
              <select
                value={ageEra}
                onChange={(e) => setAgeEra(e.target.value as AgeEra)}
                className="w-full p-2.5 rounded-md border border-[#E9E1D5] bg-white focus:outline-none focus:ring-1 focus:ring-[#24483D]"
              >
                <option value="Current season">Current season (x1.05)</option>
                <option value="1-3 years">1-3 years (x1.00 standard)</option>
                <option value="4-7 years">4-7 years (x0.85)</option>
                <option value="Vintage (15+ years)">Vintage 15+ yrs (x1.25 curated)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-[#24483D] mb-1">Brand Tier</label>
              <select
                value={brandTier}
                onChange={(e) => setBrandTier(e.target.value as BrandTier)}
                className="w-full p-2.5 rounded-md border border-[#E9E1D5] bg-white focus:outline-none focus:ring-1 focus:ring-[#24483D]"
              >
                <option value="Artisanal / Luxury">Artisanal / Luxury (x1.15)</option>
                <option value="Sustainable Premium">Sustainable Premium (x1.08)</option>
                <option value="Contemporary Classic">Contemporary Classic (x1.00)</option>
                <option value="High-Street">High-Street (x0.88)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-[#24483D] mb-1">Material Composition</label>
            <select
              value={material}
              onChange={(e) => setMaterial(e.target.value as MaterialTier)}
              className="w-full p-2.5 rounded-md border border-[#E9E1D5] bg-white focus:outline-none focus:ring-1 focus:ring-[#24483D]"
            >
              <option value="Noble Natural (Linen, Silk, Cashmere, Merino)">
                Noble Natural: Linen, Silk, Cashmere, Merino (x1.15)
              </option>
              <option value="Sustainable Natural (Organic Cotton, Hemp, Tencel)">
                Sustainable Natural: Organic Cotton, Hemp, Tencel (x1.08)
              </option>
              <option value="Standard Natural (Cotton, Wool blend)">
                Standard Natural: Cotton, Wool blend (x1.00)
              </option>
              <option value="Synthetic or Blend">
                Synthetic or Blend: Polyester, Nylon, Viscose (x0.85)
              </option>
            </select>
          </div>
        </div>

        {/* Calculated Result Output */}
        <div className="mt-6 p-4 rounded-lg bg-[#24483D] text-white">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] uppercase tracking-wider text-[#A8B8A0] font-medium">
                Indicative Swap Parity
              </span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="font-serif text-3xl font-bold text-[#F8F6F0] tabular-nums">
                  ${result.indicativeValue}
                </span>
                <span className="text-xs text-[#A8B8A0]">({result.swapCredits} Community Points)</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-[#A8B8A0] block">Retention Rate</span>
              <span className="font-semibold text-sm tabular-nums">
                {((result.indicativeValue / Math.max(1, originalPrice)) * 100).toFixed(0)}%
              </span>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-white/10 text-[11px] text-[#F8F6F0]/80 space-y-1 font-mono">
            {result.explanation.map((line, i) => (
              <p key={i}>• {line}</p>
            ))}
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <p className="text-[11px] text-gray-500 italic flex items-center gap-1">
            <HelpCircle className="w-3.5 h-3.5 text-gray-400" />
            <span>Members may negotiate freely based on mutual garment love.</span>
          </p>

          <button
            onClick={() => {
              if (onApplyValue) onApplyValue(result.indicativeValue);
              onClose();
            }}
            className="px-4 py-2 text-xs font-semibold text-white bg-[#24483D] hover:bg-[#1a342c] rounded-md cursor-pointer"
          >
            {onApplyValue ? 'Apply to Listing' : 'Done'}
          </button>
        </div>
      </div>
    </div>
  );
};
