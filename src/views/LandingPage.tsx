import React, { useState } from 'react';
import { Listing, GarmentCategory } from '../types.ts';
import { ListingCard } from '../components/ListingCard.tsx';
import {
  ArrowRight,
  Sparkles,
  Repeat,
  ShieldCheck,
  Leaf,
  Layers,
  ChevronDown,
  PlusCircle,
  TrendingUp,
  Award,
} from 'lucide-react';

interface LandingPageProps {
  listings: Listing[];
  onExploreWardrobe: (category?: string) => void;
  onOpenCreateListing: () => void;
  onSelectListing: (listing: Listing) => void;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  onOpenCalculator: () => void;
}

const CATEGORIES: { name: GarmentCategory; image: string; count: string }[] = [
  { name: 'Dresses', image: '/src/assets/images/fashion_linen_dress_1792904133888.jpg', count: '4 Pieces' },
  { name: 'Jackets & Coats', image: '/src/assets/images/fashion_trench_coat_1792904134314.jpg', count: '5 Pieces' },
  { name: 'Tops', image: '/src/assets/images/fashion_knitwear_sweater_1792904136197.jpg', count: '4 Pieces' },
  { name: 'Shirts', image: '/src/assets/images/hero_editorial_garments_1792904133219.jpg', count: '3 Pieces' },
  { name: 'Ethnic Wear', image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80', count: '4 Pieces' },
  { name: 'Jeans & Pants', image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=800&q=80', count: '3 Pieces' },
  { name: 'Shoes', image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80', count: '3 Pieces' },
  { name: 'Bags', image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80', count: '3 Pieces' },
  { name: 'Accessories', image: 'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?auto=format&fit=crop&w=800&q=80', count: '3 Pieces' },
];

const FAQS = [
  {
    q: 'How does a clothing swap work on ReWear?',
    a: 'You list pre-loved garments from your closet with photos and condition details. When you find an item you like from another member, you submit a swap proposal offering one of your available pieces. Once the other member accepts, you coordinate an exchange date via our integrated swap calendar or postal tracking.',
  },
  {
    q: 'How is the indicative swap value calculated?',
    a: 'We use a transparent rule-based valuation model: original retail price × garment condition multiplier (e.g. 70% retention for New with tags, 55% for Like new) × material bonus (linen, merino, silk receive a +15% premium). It ensures fair, balanced 1-to-1 exchanges without commission fees or artificial tokens.',
  },
  {
    q: 'Can members negotiate or trade multiple items?',
    a: 'Yes. Our built-in chat lets members discuss fit, styling, and exchange logistics. If there is a value gap (for example, a trench coat offered for a scarf), the proposer can offer two items or discuss an arrangement directly in messages.',
  },
  {
    q: 'What condition must garments be in to be listed?',
    a: 'Every piece listed on ReWear must be thoroughly laundered or dry-cleaned and ready to wear immediately. We welcome New with tags, Like new, Gently worn, and Good condition pieces with honest disclosures of any light vintage wear.',
  },
  {
    q: 'Is ReWear really independent of fast-fashion brands?',
    a: 'Completely. ReWear is an independent sustainable collective. We do not accept sponsored fast-fashion drop integrations, affiliate commission links, or promotional brand placements.',
  },
];

export const LandingPage: React.FC<LandingPageProps> = ({
  listings,
  onExploreWardrobe,
  onOpenCreateListing,
  onSelectListing,
  onToggleFavorite,
  onOpenCalculator,
}) => {
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0);

  const featuredListings = listings.filter((l) => l.isFeatured).slice(0, 4);
  const communityListings = listings.slice(4, 10);

  return (
    <div className="space-y-24 pb-20">
      
      {/* 1. Hero Section with Editorial Fashion Composition */}
      <section className="relative pt-6 sm:pt-10 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            
            {/* Left Column: Typography & CTAs */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E9E1D5]/60 text-[#24483D] text-xs font-medium tracking-wide">
                <Leaf className="w-3.5 h-3.5 text-[#24483D]" />
                <span>The Independent Circular Wardrobe</span>
              </div>

              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-[#24483D] tracking-tight leading-[1.08] text-balance">
                Your next favourite outfit is already out there.
              </h1>

              <p className="text-base sm:text-lg text-[#262A27]/80 leading-relaxed max-w-xl">
                Give your wardrobe a second life. Discover pre-loved fashion, exchange pieces you no longer wear, and find something new without buying new.
              </p>

              {/* Primary & Secondary Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                <button
                  onClick={() => onExploreWardrobe()}
                  className="px-6 py-3.5 text-sm font-semibold text-white bg-[#24483D] hover:bg-[#1a342c] rounded-md transition-all shadow-sm hover:shadow active:scale-98 cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Explore the Wardrobe</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={onOpenCreateListing}
                  className="px-6 py-3.5 text-sm font-semibold text-[#24483D] border border-[#24483D] hover:bg-[#24483D]/5 rounded-md transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>List an Item</span>
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="pt-6 border-t border-[#E9E1D5] grid grid-cols-3 gap-4 text-xs">
                <div>
                  <span className="font-serif text-xl font-bold text-[#24483D] block">0%</span>
                  <span className="text-[#262A27]/60">Platform Fees</span>
                </div>
                <div>
                  <span className="font-serif text-xl font-bold text-[#24483D] block">1-to-1</span>
                  <span className="text-[#262A27]/60">Fair Parity Swaps</span>
                </div>
                <div>
                  <span className="font-serif text-xl font-bold text-[#24483D] block">Natural</span>
                  <span className="text-[#262A27]/60">Durable Textiles</span>
                </div>
              </div>
            </div>

            {/* Right Column: Editorial Photo Composition */}
            <div className="lg:col-span-6 relative">
              <div className="relative rounded-2xl overflow-hidden border border-[#E9E1D5] shadow-xl aspect-[16/10] sm:aspect-[4/3] bg-[#E9E1D5]/30">
                <img
                  src="/src/assets/images/hero_editorial_garments_1792904133219.jpg"
                  alt="Curated artisanal garments hanging on oak rail in warm daylight studio"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                
                {/* Floating Editorial Callout Card */}
                <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:max-w-xs bg-white/95 backdrop-blur-md p-3.5 rounded-lg border border-[#E9E1D5] shadow-lg text-xs">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-2 h-2 rounded-full bg-[#24483D]" />
                    <span className="font-semibold text-[#24483D] uppercase text-[10px] tracking-wider">
                      Featured Swap Capsule
                    </span>
                  </div>
                  <p className="text-[#262A27] font-serif text-sm font-semibold">
                    French Washed Linen & Scottish Knits
                  </p>
                  <p className="text-[#262A27]/60 text-[11px] mt-0.5">
                    Curated organic pieces in Paris and Copenhagen.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Featured Clothing Listings */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-baseline justify-between mb-8 pb-4 border-b border-[#E9E1D5]">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#C77D62]">
              Curated Exchanges
            </span>
            <h2 className="font-serif text-3xl font-bold text-[#24483D] mt-1">
              Featured Wardrobe Pieces
            </h2>
          </div>
          <button
            onClick={() => onExploreWardrobe()}
            className="text-xs font-semibold text-[#24483D] hover:text-[#C77D62] transition-colors flex items-center gap-1 mt-2 sm:mt-0 cursor-pointer"
          >
            <span>View All Pieces ({listings.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredListings.map((item) => (
            <ListingCard
              key={item.id}
              listing={item}
              onClick={onSelectListing}
              onToggleFavorite={onToggleFavorite}
            />
          ))}
        </div>
      </section>

      {/* 3. Shop by Category */}
      <section id="categories" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#C77D62]">
            Curated Taxonomy
          </span>
          <h2 className="font-serif text-3xl font-bold text-[#24483D] mt-1">
            Browse by Garment Category
          </h2>
          <p className="text-xs sm:text-sm text-[#262A27]/70 mt-2">
            Filter our circular community wardrobe by tailoring, silhouette, or textile category.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
          {CATEGORIES.map((cat, idx) => (
            <button
              key={idx}
              onClick={() => onExploreWardrobe(cat.name)}
              className="group relative rounded-xl overflow-hidden aspect-[4/5] border border-[#E9E1D5] text-left cursor-pointer transition-all duration-300 hover:shadow-lg"
            >
              <img
                src={cat.image}
                alt={cat.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 text-white">
                <span className="text-[10px] text-[#A8B8A0] font-medium block">
                  {cat.count}
                </span>
                <span className="font-serif text-base font-semibold group-hover:text-[#E9E1D5] transition-colors leading-tight block">
                  {cat.name}
                </span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* 4. How ReWear Works in Three Steps: List, Match, Swap */}
      <section id="how-it-works" className="bg-[#E9E1D5]/40 py-20 border-y border-[#E9E1D5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-14">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#C77D62]">
              Circular Process
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#24483D] mt-1">
              How Swapping Works in Three Steps
            </h2>
            <p className="text-xs sm:text-sm text-[#262A27]/70 mt-2">
              Simple, transparent, and direct peer-to-peer exchanges without retail middlemen.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Step 1 */}
            <div className="bg-white rounded-xl p-8 border border-[#E9E1D5] shadow-xs relative">
              <div className="w-10 h-10 rounded-full bg-[#24483D] text-[#F8F6F0] flex items-center justify-center font-serif text-lg font-bold mb-5">
                01
              </div>
              <h3 className="font-serif text-xl font-bold text-[#24483D] mb-2">
                List Your Garment
              </h3>
              <p className="text-xs text-[#262A27]/75 leading-relaxed mb-4">
                Upload clear photography of quality clothes you no longer wear. Specify fabric, brand, and condition. Our transparent estimator calculates an indicative swap value.
              </p>
              <div className="text-[11px] text-[#C77D62] font-medium flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Automatic Parity Valuation</span>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-xl p-8 border border-[#E9E1D5] shadow-xs relative">
              <div className="w-10 h-10 rounded-full bg-[#C77D62] text-white flex items-center justify-center font-serif text-lg font-bold mb-5">
                02
              </div>
              <h3 className="font-serif text-xl font-bold text-[#24483D] mb-2">
                Discover & Propose Match
              </h3>
              <p className="text-xs text-[#262A27]/75 leading-relaxed mb-4">
                Browse by size, silhouette, and location. When you spot a piece you love, select an item from your wardrobe to offer in direct exchange with a personal note.
              </p>
              <div className="text-[11px] text-[#24483D] font-medium flex items-center gap-1">
                <Repeat className="w-3.5 h-3.5" />
                <span>Balanced 1-to-1 Exchange</span>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-white rounded-xl p-8 border border-[#E9E1D5] shadow-xs relative">
              <div className="w-10 h-10 rounded-full bg-[#24483D] text-[#F8F6F0] flex items-center justify-center font-serif text-lg font-bold mb-5">
                03
              </div>
              <h3 className="font-serif text-xl font-bold text-[#24483D] mb-2">
                Coordinate & Swap
              </h3>
              <p className="text-xs text-[#262A27]/75 leading-relaxed mb-4">
                Chat securely to confirm packaging or meetup details. Schedule the exchange date on your built-in calendar and mark completed once both garments arrive safely.
              </p>
              <div className="text-[11px] text-[#24483D] font-medium flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verified Community History</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Why Swap with ReWear */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#C77D62]">
              The Sustainable Advantage
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#24483D] mt-1 leading-snug">
              Why mindful dressers choose swapping over resale apps.
            </h2>
            <p className="text-sm text-[#262A27]/80 mt-4 leading-relaxed">
              Traditional resale platforms charge 20–30% seller commissions and encourage compulsive buying. ReWear is a true community exchange where currency is substituted with garment respect.
            </p>

            <div className="mt-8 space-y-4 text-xs">
              <div className="flex items-start gap-3.5 p-3.5 rounded-lg bg-white border border-[#E9E1D5]">
                <div className="p-2 rounded bg-[#24483D]/10 text-[#24483D] shrink-0">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-[#24483D]">100% Commission-Free</h4>
                  <p className="text-[#262A27]/70 mt-0.5">
                    Keep the full intrinsic value of your garments without paying platform take-rates.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-3.5 rounded-lg bg-white border border-[#E9E1D5]">
                <div className="p-2 rounded bg-[#24483D]/10 text-[#24483D] shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-[#24483D]">Transparent Open Parity Formula</h4>
                  <p className="text-[#262A27]/70 mt-0.5">
                    No black-box pricing algorithms. Both participants see the formula behind indicative values.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-3.5 rounded-lg bg-white border border-[#E9E1D5]">
                <div className="p-2 rounded bg-[#24483D]/10 text-[#24483D] shrink-0">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-[#24483D]">Natural & Noble Fiber Focus</h4>
                  <p className="text-[#262A27]/70 mt-0.5">
                    Our community champions linen, wool, raw silk, and durable cotton that age with character.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-2xl overflow-hidden border border-[#E9E1D5] shadow-lg aspect-[4/3] bg-[#F8F6F0]">
              <img
                src="/src/assets/images/fashion_trench_coat_1792904134314.jpg"
                alt="Forest green tailored trench coat"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 6. Featured Community Listings */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-baseline justify-between mb-8 pb-4 border-b border-[#E9E1D5]">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#C77D62]">
              Community Wardrobes
            </span>
            <h2 className="font-serif text-3xl font-bold text-[#24483D] mt-1">
              Freshly Listed Pieces
            </h2>
          </div>
          <button
            onClick={() => onExploreWardrobe()}
            className="text-xs font-semibold text-[#24483D] hover:text-[#C77D62] transition-colors flex items-center gap-1 cursor-pointer"
          >
            <span>Browse Full Marketplace</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {communityListings.map((item) => (
            <ListingCard
              key={item.id}
              listing={item}
              onClick={onSelectListing}
              onToggleFavorite={onToggleFavorite}
            />
          ))}
        </div>
      </section>

      {/* 7. Sustainable Fashion Information Section */}
      <section id="sustainability" className="bg-[#24483D] text-[#F8F6F0] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="text-xs uppercase tracking-widest text-[#A8B8A0] font-semibold">
              Conscious Fashion Realities
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold mt-2 text-white">
              The ecological power of extending a garment's life.
            </h2>
            <p className="text-sm text-[#F8F6F0]/80 mt-4 leading-relaxed">
              Fast fashion emits more carbon emissions annually than international flights and maritime shipping combined. Extending the active lifespan of clothing by just 9 months through swapping reduces its carbon, water, and waste footprints by 20 to 30 percent.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 pt-8 border-t border-white/10 text-xs">
            <div>
              <p className="font-serif text-3xl font-bold text-[#A8B8A0] tabular-nums">2,700 L</p>
              <p className="font-semibold text-sm text-white mt-1">Freshwater Conserved</p>
              <p className="text-[#F8F6F0]/70 mt-1 leading-relaxed">
                The amount of water required to produce a single conventional cotton shirt is completely spared through one swap.
              </p>
            </div>

            <div>
              <p className="font-serif text-3xl font-bold text-[#A8B8A0] tabular-nums">14.2 kg</p>
              <p className="font-semibold text-sm text-white mt-1">CO₂ Emissions Prevented</p>
              <p className="text-[#F8F6F0]/70 mt-1 leading-relaxed">
                Skipping raw material processing, chemical dyeing, and intercontinental shipping keeps greenhouse gases grounded.
              </p>
            </div>

            <div>
              <p className="font-serif text-3xl font-bold text-[#A8B8A0] tabular-nums">100%</p>
              <p className="font-semibold text-sm text-white mt-1">Landfill Diversion</p>
              <p className="text-[#F8F6F0]/70 mt-1 leading-relaxed">
                Durable garments in noble wool, linen, and denim continue telling stories across wardrobes rather than degrading in trash.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. FAQs Section with Expandable Answers */}
      <section id="faqs" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#C77D62]">
            Clarity & Guidance
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#24483D] mt-1">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-[#262A27]/70 mt-2">
            Everything you need to know about swapping, shipping, and valuation on ReWear.
          </p>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, idx) => {
            const isOpen = openFaqIdx === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-lg border border-[#E9E1D5] overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenFaqIdx(isOpen ? null : idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-[#F8F6F0]/50 transition-colors"
                  aria-expanded={isOpen}
                >
                  <span className="font-serif text-lg font-bold text-[#24483D]">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-[#24483D] shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-[#262A27]/80 leading-relaxed border-t border-[#F8F6F0] animate-in fade-in">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 9. Strong Final Call to Action */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-[#E9E1D5]/60 border border-[#E9E1D5] p-8 sm:p-14 text-center relative overflow-hidden">
          <div className="max-w-xl mx-auto space-y-4">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#C77D62]">
              Join the Collective
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#24483D] leading-tight">
              Ready to rewear and renew your style?
            </h2>
            <p className="text-xs sm:text-sm text-[#262A27]/80 leading-relaxed">
              Exchange pieces you've loved for something fresh. List your first garment in 2 minutes or browse what members are offering right now.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
              <button
                onClick={() => onExploreWardrobe()}
                className="w-full sm:w-auto px-6 py-3.5 text-xs font-semibold text-white bg-[#24483D] hover:bg-[#1a342c] rounded-md transition-all shadow-sm active:scale-98 cursor-pointer"
              >
                Explore the Wardrobe
              </button>
              <button
                onClick={onOpenCreateListing}
                className="w-full sm:w-auto px-6 py-3.5 text-xs font-semibold text-[#24483D] border border-[#24483D] hover:bg-[#24483D]/5 rounded-md transition-all cursor-pointer"
              >
                List Your First Garment
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
