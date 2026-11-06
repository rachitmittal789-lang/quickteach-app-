/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Clock,
  Calendar,
  MessageCircle,
  ShieldCheck,
  CheckCircle2,
  Star,
  ArrowRight,
  MapPin,
  Video,
  Award,
  ChevronRight,
  BookOpen,
} from 'lucide-react';
import { EDUCATOR_PORTRAITS, sanitizeImageUrl, handleImageError } from '../utils/imageUtils';

export const HomePage: React.FC = () => {
  const { setCurrentPage, tutors, pricingConfig } = useApp();

  return (
    <div className="space-y-16 lg:space-y-24">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-12 lg:pt-16 lg:pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-blue-700 bg-blue-50/90 border border-blue-200/80 px-3.5 py-1.5 rounded-full">
                <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
                <span>Verified Online & Home Tutors On-Demand</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 leading-[1.12] text-balance">
                Need a Tutor? <br />
                <span className="text-blue-600">Get Connected</span> in Minutes.
              </h1>

              <p className="text-lg text-slate-600 leading-relaxed max-w-2xl">
                Book a verified home tutor, connect with an online teacher instantly or schedule your preferred faculty for a future date. The right teacher, right when you need one.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
                <button
                  onClick={() => setCurrentPage('instant-tutor')}
                  className="px-6 py-3.5 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-semibold rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Clock className="w-4 h-4" />
                  <span>Find a Tutor Now</span>
                </button>

                <button
                  onClick={() => setCurrentPage('doubt-solver')}
                  className="px-6 py-3.5 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-semibold rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 text-blue-600" />
                  <span>Solve a Doubt Instantly</span>
                </button>
              </div>

              {/* Social Proof Trust Points */}
              <div className="pt-4 border-t border-slate-200 grid grid-cols-3 gap-4 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-medium text-slate-700">100% Background Verified</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-600 shrink-0" />
                  <span className="font-medium text-slate-700">Target 30-Min Matching</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-600 shrink-0" />
                  <span className="font-medium text-slate-700">Top 3% Academic Faculty</span>
                </div>
              </div>
            </div>

            {/* Right Hero Image */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl overflow-hidden shadow-xl border border-slate-200 aspect-[4/3] lg:aspect-auto lg:h-[460px]">
                <img
                  src={EDUCATOR_PORTRAITS.heroTutoringSession}
                  alt="QuickTeach verified tutor and student interactive session"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                  onError={(e) => handleImageError(e, EDUCATOR_PORTRAITS.heroTutoringSession)}
                />
                {/* Floating trust badge */}
                <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md rounded-xl p-3 border border-slate-200/90 shadow-lg flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold shrink-0">
                      ✓
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900">Verified Teaching Faculty</div>
                      <div className="text-slate-500">CBSE · ICSE · IB · Cambridge</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-blue-600">₹{pricingConfig.baseDoubtPerMinute}/min</div>
                    <div className="text-[11px] text-slate-400">Live doubt clarity</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The 3 Core Service Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Three Ways to Learn. Instant or Scheduled.
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-600">
            Clear, transparent tutoring tailored to your schedule, exam requirements, and learning pace.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {/* Card 1: Instant Tutor */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 lg:p-7 flex flex-col justify-between hover:shadow-md transition-shadow relative group">
            <div>
              <div className="flex items-center justify-between gap-2 mb-4">
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <Clock className="w-6 h-6" />
                </div>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  <span>ONLINE & OFFLINE</span>
                </div>
              </div>

              <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                Need a Teacher Right Now?
              </h3>

              <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                Get matched with an available tutor for online or home tutoring. Request a tutor for your preferred subject and target a response within 30 minutes.
              </p>

              <div className="mt-6 pt-5 border-t border-slate-100 space-y-2 text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Doorstep arrival for offline bookings</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Interactive 1-on-1 virtual room for online</span>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <button
                onClick={() => setCurrentPage('instant-tutor')}
                className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <span>Find Tutor Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Card 2: Book Later */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 lg:p-7 flex flex-col justify-between hover:shadow-md transition-shadow relative group">
            <div>
              <div className="flex items-center justify-between gap-2 mb-4">
                <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  <Calendar className="w-6 h-6" />
                </div>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-800 bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                  <span>ONLINE & OFFLINE</span>
                </div>
              </div>

              <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                Choose Your Preferred Teacher.
              </h3>

              <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                Browse verified teachers, compare profiles, choose male or female faculty where available, select your preferred date and time, and book in advance.
              </p>

              <div className="mt-6 pt-5 border-t border-slate-100 space-y-2 text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span>Compare up to 3 faculty profiles</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span>Flexible rescheduling & demo slots</span>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <button
                onClick={() => setCurrentPage('book-later')}
                className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <span>Book a Tutor</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Card 3: Instant Doubt Solver */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 lg:p-7 flex flex-col justify-between hover:shadow-md transition-shadow relative group">
            <div>
              <div className="flex items-center justify-between gap-2 mb-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  <span>ONLINE ONLY</span>
                </div>
              </div>

              <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                Stuck on a Question?
              </h3>

              <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                Upload a question or type your doubt and instantly connect with a subject expert through a live voice or video session.
              </p>

              <div className="mt-6 pt-5 border-t border-slate-100 space-y-2 text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Voice or video call with digital whiteboard</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Pay-as-you-go per-minute billing (₹{pricingConfig.baseDoubtPerMinute}/min)</span>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <button
                onClick={() => setCurrentPage('doubt-solver')}
                className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <span>Solve My Doubt</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Career & Admission Counselling Guidance Banner */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div className="p-6 rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50/60 to-white flex flex-col justify-between">
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-100/70 px-2.5 py-0.5 rounded">
                CLASSES 10, 11 & 12
              </span>
              <h3 className="text-xl font-bold text-slate-900">
                Confused About Your Future?
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Explore career streams, understand real entrance exam eligibility stages (JEE, NEET, IPMAT, CLAT, NDA, Govt jobs), and book 1-on-1 strategy sessions with certified career counsellors.
              </p>
            </div>
            <div className="pt-4">
              <button
                onClick={() => setCurrentPage('career-counselling')}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs cursor-pointer shadow-xs inline-flex items-center gap-1.5"
              >
                <span>Explore Career Counselling</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="p-6 rounded-2xl border border-indigo-200 bg-gradient-to-br from-indigo-50/60 to-white flex flex-col justify-between">
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-100/70 px-2.5 py-0.5 rounded">
                COLLEGE ADMISSIONS & RANKS
              </span>
              <h3 className="text-xl font-bold text-slate-900">
                Your Exam Is Done. Find Your Next Opportunity.
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Understand your admission chances with historical cut-off analysis, shortlist aspirational vs target colleges, and track upcoming deadlines with our live Admission Tracker.
              </p>
            </div>
            <div className="pt-4">
              <button
                onClick={() => setCurrentPage('admission-counselling')}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs cursor-pointer shadow-xs inline-flex items-center gap-1.5"
              >
                <span>Admission Counselling & Tracker</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Verified Faculty Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Top Verified Faculty Available Today
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Screened through stringent 4-stage academic and background evaluations.
            </p>
          </div>
          <button
            onClick={() => setCurrentPage('book-later')}
            className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer self-start sm:self-auto"
          >
            <span>View All Faculty</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tutors.slice(0, 3).map((tutor) => (
            <div
              key={tutor.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:border-slate-300 transition-all flex flex-col justify-between"
            >
              <div className="p-5">
                <div className="flex items-start gap-4">
                  <img
                    src={sanitizeImageUrl(tutor.photoUrl, tutor.name)}
                    alt={tutor.name}
                    referrerPolicy="no-referrer"
                    className="w-16 h-16 rounded-xl object-cover border border-slate-200 shrink-0"
                    onError={(e) => handleImageError(e, sanitizeImageUrl(undefined, tutor.name))}
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-bold text-slate-900 truncate">{tutor.name}</h4>
                      {tutor.isVerified && (
                        <span title="Identity & Qualification Verified">
                          <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 truncate">{tutor.qualifications}</p>
                    <div className="flex items-center gap-2 mt-1 text-xs text-slate-600">
                      <span className="flex items-center text-amber-500 font-semibold">
                        <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-500 mr-1" />
                        {tutor.rating}
                      </span>
                      <span>·</span>
                      <span className="text-slate-500">{tutor.experienceYears} yrs exp</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 space-y-2 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{tutor.subjects.join(', ')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">
                      {tutor.format === 'both' ? 'Home & Online' : tutor.format === 'offline' ? 'Home Visits' : 'Online Only'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <div className="text-sm font-bold text-slate-900 font-mono tabular-nums">
                    ₹{tutor.hourlyRate}<span className="text-xs text-slate-500 font-normal">/hr</span>
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono tabular-nums">
                    ₹{tutor.perMinuteRate}/min doubt
                  </div>
                </div>
                <button
                  onClick={() => setCurrentPage('book-later')}
                  className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors cursor-pointer"
                >
                  Book Slot
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How QuickTeach Works */}
      <section className="bg-white border-y border-slate-200 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Fast, Transparent, and Safe
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Built from the ground up for academic rigor and parent peace of mind.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
                01
              </div>
              <h3 className="text-lg font-bold text-slate-900">Specify Student Needs</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Choose academic board (CBSE, ICSE, IB, Cambridge), class, and topic focus. Select whether you prefer home visits or live online classes.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
                02
              </div>
              <h3 className="text-lg font-bold text-slate-900">Instant Match or Pick Faculty</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Request an on-demand tutor dispatched within 30 minutes, or browse verified faculty profiles and lock down a convenient future schedule.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
                03
              </div>
              <h3 className="text-lg font-bold text-slate-900">Protected Escrow Payment</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Fees are authorized securely and only released to the teacher after the session completes to your satisfaction. No hidden subscriptions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Safety Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-blue-950 text-white p-8 sm:p-10 shadow-lg">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Child Safeguarding Constitution</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold tracking-tight">
                Safety First for Every Student & In-Home Session
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed max-w-2xl">
                Every QuickTeach home tutor undergoes mandatory government identity verification, academic document authentication, and a clean police background check before visiting any minor student. All online sessions are monitored for safety.
              </p>
            </div>
            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 justify-center">
              <button
                onClick={() => setCurrentPage('instant-tutor')}
                className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 font-semibold text-sm text-white transition-colors cursor-pointer text-center"
              >
                Request Verified Home Tutor
              </button>
              <button
                onClick={() => setCurrentPage('become-tutor')}
                className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 font-semibold text-sm text-white transition-colors cursor-pointer text-center"
              >
                Apply as a Faculty Member
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
