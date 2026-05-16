'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/useAuth';
import { PenSquare, LogIn, LogOut, Globe } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';

export default function Header() {
  const { user, login, logout, isAdmin } = useAuth();
  const { t, language, setLanguage } = useLanguage();

  return (
    <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="font-sans font-bold text-xl tracking-tight text-gray-900">
          {t('Personal Blog')}
        </Link>

        <nav className="flex items-center gap-4">
          <button 
            onClick={() => setLanguage(language === 'en' ? 'zh' : 'en')}
            className="px-2 py-1.5 flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
            title="Switch Language"
          >
            <Globe className="w-4 h-4" />
            {language === 'en' ? 'ZH' : 'EN'}
          </button>

          {isAdmin && (
            <Link 
              href="/admin" 
              className="px-3 py-1.5 flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
            >
              <PenSquare className="w-4 h-4" />
              {t('Write')}
            </Link>
          )}

          {user ? (
            <button 
              onClick={logout}
              className="px-3 py-1.5 flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
            >
              <LogOut className="w-4 h-4" />
              {t('Logout')}
            </button>
          ) : (
            <button 
              onClick={login}
              className="px-3 py-1.5 flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
            >
              <LogIn className="w-4 h-4" />
              {t('Login')}
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
