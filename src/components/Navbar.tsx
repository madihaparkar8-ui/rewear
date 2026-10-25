import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import {
  Menu,
  X,
  PlusCircle,
  Repeat,
  Heart,
  MessageSquare,
  ShieldCheck,
  Calendar,
  User as UserIcon,
  LogOut,
  Sparkles,
} from 'lucide-react';

interface NavbarProps {
  activeView: string;
  setActiveView: (view: string) => void;
  onOpenAuth: (mode?: 'login' | 'signup') => void;
  onOpenCreateListing: () => void;
  onOpenCalculator: () => void;
  onOpenContact: () => void;
  onOpenAbout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeView,
  setActiveView,
  onOpenAuth,
  onOpenCreateListing,
  onOpenCalculator,
  onOpenContact,
  onOpenAbout,
}) => {
  const { user, logout, isAdmin } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const handleNavClick = (view: string) => {
    setActiveView(view);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-[#F8F6F0]/95 backdrop-blur-md border-b border-[#E9E1D5] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Bar Contract: 3 zones separated by gap-8 */}
        <div className="flex items-center justify-between gap-8 h-20">
          
          {/* Zone 1: Brand Wordmark */}
          <button
            onClick={() => handleNavClick('landing')}
            className="flex items-center gap-2 group text-left cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#24483D] rounded-sm shrink-0"
            aria-label="ReWear Home"
          >
            <div className="w-8 h-8 rounded-full bg-[#24483D] text-[#F8F6F0] flex items-center justify-center font-serif text-lg font-bold group-hover:bg-[#C77D62] transition-colors">
              R
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-2xl font-bold tracking-tight text-[#24483D] leading-none">
                ReWear
              </span>
              <span className="text-[10px] uppercase tracking-widest text-[#24483D]/70 font-medium">
                Circular Fashion
              </span>
            </div>
          </button>

          {/* Zone 2: Navigation Links (single-line text) */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-[#262A27]/80">
            <button
              onClick={() => handleNavClick('landing')}
              className={`hover:text-[#24483D] transition-colors whitespace-nowrap cursor-pointer py-1 ${
                activeView === 'landing' ? 'text-[#24483D] border-b-2 border-[#24483D] font-semibold' : ''
              }`}
            >
              Discover
            </button>
            <button
              onClick={() => handleNavClick('marketplace')}
              className={`hover:text-[#24483D] transition-colors whitespace-nowrap cursor-pointer py-1 ${
                activeView === 'marketplace' ? 'text-[#24483D] border-b-2 border-[#24483D] font-semibold' : ''
              }`}
            >
              Explore Wardrobe
            </button>
            <button
              onClick={() => {
                handleNavClick('landing');
                setTimeout(() => {
                  document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
              className="hover:text-[#24483D] transition-colors whitespace-nowrap cursor-pointer py-1"
            >
              How It Works
            </button>
            <button
              onClick={() => {
                handleNavClick('landing');
                setTimeout(() => {
                  document.getElementById('categories')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
              className="hover:text-[#24483D] transition-colors whitespace-nowrap cursor-pointer py-1"
            >
              Categories
            </button>
            <button
              onClick={onOpenCalculator}
              className="hover:text-[#24483D] transition-colors whitespace-nowrap cursor-pointer py-1 flex items-center gap-1.5 text-[#24483D]"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#C77D62]" />
              <span>Value Estimator</span>
            </button>
            <button
              onClick={() => {
                handleNavClick('landing');
                setTimeout(() => {
                  document.getElementById('faqs')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
              className="hover:text-[#24483D] transition-colors whitespace-nowrap cursor-pointer py-1"
            >
              FAQs
            </button>
          </nav>

          {/* Zone 3: Primary Action / User Profile */}
          <div className="flex items-center gap-3 shrink-0">
            {user ? (
              <div className="flex items-center gap-3">
                <button
                  onClick={onOpenCreateListing}
                  className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#24483D] hover:bg-[#1a342c] rounded-md transition-all shadow-sm hover:shadow active:scale-98 cursor-pointer"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>List an Item</span>
                </button>

                <div className="relative">
                  <button
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="flex items-center gap-2 p-1 pl-2 rounded-full border border-[#E9E1D5] hover:border-[#A8B8A0] bg-white transition-all cursor-pointer"
                    aria-label="User menu"
                  >
                    <span className="text-xs font-medium text-[#24483D] max-w-[100px] truncate hidden md:inline">
                      {user.name.split(' ')[0]}
                    </span>
                    <img
                      src={user.avatar}
                      alt={user.name}
                      referrerPolicy="no-referrer"
                      className="w-8 h-8 rounded-full object-cover border border-[#A8B8A0]/30"
                    />
                  </button>

                  {/* Profile Dropdown */}
                  {profileDropdownOpen && (
                    <div
                      className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-[#E9E1D5] py-2 z-50 text-xs text-[#262A27]"
                      onMouseLeave={() => setProfileDropdownOpen(false)}
                    >
                      <div className="px-4 py-2 border-b border-[#F8F6F0]">
                        <p className="font-semibold text-sm text-[#24483D] truncate">{user.name}</p>
                        <p className="text-[11px] text-gray-500 truncate">{user.email}</p>
                        <span className="inline-block mt-1 text-[10px] text-[#24483D] font-medium bg-[#A8B8A0]/20 px-2 py-0.5 rounded">
                          {user.role === 'admin' ? 'Curator & Admin' : 'Active Member'}
                        </span>
                      </div>

                      <button
                        onClick={() => {
                          handleNavClick('dashboard');
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-[#F8F6F0] flex items-center gap-2.5 cursor-pointer"
                      >
                        <UserIcon className="w-4 h-4 text-[#24483D]" />
                        <span>My Dashboard & Wardrobe</span>
                      </button>

                      <button
                        onClick={() => {
                          handleNavClick('dashboard-swaps');
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-[#F8F6F0] flex items-center gap-2.5 cursor-pointer"
                      >
                        <Repeat className="w-4 h-4 text-[#C77D62]" />
                        <span>Swap Exchanges</span>
                      </button>

                      <button
                        onClick={() => {
                          handleNavClick('dashboard-messages');
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-[#F8F6F0] flex items-center gap-2.5 cursor-pointer"
                      >
                        <MessageSquare className="w-4 h-4 text-[#24483D]" />
                        <span>Conversations</span>
                      </button>

                      <button
                        onClick={() => {
                          handleNavClick('dashboard-calendar');
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-[#F8F6F0] flex items-center gap-2.5 cursor-pointer"
                      >
                        <Calendar className="w-4 h-4 text-[#24483D]" />
                        <span>Swap Calendar</span>
                      </button>

                      <button
                        onClick={() => {
                          handleNavClick('dashboard-favorites');
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-[#F8F6F0] flex items-center gap-2.5 cursor-pointer"
                      >
                        <Heart className="w-4 h-4 text-[#C77D62]" />
                        <span>Saved Pieces</span>
                      </button>

                      {isAdmin && (
                        <button
                          onClick={() => {
                            handleNavClick('admin');
                            setProfileDropdownOpen(false);
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-[#24483D]/5 flex items-center gap-2.5 text-[#24483D] font-semibold border-t border-[#F8F6F0] cursor-pointer"
                        >
                          <ShieldCheck className="w-4 h-4 text-[#24483D]" />
                          <span>Admin Moderation</span>
                        </button>
                      )}

                      <div className="border-t border-[#F8F6F0] mt-1 pt-1">
                        <button
                          onClick={() => {
                            logout();
                            setProfileDropdownOpen(false);
                          }}
                          className="w-full text-left px-4 py-2 text-rose-700 hover:bg-rose-50 flex items-center gap-2.5 cursor-pointer"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Log Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => onOpenAuth('login')}
                  className="text-xs font-semibold text-[#24483D] hover:text-[#1a342c] px-3 py-2 rounded-md hover:bg-[#E9E1D5]/40 transition-colors cursor-pointer"
                >
                  Log In
                </button>
                <button
                  onClick={() => onOpenAuth('signup')}
                  className="px-4 py-2 text-xs font-semibold text-white bg-[#24483D] hover:bg-[#1a342c] rounded-md transition-all shadow-sm active:scale-98 cursor-pointer whitespace-nowrap"
                >
                  Start Swapping
                </button>
              </div>
            )}

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-[#24483D] hover:bg-[#E9E1D5]/40 rounded-md cursor-pointer"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-[#E9E1D5] px-4 pt-3 pb-6 space-y-3 shadow-md animate-in slide-in-from-top-2">
          <div className="flex flex-col space-y-2 text-sm font-medium text-[#262A27]">
            <button
              onClick={() => handleNavClick('landing')}
              className="text-left py-2 px-3 rounded hover:bg-[#F8F6F0] text-[#24483D]"
            >
              Discover Home
            </button>
            <button
              onClick={() => handleNavClick('marketplace')}
              className="text-left py-2 px-3 rounded hover:bg-[#F8F6F0]"
            >
              Explore Wardrobe
            </button>
            <button
              onClick={() => {
                handleNavClick('landing');
                setTimeout(() => {
                  document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
              className="text-left py-2 px-3 rounded hover:bg-[#F8F6F0]"
            >
              How It Works
            </button>
            <button
              onClick={() => {
                handleNavClick('landing');
                setTimeout(() => {
                  document.getElementById('categories')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
              className="text-left py-2 px-3 rounded hover:bg-[#F8F6F0]"
            >
              Garment Categories
            </button>
            <button
              onClick={() => {
                onOpenCalculator();
                setMobileMenuOpen(false);
              }}
              className="text-left py-2 px-3 rounded hover:bg-[#F8F6F0] text-[#24483D] flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-[#C77D62]" />
              <span>Transparent Value Estimator</span>
            </button>
            <button
              onClick={() => {
                onOpenAbout();
                setMobileMenuOpen(false);
              }}
              className="text-left py-2 px-3 rounded hover:bg-[#F8F6F0]"
            >
              About ReWear Story
            </button>
            <button
              onClick={() => {
                onOpenContact();
                setMobileMenuOpen(false);
              }}
              className="text-left py-2 px-3 rounded hover:bg-[#F8F6F0]"
            >
              Contact & Support
            </button>

            {user ? (
              <div className="pt-2 border-t border-[#E9E1D5] space-y-2">
                <button
                  onClick={() => {
                    onOpenCreateListing();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-center py-2.5 px-4 text-xs font-semibold text-white bg-[#24483D] rounded-md shadow-sm"
                >
                  + List a Clothing Item
                </button>
                <button
                  onClick={() => handleNavClick('dashboard')}
                  className="w-full text-left py-2 px-3 rounded hover:bg-[#F8F6F0]"
                >
                  My Wardrobe & Dashboard
                </button>
                <button
                  onClick={() => handleNavClick('dashboard-swaps')}
                  className="w-full text-left py-2 px-3 rounded hover:bg-[#F8F6F0]"
                >
                  My Swap Requests
                </button>
                <button
                  onClick={() => handleNavClick('dashboard-calendar')}
                  className="w-full text-left py-2 px-3 rounded hover:bg-[#F8F6F0]"
                >
                  Swap Exchange Calendar
                </button>
                {isAdmin && (
                  <button
                    onClick={() => handleNavClick('admin')}
                    className="w-full text-left py-2 px-3 rounded bg-[#24483D]/10 text-[#24483D] font-medium"
                  >
                    Admin Moderation Panel
                  </button>
                )}
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left py-2 px-3 rounded text-rose-700 hover:bg-rose-50"
                >
                  Log Out
                </button>
              </div>
            ) : (
              <div className="pt-2 border-t border-[#E9E1D5] flex gap-2">
                <button
                  onClick={() => {
                    onOpenAuth('login');
                    setMobileMenuOpen(false);
                  }}
                  className="flex-1 py-2 text-center text-xs font-semibold border border-[#24483D] text-[#24483D] rounded-md"
                >
                  Log In
                </button>
                <button
                  onClick={() => {
                    onOpenAuth('signup');
                    setMobileMenuOpen(false);
                  }}
                  className="flex-1 py-2 text-center text-xs font-semibold bg-[#24483D] text-white rounded-md"
                >
                  Start Swapping
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
