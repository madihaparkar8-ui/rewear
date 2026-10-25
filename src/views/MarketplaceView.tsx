import React, { useState, useMemo } from 'react';
import { Listing, GarmentCategory } from '../types.ts';
import { ListingCard } from '../components/ListingCard.tsx';
import { Search, Filter, RotateCcw, ChevronDown, Sparkles } from 'lucide-react';

interface MarketplaceViewProps {
  listings: Listing[];
  initialCategory?: string;
  onSelectListing: (listing: Listing) => void;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  onOpenCreateListing: () => void;
  onOpenCalculator: () => void;
}

const CATEGORIES: string[] = [
  'All',
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

const SIZES = ['All', 'XS', 'S', 'M', 'L', 'XL', 'Free Size'];
const CONDITIONS = ['All', 'New with tags', 'Like new', 'Gently worn', 'Good'];
const LOCATIONS = ['All', 'San Francisco', 'Paris', 'Copenhagen', 'Brooklyn', 'Mumbai'];

export const MarketplaceView: React.FC<MarketplaceViewProps> = ({
  listings,
  initialCategory = 'All',
  onSelectListing,
  onToggleFavorite,
  onOpenCreateListing,
  onOpenCalculator,
}) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedSize, setSelectedSize] = useState<string>('All');
  const [selectedCondition, setSelectedCondition] = useState<string>('All');
  const [selectedLocation, setSelectedLocation] = useState<string>('All');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [visibleCount, setVisibleCount] = useState<number>(12);

  // Client-side filtering and sorting for instant responsiveness
  const filteredListings = useMemo(() => {
    let result = [...listings];

    if (selectedCategory !== 'All') {
      result = result.filter(
        (item) => item.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    if (selectedSize !== 'All') {
      result = result.filter((item) =>
        item.size.toLowerCase().includes(selectedSize.toLowerCase())
      );
    }

    if (selectedCondition !== 'All') {
      result = result.filter((item) => item.condition === selectedCondition);
    }

    if (selectedLocation !== 'All') {
      result = result.filter((item) =>
        item.location.toLowerCase().includes(selectedLocation.toLowerCase())
      );
    }

    if (search.trim()) {
      const q = search.toLowerCase().trim();
      result = result.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.brand.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q) ||
          (item.material && item.material.toLowerCase().includes(q))
      );
    }

    // Sort
    switch (sortBy) {
      case 'value_asc':
        result.sort((a, b) => a.indicativeValue - b.indicativeValue);
        break;
      case 'value_desc':
        result.sort((a, b) => b.indicativeValue - a.indicativeValue);
        break;
      case 'views':
        result.sort((a, b) => (b.views || 0) - (a.views || 0));
        break;
      case 'newest':
      default:
        result.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
    }

    return result;
  }, [listings, selectedCategory, selectedSize, selectedCondition, selectedLocation, search, sortBy]);

  const displayedListings = filteredListings.slice(0, visibleCount);

  const resetFilters = () => {
    setSearch('');
    setSelectedCategory('All');
    setSelectedSize('All');
    setSelectedCondition('All');
    setSelectedLocation('All');
    setSortBy('newest');
  };

  const hasActiveFilters =
    search !== '' ||
    selectedCategory !== 'All' ||
    selectedSize !== 'All' ||
    selectedCondition !== 'All' ||
    selectedLocation !== 'All';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Page Title & Utility CTA */}
      <div className="flex flex-col sm:flex-row items-baseline justify-between gap-4 border-b border-[#E9E1D5] pb-6">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#C77D62]">
            Circular Wardrobe
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#24483D] mt-1">
            Explore All Available Pieces
          </h1>
          <p className="text-xs text-[#262A27]/70 mt-1">
            Over {listings.length} authenticated garments ready for direct exchange.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenCalculator}
            className="px-3.5 py-2 text-xs font-semibold text-[#24483D] bg-white border border-[#E9E1D5] hover:border-[#A8B8A0] rounded-md transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#C77D62]" />
            <span>Valuation Helper</span>
          </button>
          <button
            onClick={onOpenCreateListing}
            className="px-4 py-2 text-xs font-semibold text-white bg-[#24483D] hover:bg-[#1a342c] rounded-md transition-all shadow-sm active:scale-98 cursor-pointer"
          >
            + List an Item
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="space-y-4">
        
        {/* Search input + Dropdowns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          
          {/* Search Bar */}
          <div className="lg:col-span-2 relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by brand, garment, linen, wool..."
              className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-[#E9E1D5] bg-white text-xs text-[#262A27] focus:outline-none focus:ring-1 focus:ring-[#24483D]"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-3 text-xs text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>

          {/* Size Filter */}
          <div>
            <select
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value)}
              className="w-full py-2.5 px-3 rounded-lg border border-[#E9E1D5] bg-white text-xs text-[#262A27] focus:outline-none focus:ring-1 focus:ring-[#24483D]"
            >
              <option value="All">All Sizes</option>
              {SIZES.filter((s) => s !== 'All').map((s) => (
                <option key={s} value={s}>
                  Size: {s}
                </option>
              ))}
            </select>
          </div>

          {/* Condition Filter */}
          <div>
            <select
              value={selectedCondition}
              onChange={(e) => setSelectedCondition(e.target.value)}
              className="w-full py-2.5 px-3 rounded-lg border border-[#E9E1D5] bg-white text-xs text-[#262A27] focus:outline-none focus:ring-1 focus:ring-[#24483D]"
            >
              <option value="All">All Conditions</option>
              {CONDITIONS.filter((c) => c !== 'All').map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full py-2.5 px-3 rounded-lg border border-[#E9E1D5] bg-white text-xs text-[#262A27] focus:outline-none focus:ring-1 focus:ring-[#24483D]"
            >
              <option value="newest">Sort: Newly Listed</option>
              <option value="value_asc">Swap Value: Low to High</option>
              <option value="value_desc">Swap Value: High to Low</option>
              <option value="views">Most Viewed</option>
            </select>
          </div>
        </div>

        {/* Category Horizontal Filter Tabs (Zero-Pill interactive controls) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 pt-1 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-md whitespace-nowrap cursor-pointer transition-colors ${
                selectedCategory === cat
                  ? 'bg-[#24483D] text-white shadow-xs'
                  : 'bg-white text-[#262A27]/80 border border-[#E9E1D5] hover:border-[#A8B8A0]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Active Filters Summary & Count */}
        <div className="flex items-center justify-between text-xs text-[#262A27]/70 pt-1">
          <p>
            Showing <strong className="text-[#24483D] tabular-nums">{filteredListings.length}</strong> pieces
            {selectedCategory !== 'All' && <span> in {selectedCategory}</span>}
          </p>

          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="text-xs text-[#C77D62] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset all filters</span>
            </button>
          )}
        </div>
      </div>

      {/* Grid of Listings */}
      {filteredListings.length === 0 ? (
        <div className="bg-white rounded-xl border border-[#E9E1D5] p-12 text-center space-y-3">
          <p className="font-serif text-2xl font-bold text-[#24483D]">
            No wardrobe pieces found matching your filters
          </p>
          <p className="text-xs text-[#262A27]/70 max-w-sm mx-auto">
            Try adjusting your search terms, selecting a broader category, or resetting size filters.
          </p>
          <div className="pt-2">
            <button
              onClick={resetFilters}
              className="px-4 py-2 text-xs font-semibold text-white bg-[#24483D] rounded-md hover:bg-[#1a342c] cursor-pointer"
            >
              Clear Filters
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {displayedListings.map((item) => (
              <ListingCard
                key={item.id}
                listing={item}
                onClick={onSelectListing}
                onToggleFavorite={onToggleFavorite}
              />
            ))}
          </div>

          {/* Load More Pagination */}
          {visibleCount < filteredListings.length && (
            <div className="text-center pt-4">
              <button
                onClick={() => setVisibleCount((prev) => prev + 8)}
                className="px-6 py-3 text-xs font-semibold text-[#24483D] border border-[#24483D] hover:bg-[#24483D]/5 rounded-md transition-all cursor-pointer"
              >
                Load More Pieces ({filteredListings.length - visibleCount} remaining)
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
