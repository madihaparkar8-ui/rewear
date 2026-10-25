import React from 'react';
import { ArrowUpRight, Leaf, Shield, HeartHandshake } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: string) => void;
  onOpenAbout: () => void;
  onOpenContact: () => void;
  onOpenCalculator: () => void;
  onOpenTerms: () => void;
  onOpenPrivacy: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigate,
  onOpenAbout,
  onOpenContact,
  onOpenCalculator,
  onOpenTerms,
  onOpenPrivacy,
}) => {
  return (
    <footer className="bg-[#262A27] text-[#F8F6F0] pt-16 pb-12 border-t border-[#262A27]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Trust Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-12 border-b border-[#F8F6F0]/10 text-xs">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-md bg-[#24483D] text-[#A8B8A0] shrink-0">
              <Leaf className="w-4 h-4" />
            </div>
            <div>
              <p className="font-semibold text-sm text-[#F8F6F0]">Zero-Waste Wardrobes</p>
              <p className="text-[#F8F6F0]/70 mt-1 leading-relaxed">
                Extending garment lifespans through direct swaps diverts tons of quality textile fiber from landfills.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 rounded-md bg-[#24483D] text-[#A8B8A0] shrink-0">
              <HeartHandshake className="w-4 h-4" />
            </div>
            <div>
              <p className="font-semibold text-sm text-[#F8F6F0]">Community Value Parity</p>
              <p className="text-[#F8F6F0]/70 mt-1 leading-relaxed">
                Our transparent valuation model evaluates garment material, condition, and original retail price for fair swaps.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 rounded-md bg-[#24483D] text-[#A8B8A0] shrink-0">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <p className="font-semibold text-sm text-[#F8F6F0]">Peer-to-Peer Moderation</p>
              <p className="text-[#F8F6F0]/70 mt-1 leading-relaxed">
                Verified member profiles, tracked exchange schedules, and moderated listings ensure safe community trades.
              </p>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 py-12 border-b border-[#F8F6F0]/10">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-full bg-[#A8B8A0] text-[#24483D] flex items-center justify-center font-serif text-base font-bold">
                R
              </div>
              <span className="font-serif text-2xl font-bold tracking-tight text-[#F8F6F0]">
                ReWear
              </span>
            </div>
            <p className="text-xs text-[#F8F6F0]/70 max-w-sm leading-relaxed mb-6">
              An independent circular fashion platform empowering mindful wardrobes. Exchange timeless garments, reduce fashion footprint, and discover pieces with stories.
            </p>
            <div className="text-[11px] text-[#A8B8A0] flex items-center gap-2">
              <span>Independent Circular Economy Project</span>
              <span>·</span>
              <span>Established 2026</span>
            </div>
          </div>

          {/* Explore */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#A8B8A0] mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-xs text-[#F8F6F0]/80">
              <li>
                <button
                  onClick={() => onNavigate('marketplace')}
                  className="hover:text-[#A8B8A0] transition-colors cursor-pointer text-left"
                >
                  All Wardrobe Items
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onNavigate('landing');
                    setTimeout(() => {
                      document.getElementById('categories')?.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                  }}
                  className="hover:text-[#A8B8A0] transition-colors cursor-pointer text-left"
                >
                  Browse Categories
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onNavigate('landing');
                    setTimeout(() => {
                      document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                  }}
                  className="hover:text-[#A8B8A0] transition-colors cursor-pointer text-left"
                >
                  How Swapping Works
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenCalculator}
                  className="hover:text-[#A8B8A0] transition-colors cursor-pointer text-left flex items-center gap-1 text-[#C77D62]"
                >
                  <span>Value Calculator</span>
                  <ArrowUpRight className="w-3 h-3" />
                </button>
              </li>
            </ul>
          </div>

          {/* Initiative */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#A8B8A0] mb-4">
              About
            </h4>
            <ul className="space-y-2.5 text-xs text-[#F8F6F0]/80">
              <li>
                <button
                  onClick={onOpenAbout}
                  className="hover:text-[#A8B8A0] transition-colors cursor-pointer text-left"
                >
                  Our Philosophy
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onNavigate('landing');
                    setTimeout(() => {
                      document.getElementById('sustainability')?.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                  }}
                  className="hover:text-[#A8B8A0] transition-colors cursor-pointer text-left"
                >
                  Textile Impact
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onNavigate('landing');
                    setTimeout(() => {
                      document.getElementById('faqs')?.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                  }}
                  className="hover:text-[#A8B8A0] transition-colors cursor-pointer text-left"
                >
                  Community FAQs
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenContact}
                  className="hover:text-[#A8B8A0] transition-colors cursor-pointer text-left"
                >
                  Contact & Inquiries
                </button>
              </li>
            </ul>
          </div>

          {/* Legal / Guidelines */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#A8B8A0] mb-4">
              Trust & Legal
            </h4>
            <ul className="space-y-2.5 text-xs text-[#F8F6F0]/80">
              <li>
                <button
                  onClick={onOpenTerms}
                  className="hover:text-[#A8B8A0] transition-colors cursor-pointer text-left"
                >
                  Terms of Exchange
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenPrivacy}
                  className="hover:text-[#A8B8A0] transition-colors cursor-pointer text-left"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenAbout}
                  className="hover:text-[#A8B8A0] transition-colors cursor-pointer text-left"
                >
                  Garment Standards
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Attribution */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#F8F6F0]/60 gap-4">
          <p>© {new Date().getFullYear()} ReWear Marketplace. Crafted for thoughtful fashion.</p>
          <p className="text-[11px]">
            Designed with warm natural textures and circular fashion principles.
          </p>
        </div>
      </div>
    </footer>
  );
};
