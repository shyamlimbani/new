'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { LeadService } from '../services/apiService';
import { useSettings } from '../context/SettingsContext';
import { Loader2, ArrowRight, Smartphone, User, X } from 'lucide-react';
import toast from 'react-hot-toast';

interface LeadCapturePopupProps {
  logo?: string;
}

export default function LeadCapturePopup({ logo }: LeadCapturePopupProps) {
  const pathname = usePathname();
  const { settings, user, loginUser, showLoginPopup, setShowLoginPopup, popupSettings } = useSettings();
  
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const isAdmin = pathname?.startsWith('/admin');

  console.log("Popup Logo:", settings?.logo);

  const activeLogo = logo || settings?.logo;

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isLeadCaptured = localStorage.getItem('b2b_lead_captured');
      
      // Determine if we should show based on isEnabled toggle and user session
      const isMandatoryEnabled = popupSettings?.isEnabled ?? true;
      const isLoggedOut = !isLeadCaptured || !user;
      
      const shouldShow = ((isMandatoryEnabled && isLoggedOut) || showLoginPopup) && !isAdmin;
      
      if (shouldShow) {
        setIsOpen(true);
        document.body.style.overflow = 'hidden';
      } else {
        setIsOpen(false);
        document.body.style.overflow = 'unset';
      }
    }

    return () => {
      if (typeof window !== 'undefined') {
        document.body.style.overflow = 'unset';
      }
    };
  }, [pathname, isAdmin, user, showLoginPopup, popupSettings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }

    const cleanMobile = mobile.trim();
    if (!cleanMobile) {
      setErrorMsg('Please enter your mobile number.');
      return;
    }

    if (cleanMobile.length < 10) {
      setErrorMsg('Mobile number must be at least 10 digits.');
      return;
    }

    setSubmitting(true);
    try {
      await LeadService.create({
        name: name.trim(),
        mobile: cleanMobile,
      });

      // Session success
      loginUser(name.trim(), cleanMobile);
      setShowLoginPopup(false);
      toast.success(`Welcome back, ${name.trim()}!`);
      setIsOpen(false);
      document.body.style.overflow = 'unset';
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Verification failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const isClosable = user !== null || (typeof window !== 'undefined' && localStorage.getItem('b2b_lead_captured') === 'true');

  // Dynamic CMS Settings fallbacks
  const titleText = popupSettings?.title || "Welcome to India's Trusted Wholesale Marketplace";
  const descText = popupSettings?.description || "Please enter your credentials to explore the premium wholesale catalog, download bulk catalogs, and request direct factory pricing.";
  const buttonLabel = popupSettings?.buttonText || "Explore Wholesale Deals";

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-955/80 backdrop-blur-md">
      
      {/* Clean Single Column Card */}
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-100 p-8 md:p-10 relative overflow-y-auto max-h-[90vh]">
        
        {/* Close Button */}
        {isClosable && (
          <button
            type="button"
            onClick={() => {
              setShowLoginPopup(false);
              setIsOpen(false);
              document.body.style.overflow = 'unset';
            }}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition cursor-pointer z-50 bg-white/80 backdrop-blur-xs border border-slate-100"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* TOP: Dynamic Logo */}
        <div className="flex flex-col items-center text-center mb-6">
          {activeLogo && (
            <img
              src={activeLogo}
              alt="Logo"
              className="h-16 w-auto mx-auto mb-4"
            />
          )}
          
          {/* Below: Popup Title */}
          <h2 className="text-lg font-extrabold text-slate-900 leading-tight mb-2 tracking-tight">
            {titleText}
          </h2>
          
          {/* Below: Popup Description */}
          <p className="text-xs text-slate-500 font-medium px-2 leading-relaxed">
            {descText}
          </p>
        </div>

        {/* Lead Capture Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {errorMsg && (
            <div className="bg-red-50 text-red-600 text-xs font-semibold px-4 py-2.5 rounded-xl border border-red-200">
              {errorMsg}
            </div>
          )}

          {/* Below: Name Input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Your Full Name</label>
            <div className="relative">
              <User className="w-4.5 h-4.5 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#cc3a07]/20 focus:border-[#cc3a07] transition text-slate-800"
                placeholder="Enter your name"
              />
            </div>
          </div>

          {/* Below: Mobile Number Input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Mobile Number</label>
            <div className="relative">
              <Smartphone className="w-4.5 h-4.5 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="tel"
                required
                pattern="[0-9]*"
                min={10}
                value={mobile}
                onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                className="w-full pl-11 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#cc3a07]/20 focus:border-[#cc3a07] transition text-slate-800 font-mono"
                placeholder="Enter mobile number"
              />
            </div>
          </div>

          {/* Below: Submit Button */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-[#cc3a07] hover:bg-[#a82f05] disabled:bg-[#e88a72] text-white font-bold py-3 px-6 rounded-xl text-sm transition flex items-center justify-center gap-2 shadow-md hover:shadow-[0_4px_16px_rgba(204,58,7,0.3)] mt-4 cursor-pointer"
          >
            {submitting ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <span>{buttonLabel}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

      </div>
    </div>
  );
}
