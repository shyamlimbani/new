'use client';

import React from 'react';
import { useSettings } from '../context/SettingsContext';
import Link from 'next/link';
import { Phone, MapPin, Mail, MessageSquare } from 'lucide-react';
import WhatsAppButton from './WhatsAppButton';
import Image from 'next/image';

const FacebookIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
);
const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
);
const TwitterIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
);
const LinkedinIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
);

export default function Footer() {
  const { settings, categories } = useSettings();

  const socialLinks = settings?.socialLinks || {
    facebook: 'https://facebook.com',
    instagram: 'https://instagram.com',
    twitter: 'https://twitter.com',
    linkedin: 'https://linkedin.com',
  };

  return (
    <footer className="bg-gray-900 text-gray-300 border-t border-gray-800 w-full mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Col 1: About & Logo */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2">
              {settings?.footerLogo ? (
                <div className="flex items-center justify-start overflow-hidden bg-transparent">
                  <Image
                    src={settings.footerLogo}
                    alt={settings?.websiteName || 'My Website'}
                    width={200}
                    height={80}
                    unoptimized={true}
                    className="h-10 sm:h-12 w-auto object-contain bg-transparent brightness-0 invert"
                  />
                </div>
              ) : (
                <span className="font-extrabold text-xl text-white tracking-tight">
                  {settings?.websiteName || 'My Website'}
                </span>
              )}
            </Link>
            <p className="text-xs text-gray-400 leading-relaxed">
              {settings?.seoDescription ||
                'Connecting wholesale B2B buyers with verified manufacturers and direct suppliers globally. Simplify your bulk sourcing process.'}
            </p>
            {/* Social Icons */}
            <div className="flex gap-4 mt-2">
              {socialLinks.facebook && (
                <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 transition">
                  <FacebookIcon className="w-5 h-5" />
                </a>
              )}
              {socialLinks.instagram && (
                <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-pink-500 transition">
                  <InstagramIcon className="w-5 h-5" />
                </a>
              )}
              {socialLinks.twitter && (
                <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition">
                  <TwitterIcon className="w-5 h-5" />
                </a>
              )}
              {socialLinks.linkedin && (
                <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-blue-700 transition">
                  <LinkedinIcon className="w-5 h-5" />
                </a>
              )}
            </div>
          </div>

          {/* Col 2: Categories */}
          <div>
            <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Top Categories</h4>
            <ul className="space-y-2 text-xs">
              {categories.slice(0, 5).map((cat) => (
                <li key={cat._id}>
                  <Link href={`/?category=${cat.slug}`} className="hover:text-blue-450 transition text-gray-450">
                    {cat.name}
                  </Link>
                </li>
              ))}
              {categories.length === 0 && (
                <li className="text-gray-500">No categories loaded</li>
              )}
            </ul>
          </div>

          {/* Col 3: Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/" className="hover:text-blue-450 transition text-gray-450">
                  Marketplace Home
                </Link>
              </li>

            </ul>
          </div>

          {/* Col 4: Contact & Help */}
          <div className="flex flex-col gap-3">
            <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Contact Us</h4>
            <div className="flex items-center gap-2.5 text-xs">
              <Phone className="w-4 h-4 text-blue-500 shrink-0" />
              <span>+{settings?.whatsappNumber || '919876543210'}</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs">
              <Mail className="w-4 h-4 text-blue-500 shrink-0" />
              <span>info@indib2bwholesale.com</span>
            </div>
            <div className="flex items-start gap-2.5 text-xs">
              <MapPin className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
              <span className="leading-relaxed">Industrial Sector 62, Noida, Uttar Pradesh, India</span>
            </div>
            <div className="pt-2">
              <WhatsAppButton
                message="Hi, I would like to get help or support with ordering products on your platform."
                className="w-full text-xs font-bold py-2.5 flex items-center justify-center gap-1.5"
              />
            </div>
          </div>

        </div>

        {/* Copyright Section */}
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center text-xs text-gray-500 gap-4">
          <p>{settings?.footerText || `© 2026 ${settings?.websiteName || 'My Website'}. All rights reserved.`}</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-gray-400 transition">Privacy Policy</a>
            <a href="#" className="hover:text-gray-400 transition">Terms of Use</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
