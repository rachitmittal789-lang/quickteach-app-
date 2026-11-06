/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { InstantTutorPage } from './pages/InstantTutorPage';
import { BookLaterPage } from './pages/BookLaterPage';
import { DoubtSolverPage } from './pages/DoubtSolverPage';
import { LiveCallPage } from './pages/LiveCallPage';
import { BecomeTutorPage } from './pages/BecomeTutorPage';
import { AdminPage } from './pages/AdminPage';
import { ParentPortalPage } from './pages/ParentPortalPage';
import { CareerCounsellingPage } from './pages/CareerCounsellingPage';
import { AdmissionCounsellingPage } from './pages/AdmissionCounsellingPage';

const AppContent: React.FC = () => {
  const { currentPage } = useApp();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1">
        {currentPage === 'home' && <HomePage />}
        {currentPage === 'instant-tutor' && <InstantTutorPage />}
        {currentPage === 'book-later' && <BookLaterPage />}
        {currentPage === 'doubt-solver' && <DoubtSolverPage />}
        {currentPage === 'live-call' && <LiveCallPage />}
        {currentPage === 'career-counselling' && <CareerCounsellingPage />}
        {currentPage === 'admission-counselling' && <AdmissionCounsellingPage />}
        {currentPage === 'become-tutor' && <BecomeTutorPage />}
        {currentPage === 'admin' && <AdminPage />}
        {currentPage === 'parent-portal' && <ParentPortalPage />}
      </main>

      {/* Hide footer during focused live call sessions */}
      {currentPage !== 'live-call' && <Footer />}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
