import React, { useState, useEffect } from 'react';
import { Listing, GarmentCategory, GarmentCondition } from '../types.ts';
import { X, Upload, Sparkles, AlertCircle, Image as ImageIcon } from 'lucide-react';
import { calculateSwapValue } from '../utils/swapValueCalculator.ts';

interface CreateListingModalProps {
  initialListing?: Listing | null;
  onClose: () => void;
  onSubmit: (listingData: Partial<Listing>) => Promise<void>;
}

const CATEGORIES: GarmentCategory[] = [
  'Tops',
  'Shirts',
  'Jeans & Pants',
  'Dresses',
  'Jackets & Coats',
  'Ethnic Wear',
  'Shoes',
  'Bags',
  'Accessories',
];

const CONDITIONS: GarmentCondition[] = [
  'New with tags',
  'Like new',
  'Gently worn',
  'Good',
];

const PRESET_IMAGES = [
  { name: 'Terracotta Linen Midi Dress', url: '/src/assets/images/fashion_linen_dress_1792904133888.jpg' },
  { name: 'Forest Green Tailored Trench', url: '/src/assets/images/fashion_trench_coat_1792904134314.jpg' },
  { name: 'Fisherman Cable-Knit Merino', url: '/src/assets/images/fashion_knitwear_sweater_1792904136197.jpg' },
  { name: 'Vintage Selvedge Denim Jacket', url: '/src/assets/images/fashion_denim_jacket_1792904134671.jpg' },
  { name: 'Artisanal Linen & Silk Suite', url: '/src/assets/images/hero_editorial_garments_1792904133219.jpg' },
];

