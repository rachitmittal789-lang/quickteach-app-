/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useApp } from '../context/AppContext';
import { Shield, Clock, PhoneCall, CheckCircle } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setCurrentPage } = useApp();

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-slate-800 text-sm">
          {/* Brand Col */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="flex items-center justify-center w-7 h-7 rounded bg-blue-600 text-white font-bold text-xs">
                QT
              </span>
              <span className="text-lg font-bold text-white tracking-tight">QuickTeach</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              The Right Teacher. Right When You Need One. Connecting students with verified academic mentors for instant home visits, advance scheduling, and live online doubt clarity.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
              <Shield className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>100% Identity & Background Verified Tutors</span>
            </div>
          </div>

          {/* Core Services */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-100 mb-4">
              Core Services
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => setCurrentPage('instant-tutor')}
                  className="hover:text-white transition-colors text-left"
                >
                  Instant Tutor <span className="text-slate-500 font-normal">· Home & Online</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentPage('book-later')}
                  className="hover:text-white transition-colors text-left"
                >
                  Book Later <span className="text-slate-500 font-normal">· Scheduled Sessions</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentPage('doubt-solver')}
                  className="hover:text-white transition-colors text-left"
                >
                  Doubt Solver <span className="text-slate-500 font-normal">· 1-on-1 Call & Community</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentPage('career-counselling')}
                  className="hover:text-white transition-colors text-left"
                >
                  Career Counselling <span className="text-slate-500 font-normal">· Stream & Exam Roadmap</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentPage('admission-counselling')}
                  className="hover:text-white transition-colors text-left"
                >
                  Admission Counselling <span className="text-slate-500 font-normal">· College Guidance</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentPage('become-tutor')}
                  className="hover:text-white transition-colors text-left"
                >
                  Become a Tutor <span className="text-slate-500 font-normal">· Faculty Application</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Child Safety & Trust */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-100 mb-4">
              Child Safeguarding & Trust
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-start gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 mt-0.5 text-blue-400 shrink-0" />
                <span>Dual-layer Aadhaar & Police verification for home tutors</span>
              </li>
              <li className="flex items-start gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 mt-0.5 text-blue-400 shrink-0" />
                <span>Parental visibility: Session recording & duration auditing</span>
              </li>
              <li className="flex items-start gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 mt-0.5 text-blue-400 shrink-0" />
                <span>No off-platform private contact sharing for minors</span>
              </li>
              <li className="flex items-start gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 mt-0.5 text-blue-400 shrink-0" />
                <span>Zero-risk escrow payment releases only after class completion</span>
              </li>
            </ul>
          </div>

          {/* Portal Switcher & Support */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-100 mb-4">
              Direct Portals
            </h4>
            <div className="space-y-2 text-xs">
              <button
                onClick={() => setCurrentPage('parent-portal')}
                className="w-full text-left px-3 py-2 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
              >
                Parent & Student Portal →
              </button>
              <button
                onClick={() => setCurrentPage('admin')}
                className="w-full text-left px-3 py-2 rounded bg-slate-800/60 hover:bg-slate-700 text-slate-300 transition-colors"
              >
                Admin Governance Console →
              </button>
              <p className="text-[11px] text-slate-400 pt-1">
                Emergency parent safety helpline: <span className="font-mono text-slate-300">+91 1800-419-TEACH</span>
              </p>
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            © 2026 QuickTeach Technologies Private Limited. All academic trademarks (CBSE, ICSE, IB, Cambridge) belong to their respective boards.
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Simulated Prototype Mode</span>
            <span>·</span>
            <span>Transparent Pricing Model</span>
            <span>·</span>
            <span>Instant Dispatch</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
