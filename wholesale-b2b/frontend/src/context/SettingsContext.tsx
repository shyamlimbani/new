'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Settings, Category } from '../types';
import { SettingsService, CategoryService } from '../services/apiService';

interface SettingsContextType {
  settings: Settings | null;
  categories: Category[];
  loading: boolean;
  refreshSettings: () => Promise<void>;
  refreshCategories: () => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshSettings = async () => {
    try {
      const data = await SettingsService.get();
      setSettings(data);
      if (typeof window !== 'undefined' && data) {
        // Dynamic SEO Update on Client Side
        document.title = data.seoTitle || data.websiteName || 'Wholesale B2B';
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
          metaDesc.setAttribute('content', data.seoDescription || '');
        }
      }
    } catch (e) {
      console.error('Failed to load settings', e);
    }
  };

  const refreshCategories = async () => {
    try {
      const data = await CategoryService.getAll();
      setCategories(data);
    } catch (e) {
      console.error('Failed to load categories', e);
    }
  };

  useEffect(() => {
    const loadAll = async () => {
      setLoading(true);
      await Promise.all([refreshSettings(), refreshCategories()]);
      setLoading(false);
    };
    loadAll();
  }, []);

  return (
    <SettingsContext.Provider
      value={{
        settings,
        categories,
        loading,
        refreshSettings,
        refreshCategories,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
