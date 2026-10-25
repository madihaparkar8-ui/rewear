import React, { useState } from 'react';
import { X, Send, CheckCircle, Mail, MessageSquare } from 'lucide-react';

interface ContactModalProps {
  onClose: () => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({ onClose }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Swap Inquiry');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, subject, message }),
      });
      if (res.ok) {
        setSubmitted(true);
      }
    } catch (err) {
      console.error('Contact submission error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl border border-[#E9E1D5] max-w-lg w-full shadow-2xl relative p-6 animate-in fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-[#F8F6F0] text-gray-400 hover:text-gray-700 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
              <CheckCircle className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-[#24483D]">
              Message Received
            </h3>
            <p className="text-xs text-[#262A27]/80 max-w-xs mx-auto leading-relaxed">
              Thank you for reaching out to the ReWear collective. A team member or moderator will respond to {email} within 24 hours.
            </p>
            <button
              onClick={onClose}
              className="mt-4 px-5 py-2 text-xs font-semibold text-white bg-[#24483D] rounded-md hover:bg-[#1a342c] cursor-pointer"
            >
              Back to Wardrobe
            </button>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 rounded-full bg-[#24483D]/10 text-[#24483D]">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif text-2xl font-bold text-[#24483D]">
                  Contact & Support
                </h3>
                <p className="text-xs text-[#262A27]/70">
                  Have a question about a swap, clothing guidelines, or feedback?
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="mt-5 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-[#24483D] mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Clara Moreau"
                  className="w-full p-2.5 rounded-md border border-[#E9E1D5] bg-white focus:outline-none focus:ring-1 focus:ring-[#24483D]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#24483D] mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full p-2.5 rounded-md border border-[#E9E1D5] bg-white focus:outline-none focus:ring-1 focus:ring-[#24483D]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#24483D] mb-1">Topic</label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full p-2.5 rounded-md border border-[#E9E1D5] bg-white focus:outline-none focus:ring-1 focus:ring-[#24483D]"
                >
                  <option value="Swap Inquiry">Swap Exchange Inquiry</option>
                  <option value="Garment Authentication">Garment Material & Standards</option>
                  <option value="Packaging & Shipping">Packaging & Shipping Advice</option>
                  <option value="Listing Moderation">Report an Inappropriate Listing</option>
                  <option value="Partnership">Sustainable Brand Partnership</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-[#24483D] mb-1">Message</label>
                <textarea
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us how we can help you with your swap or account..."
                  className="w-full p-2.5 rounded-md border border-[#E9E1D5] bg-white focus:outline-none focus:ring-1 focus:ring-[#24483D]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold text-[#262A27]/70 hover:bg-[#F8F6F0] rounded-md cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2.5 text-xs font-semibold text-white bg-[#24483D] hover:bg-[#1a342c] rounded-md transition-all shadow-sm active:scale-98 disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{loading ? 'Sending...' : 'Send Message'}</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
