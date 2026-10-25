import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { Listing, AdminStats } from '../types.ts';
import {
  ShieldCheck,
  Users,
  Shirt,
  Repeat,
  Sparkles,
  Trash2,
  Star,
  CheckCircle,
  AlertCircle,
  Layers,
} from 'lucide-react';

interface AdminPanelViewProps {
  onSelectListing: (listing: Listing) => void;
  onRefreshData: () => Promise<void>;
}

export const AdminPanelView: React.FC<AdminPanelViewProps> = ({
  onSelectListing,
  onRefreshData,
}) => {
  const { user, isAdmin, authHeaders } = useAuth();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [adminListings, setAdminListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionMsg, setActionMsg] = useState<string | null>(null);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [statsRes, listingsRes] = await Promise.all([
        fetch('/api/admin/stats', { headers: authHeaders() }),
        fetch('/api/admin/listings', { headers: authHeaders() }),
      ]);

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData.stats);
      }
      if (listingsRes.ok) {
        const listingsData = await listingsRes.json();
        setAdminListings(listingsData.listings || []);
      }
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchAdminData();
    }
  }, [isAdmin]);

  const toggleFeatured = async (listingId: string, currentFeatured: boolean) => {
    try {
      const res = await fetch(`/api/admin/listings/${listingId}/featured`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders(),
        },
        body: JSON.stringify({ isFeatured: !currentFeatured }),
      });

      if (res.ok) {
        setActionMsg(`Listing ${listingId} featured status updated.`);
        setTimeout(() => setActionMsg(null), 3000);
        await fetchAdminData();
        await onRefreshData();
      }
    } catch (err) {
      console.error('Error toggling featured:', err);
    }
  };

  const deleteListing = async (listingId: string) => {
    if (!confirm('Are you sure you want to delete this listing from the database?')) return;
    try {
      const res = await fetch(`/api/listings/${listingId}`, {
        method: 'DELETE',
        headers: authHeaders(),
      });
      if (res.ok) {
        setActionMsg(`Listing ${listingId} removed by administrator.`);
        setTimeout(() => setActionMsg(null), 3000);
        await fetchAdminData();
        await onRefreshData();
      }
    } catch (err) {
      console.error('Error deleting listing:', err);
    }
  };

  if (!isAdmin) {
    return (
      <div className="max-w-xl mx-auto py-16 px-4 text-center space-y-3">
        <AlertCircle className="w-12 h-12 text-rose-600 mx-auto" />
        <h2 className="font-serif text-2xl font-bold text-[#24483D]">Access Restricted</h2>
        <p className="text-xs text-[#262A27]/70">
          This panel is protected for verified ReWear administrators only.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-baseline justify-between gap-4 border-b border-[#E9E1D5] pb-5">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#24483D]" />
            <span className="text-xs font-semibold uppercase tracking-wider text-[#24483D]">
              Platform Governance
            </span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-[#24483D] mt-1">
            Administrator & Moderation Panel
          </h1>
          <p className="text-xs text-[#262A27]/70 mt-1">
            Logged in as {user?.name} ({user?.email}) · Full system authority
          </p>
        </div>

        <button
          onClick={fetchAdminData}
          className="px-4 py-2 text-xs font-semibold text-[#24483D] bg-white border border-[#E9E1D5] hover:border-[#A8B8A0] rounded-md transition-colors cursor-pointer"
        >
          Refresh Database Stats
        </button>
      </div>

      {actionMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-md text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>{actionMsg}</span>
        </div>
      )}

      {/* Database Activity KPI Metrics */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl border border-[#E9E1D5] p-5 shadow-xs">
            <span className="text-xs text-gray-500 uppercase tracking-wider block">Total Members</span>
            <span className="font-serif text-3xl font-bold text-[#24483D] tabular-nums mt-1 block">
              {stats.totalUsers}
            </span>
            <span className="text-[11px] text-[#A8B8A0] mt-1 block">Active Profiles</span>
          </div>

          <div className="bg-white rounded-xl border border-[#E9E1D5] p-5 shadow-xs">
            <span className="text-xs text-gray-500 uppercase tracking-wider block">Live Listings</span>
            <span className="font-serif text-3xl font-bold text-[#24483D] tabular-nums mt-1 block">
              {stats.totalListings}
            </span>
            <span className="text-[11px] text-[#24483D] mt-1 block">
              {stats.availableListings} Available · {stats.inSwapListings} In Swap
            </span>
          </div>

          <div className="bg-white rounded-xl border border-[#E9E1D5] p-5 shadow-xs">
            <span className="text-xs text-gray-500 uppercase tracking-wider block">Swap Exchanges</span>
            <span className="font-serif text-3xl font-bold text-[#24483D] tabular-nums mt-1 block">
              {stats.totalSwaps}
            </span>
            <span className="text-[11px] text-emerald-700 font-medium mt-1 block">
              {stats.completedSwaps} Completed ({stats.pendingSwaps} Pending)
            </span>
          </div>

          <div className="bg-white rounded-xl border border-[#E9E1D5] p-5 shadow-xs">
            <span className="text-xs text-gray-500 uppercase tracking-wider block">Direct Messages</span>
            <span className="font-serif text-3xl font-bold text-[#24483D] tabular-nums mt-1 block">
              {stats.totalMessages}
            </span>
            <span className="text-[11px] text-gray-500 mt-1 block">Community Chats</span>
          </div>
        </div>
      )}

      {/* Category Breakdown */}
      {stats?.categoryDistribution && (
        <div className="bg-white rounded-xl border border-[#E9E1D5] p-5 shadow-xs space-y-3">
          <h3 className="font-serif text-lg font-bold text-[#24483D] flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#C77D62]" />
            Garment Inventory Distribution
          </h3>
          <div className="flex flex-wrap gap-2 pt-1 text-xs">
            {Object.entries(stats.categoryDistribution).map(([cat, count]) => (
              <div
                key={cat}
                className="p-2.5 rounded-lg bg-[#F8F6F0] border border-[#E9E1D5] flex items-center gap-2"
              >
                <span className="font-medium text-[#24483D]">{cat}</span>
                <span className="font-bold tabular-nums text-white bg-[#24483D] px-1.5 py-0.5 rounded text-[11px]">
                  {count}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Listings Moderation Table */}
      <div className="bg-white rounded-xl border border-[#E9E1D5] overflow-hidden shadow-xs">
        <div className="p-4 border-b border-[#E9E1D5] bg-[#F8F6F0]/40 flex items-center justify-between">
          <h3 className="font-serif text-lg font-bold text-[#24483D]">
            All Wardrobe Listings Moderation ({adminListings.length})
          </h3>
          <span className="text-xs text-gray-500">Click title to inspect item</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#262A27]">
            <thead className="bg-[#F8F6F0] text-[#24483D] font-semibold border-b border-[#E9E1D5]">
              <tr>
                <th className="py-3 px-4">Garment</th>
                <th className="py-3 px-4">Owner</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Condition</th>
                <th className="py-3 px-4">Value</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Moderation Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E9E1D5]">
              {adminListings.map((listing) => (
                <tr key={listing.id} className="hover:bg-[#F8F6F0]/40 transition-colors">
                  <td className="py-3 px-4 flex items-center gap-3">
                    <img
                      src={listing.images[0]}
                      alt=""
                      className="w-10 h-10 rounded object-cover border border-[#E9E1D5] shrink-0"
                    />
                    <div className="min-w-0">
                      <button
                        onClick={() => onSelectListing(listing)}
                        className="font-semibold text-[#24483D] hover:underline text-left block truncate max-w-xs cursor-pointer"
                      >
                        {listing.title}
                      </button>
                      <span className="text-[11px] text-gray-500">{listing.brand} · {listing.size}</span>
                    </div>
                  </td>

                  <td className="py-3 px-4 text-gray-700">
                    <p className="font-medium truncate">{listing.ownerName}</p>
                    <span className="text-[10px] text-gray-400">{listing.location}</span>
                  </td>

                  <td className="py-3 px-4 text-gray-700">{listing.category}</td>

                  <td className="py-3 px-4 text-gray-700">{listing.condition}</td>

                  <td className="py-3 px-4 font-semibold tabular-nums text-[#24483D]">
                    ${listing.indicativeValue}
                  </td>

                  <td className="py-3 px-4">
                    <span
                      className={`text-[10px] uppercase font-semibold px-2 py-0.5 rounded ${
                        listing.status === 'available'
                          ? 'bg-emerald-100 text-emerald-800'
                          : listing.status === 'in_swap'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {listing.status}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-right space-x-2">
                    <button
                      onClick={() => toggleFeatured(listing.id, Boolean(listing.isFeatured))}
                      className={`p-1.5 rounded border transition-colors cursor-pointer ${
                        listing.isFeatured
                          ? 'bg-amber-50 text-amber-600 border-amber-300'
                          : 'text-gray-400 hover:text-amber-600 border-transparent hover:border-[#E9E1D5]'
                      }`}
                      title={listing.isFeatured ? 'Unpin from Featured' : 'Pin to Featured on Homepage'}
                    >
                      <Star className={`w-4 h-4 ${listing.isFeatured ? 'fill-current' : ''}`} />
                    </button>

                    <button
                      onClick={() => deleteListing(listing.id)}
                      className="p-1.5 rounded text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      title="Moderator: Delete Listing"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
