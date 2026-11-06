/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp, PageView } from '../context/AppContext';
import { Menu, X, Compass, Award, MessageCircle } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { currentPage, setCurrentPage, setActiveDoubtTab } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNav = (page: PageView) => {
    setCurrentPage(page);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-6 h-16">
          {/* Zone 1: Single text wordmark */}
          <button
            onClick={() => handleNav('home')}
            className="flex items-center gap-2 text-xl font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 group text-left cursor-pointer"
          >
            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-600 text-white font-black text-sm shadow-sm group-hover:bg-blue-700 transition-colors">
              QT
            </span>
            <span>
              Quick<span className="text-blue-600">Teach</span>
            </span>
          </button>

          {/* Zone 2: Clean single-line nav links */}
          <nav className="hidden lg:flex items-center gap-5 xl:gap-6 text-sm font-medium text-slate-600">
            <button
              onClick={() => handleNav('instant-tutor')}
              className={`whitespace-nowrap shrink-0 hover:text-slate-900 transition-colors cursor-pointer ${
                currentPage === 'instant-tutor' ? 'text-blue-600 font-semibold' : ''
              }`}
            >
              Instant Tutor
            </button>
            <button
              onClick={() => handleNav('book-later')}
              className={`whitespace-nowrap shrink-0 hover:text-slate-900 transition-colors cursor-pointer ${
                currentPage === 'book-later' ? 'text-blue-600 font-semibold' : ''
              }`}
            >
              Book Later
            </button>
            <button
              onClick={() => {
                setActiveDoubtTab('instant_expert');
                handleNav('doubt-solver');
              }}
              className={`whitespace-nowrap shrink-0 hover:text-slate-900 transition-colors cursor-pointer flex items-center gap-1.5 ${
                currentPage === 'doubt-solver' || currentPage === 'live-call'
                  ? 'text-blue-600 font-semibold'
                  : ''
              }`}
            >
              <span>Instant Doubt</span>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                Free Q&A
              </span>
            </button>
            <button
              onClick={() => handleNav('career-counselling')}
              className={`whitespace-nowrap shrink-0 hover:text-slate-900 transition-colors cursor-pointer flex items-center gap-1 ${
                currentPage === 'career-counselling' ? 'text-blue-600 font-semibold' : ''
              }`}
            >
              <Compass className="w-3.5 h-3.5 text-blue-600" />
              <span>Career Counselling</span>
            </button>
            <button
              onClick={() => handleNav('admission-counselling')}
              className={`whitespace-nowrap shrink-0 hover:text-slate-900 transition-colors cursor-pointer flex items-center gap-1 ${
                currentPage === 'admission-counselling' ? 'text-blue-600 font-semibold' : ''
              }`}
            >
              <Award className="w-3.5 h-3.5 text-indigo-600" />
              <span>Admission Counselling</span>
            </button>
            <button
              onClick={() => handleNav('become-tutor')}
              className={`whitespace-nowrap shrink-0 hover:text-slate-900 transition-colors cursor-pointer ${
                currentPage === 'become-tutor' ? 'text-blue-600 font-semibold' : ''
              }`}
            >
              Teach With Us
            </button>
            <button
              onClick={() => handleNav('parent-portal')}
              className={`whitespace-nowrap shrink-0 hover:text-slate-900 transition-colors cursor-pointer ${
                currentPage === 'parent-portal' ? 'text-blue-600 font-semibold' : ''
              }`}
            >
              Parent Portal
            </button>
            <button
              onClick={() => handleNav('admin')}
              className={`whitespace-nowrap shrink-0 hover:text-slate-900 transition-colors cursor-pointer text-xs text-slate-400 hover:text-slate-700 ${
                currentPage === 'admin' ? 'text-slate-900 font-semibold' : ''
              }`}
            >
              Admin
            </button>
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="hidden lg:flex items-center gap-3 shrink-0">
            <button
              onClick={() => handleNav('instant-tutor')}
              className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 active:scale-[0.98] transition-all shadow-sm whitespace-nowrap shrink-0 cursor-pointer"
            >
              Find a Tutor Now
            </button>
          </div>

          {/* Mobile hamburger button */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3">
          <button
            onClick={() => handleNav('instant-tutor')}
            className="block w-full text-left py-2 text-base font-medium text-slate-800 hover:text-blue-600"
          >
            Instant Tutor (Home & Online)
          </button>
          <button
            onClick={() => handleNav('book-later')}
            className="block w-full text-left py-2 text-base font-medium text-slate-800 hover:text-blue-600"
          >
            Book Later (Schedule Faculty)
          </button>
          <button
            onClick={() => {
              setActiveDoubtTab('instant_expert');
              handleNav('doubt-solver');
            }}
            className="block w-full text-left py-2 text-base font-medium text-slate-800 hover:text-blue-600"
          >
            Instant Doubt & Free Community Q&A
          </button>
          <button
            onClick={() => handleNav('career-counselling')}
            className="block w-full text-left py-2 text-base font-medium text-slate-800 hover:text-blue-600"
          >
            Career Counselling (Classes 10–12)
          </button>
          <button
            onClick={() => handleNav('admission-counselling')}
            className="block w-full text-left py-2 text-base font-medium text-slate-800 hover:text-blue-600"
          >
            Admission Counselling & College Tracker
          </button>
          <button
            onClick={() => handleNav('become-tutor')}
            className="block w-full text-left py-2 text-base font-medium text-slate-800 hover:text-blue-600"
          >
            Become a Verified Tutor
          </button>
          <button
            onClick={() => handleNav('parent-portal')}
            className="block w-full text-left py-2 text-base font-medium text-slate-800 hover:text-blue-600"
          >
            Parent & Student Dashboard
          </button>
          <button
            onClick={() => handleNav('admin')}
            className="block w-full text-left py-2 text-sm text-slate-500 hover:text-slate-800"
          >
            Admin Management Console
          </button>
          <div className="pt-2">
            <button
              onClick={() => handleNav('instant-tutor')}
              className="w-full py-2.5 px-4 text-center font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              Find a Tutor Now
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