export const CreateListingModal: React.FC<CreateListingModalProps> = ({
  initialListing,
  onClose,
  onSubmit,
}) => {
  const isEditing = Boolean(initialListing);

  const [title, setTitle] = useState(initialListing?.title || '');
  const [brand, setBrand] = useState(initialListing?.brand || '');
  const [category, setCategory] = useState<GarmentCategory>(
    (initialListing?.category as GarmentCategory) || 'Tops'
  );
  const [size, setSize] = useState(initialListing?.size || 'M');
  const [condition, setCondition] = useState<GarmentCondition>(
    initialListing?.condition || 'Like new'
  );
  const [originalPrice, setOriginalPrice] = useState<number>(
    initialListing?.originalPrice || 120
  );
  const [material, setMaterial] = useState(initialListing?.material || '100% Organic Linen');
  const [color, setColor] = useState(initialListing?.color || 'Terracotta');
  const [gender, setGender] = useState<'Women' | 'Men' | 'Unisex'>(
    initialListing?.gender || 'Unisex'
  );
  const [location, setLocation] = useState(initialListing?.location || 'San Francisco, CA');
  const [description, setDescription] = useState(
    initialListing?.description || ''
  );
  const [imageUrl, setImageUrl] = useState<string>(
    initialListing?.images[0] || PRESET_IMAGES[0].url
  );

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Compute live value estimate
  const liveValuation = calculateSwapValue({
    originalPrice,
    category,
    condition,
    material: material.toLowerCase().includes('linen') || material.toLowerCase().includes('silk') || material.toLowerCase().includes('wool')
      ? 'Noble Natural (Linen, Silk, Cashmere, Merino)'
      : 'Sustainable Natural (Organic Cotton, Hemp, Tencel)',
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 8 * 1024 * 1024) {
      setError('Please choose an image under 8MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setImageUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !brand.trim()) {
      setError('Please provide a garment title and brand.');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      await onSubmit({
        title: title.trim(),
        brand: brand.trim(),
        category,
        size: size.trim(),
        condition,
        originalPrice: Number(originalPrice) || 80,
        indicativeValue: liveValuation.indicativeValue,
        material: material.trim(),
        color: color.trim(),
        gender,
        location: location.trim(),
        description: description.trim() || 'Mindfully kept sustainable garment ready for a new home.',
        images: [imageUrl],
      });

      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to save listing');
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
          <div>
            <h3 className="font-serif text-2xl font-bold text-[#24483D]">
              {isEditing ? 'Edit Clothing Listing' : 'List a Garment to Swap'}
            </h3>
            <p className="text-xs text-[#262A27]/70 mt-0.5">
              Give your pre-loved piece a second life in our circular fashion community.
            </p>
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

        <form onSubmit={handleSubmit} className="mt-5 space-y-5 text-xs">
          
          {/* Photo Section */}
          <div>
            <label className="block text-xs font-semibold text-[#24483D] uppercase tracking-wider mb-2">
              Garment Photography
            </label>

            <div className="flex flex-col sm:flex-row gap-4 items-start">
              {/* Preview */}
              <div className="w-32 h-32 rounded-lg bg-[#F8F6F0] border border-[#E9E1D5] overflow-hidden shrink-0 relative">
                <img
                  src={imageUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Upload & Presets */}
              <div className="flex-1 space-y-2.5">
                <label className="inline-flex items-center gap-1.5 px-3 py-2 border border-[#24483D] text-[#24483D] rounded-md hover:bg-[#24483D]/5 font-medium cursor-pointer transition-colors">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload from Computer</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>

                <p className="text-[11px] text-[#262A27]/60">
                  Or select a curated sustainable editorial photo preset:
                </p>

                <div className="flex flex-wrap gap-1.5">
                  {PRESET_IMAGES.map((preset, i) => (
                    <button
                      type="button"
                      key={i}
                      onClick={() => setImageUrl(preset.url)}
                      className={`text-[10px] px-2 py-1 rounded border cursor-pointer transition-all ${
                        imageUrl === preset.url
                          ? 'border-[#24483D] bg-[#24483D] text-white'
                          : 'border-[#E9E1D5] bg-[#F8F6F0] hover:border-[#A8B8A0]'
                      }`}
                    >
                      {preset.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Title & Brand */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-[#24483D] mb-1">Garment Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Terracotta Tiered Organic Linen Midi Dress"
                className="w-full p-2.5 rounded-md border border-[#E9E1D5] bg-white focus:outline-none focus:ring-1 focus:ring-[#24483D]"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#24483D] mb-1">Brand / Maker *</label>
              <input
                type="text"
                required
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="e.g. Dôen, Patagonia, Toast, Eileen Fisher"
                className="w-full p-2.5 rounded-md border border-[#E9E1D5] bg-white focus:outline-none focus:ring-1 focus:ring-[#24483D]"
              />
            </div>
          </div>

          {/* Category, Size, Condition */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-[#24483D] mb-1">Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as GarmentCategory)}
                className="w-full p-2.5 rounded-md border border-[#E9E1D5] bg-white focus:outline-none focus:ring-1 focus:ring-[#24483D]"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-[#24483D] mb-1">Size *</label>
              <input
                type="text"
                required
                value={size}
                onChange={(e) => setSize(e.target.value)}
                placeholder="e.g. S, M, L, 38, 32/32"
                className="w-full p-2.5 rounded-md border border-[#E9E1D5] bg-white focus:outline-none focus:ring-1 focus:ring-[#24483D]"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#24483D] mb-1">Condition *</label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value as GarmentCondition)}
                className="w-full p-2.5 rounded-md border border-[#E9E1D5] bg-white focus:outline-none focus:ring-1 focus:ring-[#24483D]"
              >
                {CONDITIONS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Original Retail Price & Live Swap Valuation */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-3.5 rounded-lg bg-[#F8F6F0] border border-[#E9E1D5]">
            <div>
              <label className="block font-semibold text-[#24483D] mb-1">
                Original Retail Price ($ USD)
              </label>
              <input
                type="number"
                min={10}
                max={5000}
                value={originalPrice}
                onChange={(e) => setOriginalPrice(Number(e.target.value))}
                className="w-full p-2.5 rounded-md border border-[#E9E1D5] bg-white focus:outline-none focus:ring-1 focus:ring-[#24483D]"
              />
              <span className="text-[10px] text-gray-500 mt-1 block">
                Approximate original store purchase price.
              </span>
            </div>

            <div className="flex flex-col justify-center">
              <span className="text-[10px] uppercase tracking-wider font-semibold text-[#24483D]">
                Auto-Calculated Swap Value
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="font-serif text-3xl font-bold text-[#24483D] tabular-nums">
                  ${liveValuation.indicativeValue}
                </span>
                <span className="text-[11px] text-[#C77D62] font-medium flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Fair Community Parity
                </span>
              </div>
              <span className="text-[10px] text-gray-500 mt-0.5">
                Factor: {(liveValuation.conditionMultiplier * 100).toFixed(0)}% retention for {condition}.
              </span>
            </div>
          </div>

          {/* Fabric Material, Color, Location */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-[#24483D] mb-1">Fabric / Material</label>
              <input
                type="text"
                value={material}
                onChange={(e) => setMaterial(e.target.value)}
                placeholder="e.g. 100% Organic Linen, Merino Wool"
                className="w-full p-2.5 rounded-md border border-[#E9E1D5] bg-white focus:outline-none focus:ring-1 focus:ring-[#24483D]"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#24483D] mb-1">Color / Wash</label>
              <input
                type="text"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                placeholder="e.g. Warm Ivory, Indigo, Sage"
                className="w-full p-2.5 rounded-md border border-[#E9E1D5] bg-white focus:outline-none focus:ring-1 focus:ring-[#24483D]"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#24483D] mb-1">Your Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Brooklyn, NY or Paris, France"
                className="w-full p-2.5 rounded-md border border-[#E9E1D5] bg-white focus:outline-none focus:ring-1 focus:ring-[#24483D]"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block font-semibold text-[#24483D] mb-1">
              Garment Story & Fit Notes
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the fit, how you styled it, care history, or any subtle details..."
              className="w-full p-2.5 rounded-md border border-[#E9E1D5] bg-white focus:outline-none focus:ring-1 focus:ring-[#24483D]"
            />
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E9E1D5]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 font-semibold text-[#262A27]/70 hover:bg-[#F8F6F0] rounded-md cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2.5 font-semibold text-white bg-[#24483D] hover:bg-[#1a342c] rounded-md transition-all shadow-sm active:scale-98 disabled:opacity-50 cursor-pointer"
            >
              {submitting ? 'Saving Piece...' : isEditing ? 'Update Listing' : 'Publish to Wardrobe'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
