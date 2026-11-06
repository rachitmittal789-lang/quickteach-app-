/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Tutor } from '../types';
import {
  SUBJECTS_LIST,
  BOARDS_LIST,
  GRADES_LIST,
  LANGUAGES_LIST,
} from '../data/mockData';
import {
  Clock,
  MapPin,
  Video,
  ShieldCheck,
  CheckCircle,
  AlertCircle,
  Star,
  ArrowRight,
  ArrowLeft,
  CreditCard,
  Building,
  Check,
  User,
  Sparkles,
  Filter,
  SlidersHorizontal,
  Zap,
  X,
  ChevronRight,
  Info,
  Phone,
  Award,
  Calendar,
  RefreshCw,
} from 'lucide-react';

export const InstantTutorPage: React.FC = () => {
  const {
    tutors,
    pricingConfig,
    createInstantBooking,
    parentAccount,
    setCurrentPage,
  } = useApp();

  // Active child prefill if available
  const defaultChild = parentAccount.children[0];

  // Step state: 1: Student details, 2: Academic, 3: Format, 4: Session, 5: Matching & Confirmation
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);

  // Form Fields
  const [studentName, setStudentName] = useState(defaultChild?.name || 'Aryan Malhotra');
  const [age, setAge] = useState(defaultChild?.age || 15);
  const [grade, setGrade] = useState(defaultChild?.grade || 'Grade 10');
  const [board, setBoard] = useState(defaultChild?.board || 'CBSE');

  const [selectedSubjects, setSelectedSubjects] = useState<string[]>(['Mathematics']);
  const [additionalHelp, setAdditionalHelp] = useState(
    'Need help with quadratic formula derivations and word problems.'
  );

  const [teachingFormat, setTeachingFormat] = useState<'offline' | 'online'>('offline');
  const [address, setAddress] = useState('Flat 402, Oakwood Greens, Sector 54');
  const [landmark, setLandmark] = useState('Near Golf Course Metro Station');
  const [pincode, setPincode] = useState('122002');
  const [serviceabilityStatus, setServiceabilityStatus] = useState<
    'idle' | 'checking' | 'verified' | 'unserviceable'
  >('verified');

  const [sessionTiming, setSessionTiming] = useState<'asap' | 'within_hour'>('asap');
  const [durationHours, setDurationHours] = useState<number>(1.5);
  const [preferredLanguage, setPreferredLanguage] = useState<string>('English');
  const [genderPreference, setGenderPreference] = useState<'no_preference' | 'female' | 'male'>('no_preference');
  const [specialInstructions, setSpecialInstructions] = useState<string>(
    'Please bring sample board practice questions.'
  );

  // Step 5 Matching & Selection State
  const [matchingState, setMatchingState] = useState<
    'searching' | 'tutor_selection' | 'review_and_pay' | 'booked_confirmed'
  >('searching');
  const [matchedTutor, setMatchedTutor] = useState<Tutor>(tutors[0]);
  const [searchTimer, setSearchTimer] = useState<number>(2);

  // Filters & Sorting in Selection View
  const [sortOption, setSortOption] = useState<
    'recommended' | 'price_low' | 'experience_high' | 'rating_high' | 'eta_fast'
  >('recommended');
  const [genderFilter, setGenderFilter] = useState<'no_preference' | 'female' | 'male'>('no_preference');

  // Modal for viewing full tutor profile
  const [selectedTutorModal, setSelectedTutorModal] = useState<Tutor | null>(null);

  // Payment state
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [upiId, setUpiId] = useState('parent@okaxis');
  const [createdBookingId, setCreatedBookingId] = useState<string>('');

  const toggleSubject = (sub: string) => {
    if (selectedSubjects.includes(sub)) {
      if (selectedSubjects.length > 1) {
        setSelectedSubjects(selectedSubjects.filter((s) => s !== sub));
      }
    } else {
      setSelectedSubjects([...selectedSubjects, sub]);
    }
  };

  const handlePincodeCheck = () => {
    setServiceabilityStatus('checking');
    setTimeout(() => {
      if (pincode.startsWith('11') || pincode.startsWith('12') || pincode.startsWith('20') || pincode.length === 6) {
        setServiceabilityStatus('verified');
      } else {
        setServiceabilityStatus('unserviceable');
      }
    }, 600);
  };

  const handleStartMatching = () => {
    setStep(5);
    setMatchingState('searching');
    setSearchTimer(2);
    setGenderFilter(genderPreference);
  };

  // Timer countdown for simulated radar tutor dispatch
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === 5 && matchingState === 'searching') {
      interval = setInterval(() => {
        setSearchTimer((prev) => {
          if (prev <= 1) {
            setMatchingState('tutor_selection');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, matchingState]);

  // Filter matching available tutors
  // CRITICAL REQUIREMENT: Unavailable tutors (isAvailableNow === false) MUST NEVER appear as instantly bookable!
  const matchingAvailableTutors = tutors.filter((t) => {
    // Availability check: only live available tutors
    if (t.isAvailableNow === false) return false;

    // Teaching format check
    if (teachingFormat === 'offline' && t.format === 'online') return false;
    if (teachingFormat === 'online' && t.format === 'offline') return false;

    // Subject check
    const matchesSubject = selectedSubjects.some((sub) =>
      t.subjects.some(
        (ts) =>
          ts.toLowerCase().includes(sub.toLowerCase()) ||
          sub.toLowerCase().includes(ts.toLowerCase())
      )
    );
    if (!matchesSubject) return false;

    // Gender filter check
    if (genderFilter !== 'no_preference' && t.gender !== genderFilter) {
      return false;
    }

    return true;
  });

  // Sort matching tutors based on chosen filter
  const sortedMatchingTutors = [...matchingAvailableTutors].sort((a, b) => {
    if (sortOption === 'price_low') {
      return a.hourlyRate - b.hourlyRate;
    }
    if (sortOption === 'experience_high') {
      return b.experienceYears - a.experienceYears;
    }
    if (sortOption === 'rating_high') {
      return b.rating - a.rating;
    }
    if (sortOption === 'eta_fast') {
      return (a.etaMinutes || 30) - (b.etaMinutes || 30);
    }
    // Default 'recommended': prioritize high rating, confirmed credentials and low ETA
    return (b.rating * 10 - (b.etaMinutes || 30)) - (a.rating * 10 - (a.etaMinutes || 30));
  });

  // FEATURED FACULTY (Best Match)
  const featuredTutor = sortedMatchingTutors[0] || tutors[0];

  // OTHER AVAILABLE FACULTY (3–5 matching faculty)
  const otherTutors = sortedMatchingTutors.filter((t) => t.id !== featuredTutor?.id);

  // Fastest available tutor
  const fastestTutor = [...matchingAvailableTutors].sort(
    (a, b) => (a.etaMinutes || 30) - (b.etaMinutes || 30)
  )[0] || featuredTutor;

  // Selected tutor pricing calculations
  const tutorRateTotal = matchedTutor.hourlyRate * durationHours;
  const platformFee = pricingConfig.platformFeeFixed ?? 30;
  const travelFee = matchedTutor.travelCharge || 0;
  const instantSurcharge = pricingConfig.instantMatchingSurcharge || 0;
  const taxableAmount = tutorRateTotal + platformFee + travelFee + instantSurcharge;
  const taxes = Math.round((taxableAmount * (pricingConfig.gstPercent || 0)) / 100);
  const totalAmount = taxableAmount + taxes;

  const handleSelectTutor = (tutor: Tutor) => {
    setMatchedTutor(tutor);
    setMatchingState('review_and_pay');
    setSelectedTutorModal(null);
  };

  const handleSelectFastestTutor = () => {
    if (fastestTutor) {
      setMatchedTutor(fastestTutor);
      setMatchingState('review_and_pay');
    }
  };

  const handleConfirmAndPay = () => {
    const booking = createInstantBooking({
      serviceType: 'instant',
      studentName,
      age: Number(age),
      grade,
      board,
      subject: selectedSubjects[0],
      additionalSubjects: selectedSubjects.slice(1),
      additionalHelp,
      format: teachingFormat,
      address: teachingFormat === 'offline' ? address : undefined,
      landmark: teachingFormat === 'offline' ? landmark : undefined,
      pincode: teachingFormat === 'offline' ? pincode : undefined,
      durationHours,
      preferredLanguage,
      tutorId: matchedTutor.id,
      tutorName: matchedTutor.name,
      tutorPhoto: matchedTutor.photoUrl,
      tutorRate: matchedTutor.hourlyRate,
      platformFee,
      travelFee,
      taxes,
      totalAmount,
      status: 'confirmed',
      paymentMethod:
        paymentMethod === 'upi'
          ? `UPI (${upiId})`
          : paymentMethod === 'card'
          ? 'Credit/Debit Card (•••• 4921)'
          : 'Net Banking (HDFC Bank)',
      paymentId: `PAY-QT-${Math.floor(100000 + Math.random() * 900000)}`,
      etaMinutes: matchedTutor.etaMinutes || (teachingFormat === 'offline' ? 24 : 5),
    });

    setCreatedBookingId(booking.id);
    setMatchingState('booked_confirmed');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 bg-blue-50 px-3 py-1 rounded-full mb-3 border border-blue-200">
          <Clock className="w-3.5 h-3.5" />
          <span>ON-DEMAND DISPATCH SERVICE</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
          Get a Verified Tutor at Your Doorstep or Online.
        </h1>
        <p className="mt-2 text-sm sm:text-base text-slate-600">
          Tell us what your child needs. QuickTeach identifies available tutors near you and targets arrival or connection within 30 minutes.
        </p>
      </div>

      {/* Multi-step Progress Bar */}
      {step < 5 && (
        <div className="mb-10">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-2">
            <span className={step >= 1 ? 'text-blue-600 font-bold' : ''}>1. Student</span>
            <span className={step >= 2 ? 'text-blue-600 font-bold' : ''}>2. Subject</span>
            <span className={step >= 3 ? 'text-blue-600 font-bold' : ''}>3. Format</span>
            <span className={step >= 4 ? 'text-blue-600 font-bold' : ''}>4. Session</span>
            <span className={step === 5 ? 'text-blue-600 font-bold' : ''}>5. Match</span>
          </div>
          <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
            <div
              className="bg-blue-600 h-full transition-all duration-300"
              style={{ width: `${((step - 1) / 4) * 100}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* STEP 1: Student details */}
      {step === 1 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6">
          <h2 className="text-xl font-bold text-slate-900">Step 1: Student Details</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Student Full Name *
              </label>
              <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="e.g. Aryan Malhotra"
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Student Age *
              </label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                min={5}
                max={25}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Class / Grade *
              </label>
              <select
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                {GRADES_LIST.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Educational Board *
              </label>
              <select
                value={board}
                onChange={(e) => setBoard(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                {BOARDS_LIST.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              onClick={() => setStep(2)}
              disabled={!studentName.trim()}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold text-sm rounded-lg flex items-center gap-1 cursor-pointer transition-colors shadow-sm"
            >
              <span>Continue to Academic Needs</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Academic Requirements */}
      {step === 2 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">Step 2: Academic Requirements</h2>
            <span className="text-xs text-slate-500">Select one or more subjects</span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              Select Subject(s) *
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
              {SUBJECTS_LIST.map((subj) => {
                const isSelected = selectedSubjects.includes(subj);
                return (
                  <button
                    key={subj}
                    type="button"
                    onClick={() => toggleSubject(subj)}
                    className={`p-3 rounded-xl border text-left text-xs font-semibold transition-all cursor-pointer ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50 text-blue-900 ring-1 ring-blue-600'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{subj}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-blue-600" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Describe Your Specific Topic or Doubt
            </label>
            <textarea
              rows={3}
              value={additionalHelp}
              onChange={(e) => setAdditionalHelp(e.target.value)}
              placeholder="e.g. Chapter 4 Quadratic Equations, word problems with speed & time"
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="pt-4 flex items-center justify-between">
            <button
              onClick={() => setStep(1)}
              className="px-4 py-2 text-slate-600 hover:text-slate-900 font-medium text-sm flex items-center gap-1 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              onClick={() => setStep(3)}
              disabled={selectedSubjects.length === 0}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold text-sm rounded-lg flex items-center gap-1 cursor-pointer transition-colors shadow-sm"
            >
              <span>Continue to Teaching Format</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Format (In-Home Offline vs Online) */}
      {step === 3 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6">
          <h2 className="text-xl font-bold text-slate-900">Step 3: Teaching Format & Location</h2>

          {/* Mode Switcher */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div
              onClick={() => setTeachingFormat('offline')}
              className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                teachingFormat === 'offline'
                  ? 'border-blue-600 bg-blue-50/60 shadow-xs'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center">
                  <MapPin className="w-5 h-5" />
                </span>
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                  Verified In-Home
                </span>
              </div>
              <h3 className="font-bold text-slate-900 text-base">In-Home Doorstep Visit</h3>
              <p className="text-xs text-slate-600 mt-1">
                Verified faculty arrives at your residence. Transparent rate structure: ₹400–₹500/hr for school grades.
              </p>
            </div>

            <div
              onClick={() => setTeachingFormat('online')}
              className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                teachingFormat === 'online'
                  ? 'border-blue-600 bg-blue-50/60 shadow-xs'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center">
                  <Video className="w-5 h-5" />
                </span>
                <span className="text-[11px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">
                  Instant Link
                </span>
              </div>
              <h3 className="font-bold text-slate-900 text-base">Online Live Classroom</h3>
              <p className="text-xs text-slate-600 mt-1">
                Connect within 5 minutes over interactive video with whiteboard and screen sharing.
              </p>
            </div>
          </div>

          {/* Location fields if offline */}
          {teachingFormat === 'offline' && (
            <div className="p-5 bg-slate-50 rounded-xl border border-slate-200 space-y-4">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Home Address for Tutor Dispatch
              </h4>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Complete Street Address *
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. Flat 402, Oakwood Greens, Sector 54"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Landmark
                  </label>
                  <input
                    type="text"
                    value={landmark}
                    onChange={(e) => setLandmark(e.target.value)}
                    placeholder="e.g. Near Golf Course Metro Station"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Pincode *
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={pincode}
                      onChange={(e) => {
                        setPincode(e.target.value);
                        setServiceabilityStatus('idle');
                      }}
                      placeholder="e.g. 122002"
                      maxLength={6}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white font-mono"
                      required
                    />
                    <button
                      type="button"
                      onClick={handlePincodeCheck}
                      className="px-3.5 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-semibold rounded-lg shrink-0 cursor-pointer"
                    >
                      Verify
                    </button>
                  </div>
                </div>
              </div>

              {serviceabilityStatus === 'verified' && (
                <div className="flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 p-2.5 rounded-lg border border-emerald-200">
                  <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span>Sector 54 is fully serviceable! Average tutor arrival: 24–35 minutes.</span>
                </div>
              )}
            </div>
          )}

          <div className="pt-4 flex items-center justify-between">
            <button
              onClick={() => setStep(2)}
              className="px-4 py-2 text-slate-600 hover:text-slate-900 font-medium text-sm flex items-center gap-1 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              onClick={() => setStep(4)}
              disabled={teachingFormat === 'offline' && (!address.trim() || !pincode.trim())}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold text-sm rounded-lg flex items-center gap-1 cursor-pointer transition-colors shadow-sm"
            >
              <span>Continue to Session Details</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: Session Details */}
      {step === 4 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6">
          <h2 className="text-xl font-bold text-slate-900">Step 4: Session Preferences</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Requested Session Timing
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setSessionTiming('asap')}
                  className={`p-3 rounded-xl border text-left cursor-pointer transition-colors ${
                    sessionTiming === 'asap'
                      ? 'border-blue-600 bg-blue-50 text-blue-900 font-semibold'
                      : 'border-slate-200 text-slate-700'
                  }`}
                >
                  <div className="text-xs font-bold flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-blue-600" />
                    <span>Immediate Dispatch (ASAP)</span>
                  </div>
                  <div className="text-[11px] text-slate-500 font-normal mt-0.5">
                    Target arrival within 30 minutes
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setSessionTiming('within_hour')}
                  className={`p-3 rounded-xl border text-left cursor-pointer transition-colors ${
                    sessionTiming === 'within_hour'
                      ? 'border-blue-600 bg-blue-50 text-blue-900 font-semibold'
                      : 'border-slate-200 text-slate-700'
                  }`}
                >
                  <div className="text-xs font-bold flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-600" />
                    <span>Within 1 to 2 Hours</span>
                  </div>
                  <div className="text-[11px] text-slate-500 font-normal mt-0.5">
                    Gives more faculty time to travel
                  </div>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Session Duration
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[1, 1.5, 2, 3].map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDurationHours(d)}
                    className={`py-2 px-3 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
                      durationHours === d
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {d} {d === 1 ? 'Hour' : 'Hours'}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Preferred Language of Teaching
                </label>
                <select
                  value={preferredLanguage}
                  onChange={(e) => setPreferredLanguage(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  {LANGUAGES_LIST.map((lang) => (
                    <option key={lang} value={lang}>
                      {lang}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Faculty Gender Preference
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['no_preference', 'female', 'male'] as const).map((pref) => (
                    <button
                      key={pref}
                      type="button"
                      onClick={() => setGenderPreference(pref)}
                      className={`py-2 px-2 rounded-lg text-xs font-semibold border transition-colors cursor-pointer capitalize text-center ${
                        genderPreference === pref
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {pref === 'no_preference' ? 'Any' : pref}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Additional Parent Instructions (Optional)
              </label>
              <input
                type="text"
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                placeholder="e.g. Focus on NCERT textbook chapter 4 exercises"
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              />
            </div>
          </div>

          <div className="pt-4 flex items-center justify-between">
            <button
              onClick={() => setStep(3)}
              className="px-4 py-2 text-slate-600 hover:text-slate-900 font-medium text-sm flex items-center gap-1 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              onClick={handleStartMatching}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-lg flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <Sparkles className="w-4 h-4" />
              <span>Find Available Faculty</span>
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: MATCHING, TUTOR SELECTION & BOOKING FLOW */}
      {step === 5 && (
        <div className="space-y-6">
          {/* 1. RADAR SCANNING STATE */}
          {matchingState === 'searching' && (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-6">
              <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-4 border-blue-200 animate-ping opacity-30"></div>
                <div className="w-20 h-20 rounded-full bg-blue-50 border-2 border-blue-600 flex items-center justify-center text-blue-600 shadow-sm">
                  <Clock className="w-8 h-8 animate-pulse" />
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-slate-900">
                  Scanning Available Tutors Near You...
                </h2>
                <p className="text-sm text-slate-600 mt-1 max-w-md mx-auto">
                  Locating verified educators available for {teachingFormat === 'offline' ? 'immediate doorstep visit' : 'instant online room'}. Checking real-time travel times to {pincode}.
                </p>
              </div>

              <div className="max-w-md mx-auto bg-slate-50 rounded-xl p-4 border border-slate-200 text-xs text-left space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Subject:</span>
                  <span className="font-semibold text-slate-900">{selectedSubjects.join(', ')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Student & Grade:</span>
                  <span className="font-semibold text-slate-900">{studentName} ({grade}, {board})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Teaching Mode:</span>
                  <span className="font-semibold text-slate-900 capitalize">
                    {teachingFormat === 'offline' ? 'In-Home Doorstep Visit' : 'Online Classroom'}
                  </span>
                </div>
                <div className="flex justify-between text-blue-700 font-medium pt-1 border-t border-slate-200">
                  <span>Target Response Time:</span>
                  <span>Within 30 Minutes</span>
                </div>
              </div>
            </div>
          )}

          {/* 2. MULTI-TUTOR SELECTION VIEW */}
          {matchingState === 'tutor_selection' && (
            <div className="space-y-8">
              {/* Back to form button */}
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(4)}
                  className="text-xs text-slate-500 hover:text-slate-800 font-medium flex items-center gap-1 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Modify Student Details / Location</span>
                </button>
                <div className="text-xs text-slate-500">
                  Location: <span className="font-semibold text-slate-800">{address}</span>
                </div>
              </div>

              {/* ACTION: Get the Fastest Available Tutor */}
              {fastestTutor && (
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                      <Zap className="w-5 h-5 text-amber-300" />
                    </div>
                    <div>
                      <div className="text-xs uppercase tracking-wider font-bold text-blue-200">
                        In a Hurry? Fastest Match
                      </div>
                      <h3 className="text-base sm:text-lg font-bold">
                        Get the Fastest Available Tutor: {fastestTutor.name}
                      </h3>
                      <p className="text-xs text-blue-100 mt-0.5">
                        Can reach your address in ~{fastestTutor.etaMinutes || 24} minutes at ₹{fastestTutor.hourlyRate}/hr.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleSelectFastestTutor}
                    className="w-full sm:w-auto px-5 py-2.5 bg-amber-400 hover:bg-amber-300 active:scale-98 text-slate-950 font-bold text-xs rounded-xl transition-all shrink-0 cursor-pointer shadow-sm flex items-center justify-center gap-1.5"
                  >
                    <span>Dispatch Fastest Tutor Now</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* FEATURED FACULTY — BEST MATCH */}
              {featuredTutor && (
                <div className="bg-white rounded-2xl border-2 border-blue-600 p-6 sm:p-7 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 bg-blue-600 text-white text-[11px] font-bold px-4 py-1 rounded-bl-xl tracking-wider">
                    RECOMMENDED FOR YOU
                  </div>

                  <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-md border border-emerald-200 w-fit mb-4">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>CONFIRMED AVAILABLE · READY TO DISPATCH</span>
                  </div>

                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-slate-200">
                    <div className="flex items-start sm:items-center gap-4">
                      <img
                        src={featuredTutor.photoUrl}
                        alt={featuredTutor.name}
                        referrerPolicy="no-referrer"
                        className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-slate-200 shrink-0"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
                            {featuredTutor.name}
                          </h3>
                          <span title="Verified Faculty">
                            <ShieldCheck className="w-5 h-5 text-blue-600" />
                          </span>
                        </div>

                        <p className="text-xs text-slate-700 font-medium mt-0.5">
                          {featuredTutor.qualifications}
                        </p>
                        <p className="text-xs text-slate-500">{featuredTutor.university}</p>

                        <div className="flex flex-wrap items-center gap-2 mt-2 text-xs">
                          <span className="bg-blue-50 text-blue-800 font-semibold px-2 py-0.5 rounded border border-blue-200">
                            {featuredTutor.category || 'Experienced School Faculty'}
                          </span>
                          <span className="flex items-center text-amber-500 font-bold">
                            <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-500 mr-1" />
                            {featuredTutor.rating}
                          </span>
                          <span className="text-slate-400">·</span>
                          <span className="text-slate-600">
                            {featuredTutor.experienceYears} Years Experience
                          </span>
                          <span className="text-slate-400">·</span>
                          <span className="text-slate-500">
                            {featuredTutor.reviewsCount} Verified Reviews
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* ETA & Hourly Fee Highlight */}
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left md:text-right shrink-0 w-full md:w-auto">
                      <div className="text-xs text-slate-500">Exact Hourly Teaching Fee</div>
                      <div className="text-2xl font-bold text-slate-900 font-mono">
                        ₹{featuredTutor.hourlyRate} <span className="text-xs font-normal text-slate-500">/ hour</span>
                      </div>
                      <div className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Arriving in ~{featuredTutor.etaMinutes || 24} mins</span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-1">
                        Est. Session Total: ₹{featuredTutor.hourlyRate * durationHours + platformFee} for {durationHours} hrs
                      </div>
                    </div>
                  </div>

                  {/* Badges: Subjects & Covered Classes */}
                  <div className="py-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600">
                    <div>
                      <span className="font-semibold text-slate-800">Subjects Taught: </span>
                      <span>{featuredTutor.subjects.join(', ')}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-slate-800">Boards & Classes: </span>
                      <span>
                        {featuredTutor.boards.slice(0, 3).join(', ')} · {featuredTutor.classesTaught.slice(0, 3).join(', ')}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setSelectedTutorModal(featuredTutor)}
                      className="w-full sm:w-auto px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors cursor-pointer"
                    >
                      View Full Profile & Reviews
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSelectTutor(featuredTutor)}
                      className="w-full sm:w-auto px-8 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-98 text-white font-bold text-xs rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>Select This Teacher</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* FILTERS & SORTING BAR */}
              <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 space-y-3">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <SlidersHorizontal className="w-4 h-4 text-blue-600" />
                    <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                      Filter & Compare Faculty
                    </span>
                    <span className="text-xs text-slate-400">
                      ({matchingAvailableTutors.length} verified matching teachers available now)
                    </span>
                  </div>

                  {/* Gender Filter */}
                  <div className="flex items-center gap-1.5 text-xs">
                    <span className="text-slate-500 font-medium mr-1">Faculty:</span>
                    {(['no_preference', 'female', 'male'] as const).map((gender) => (
                      <button
                        key={gender}
                        type="button"
                        onClick={() => setGenderFilter(gender)}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                          genderFilter === gender
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {gender === 'no_preference' ? 'All Genders' : gender === 'female' ? 'Female Faculty' : 'Male Faculty'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sort Bar */}
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="text-slate-500 font-medium">Sort by:</span>
                  {[
                    { id: 'recommended', label: 'Top Recommended' },
                    { id: 'price_low', label: 'Lowest Price' },
                    { id: 'experience_high', label: 'Highest Experience' },
                    { id: 'rating_high', label: 'Highest Rated' },
                    { id: 'eta_fast', label: 'Fastest Arrival' },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setSortOption(opt.id as any)}
                      className={`px-3 py-1.5 rounded-lg font-semibold cursor-pointer transition-colors ${
                        sortOption === opt.id
                          ? 'bg-slate-900 text-white shadow-xs'
                          : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* OTHER AVAILABLE FACULTY */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">
                    Other Tutors Available Near You
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Compare teachers near {address.split(',')[0] || 'your address'}. Each has verified academic credentials and police background checks.
                  </p>
                </div>

                {otherTutors.length === 0 ? (
                  <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 text-center text-xs text-amber-800 space-y-2">
                    <AlertCircle className="w-6 h-6 text-amber-600 mx-auto" />
                    <div className="font-bold text-sm">No Additional Tutors Matching Exact Filter</div>
                    <p className="max-w-md mx-auto text-amber-700">
                      Additional faculty in your neighborhood are currently taking offline classes. Try setting the gender filter to "All Genders" or book the recommended tutor above.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {otherTutors.map((tutor) => (
                      <div
                        key={tutor.id}
                        className="bg-white rounded-2xl border border-slate-200 hover:border-blue-400 p-5 transition-all shadow-xs flex flex-col justify-between space-y-4"
                      >
                        <div>
                          {/* Top Row: Photo & Details */}
                          <div className="flex items-start gap-3.5 pb-3 border-b border-slate-100">
                            <img
                              src={tutor.photoUrl}
                              alt={tutor.name}
                              referrerPolicy="no-referrer"
                              className="w-16 h-16 rounded-xl object-cover border border-slate-200 shrink-0"
                            />
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-1.5">
                                <h4 className="font-bold text-slate-900 text-base truncate">
                                  {tutor.name}
                                </h4>
                                <span title="Verified Faculty">
                                  <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
                                </span>
                              </div>
                              <p className="text-xs text-slate-600 truncate">{tutor.qualifications}</p>
                              <p className="text-[11px] text-slate-400 truncate">{tutor.university}</p>

                              <div className="flex items-center gap-2 mt-1.5 text-xs">
                                <span className="flex items-center text-amber-500 font-bold">
                                  <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-500 mr-1" />
                                  {tutor.rating}
                                </span>
                                <span className="text-slate-300">·</span>
                                <span className="text-slate-600">{tutor.experienceYears} Yrs Exp</span>
                                <span className="text-slate-300">·</span>
                                <span className="text-slate-500">{tutor.reviewsCount} Reviews</span>
                              </div>
                            </div>
                          </div>

                          {/* Category and rate badge */}
                          <div className="pt-3 flex items-center justify-between text-xs">
                            <span className="text-[11px] font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                              {tutor.category || 'Standard Subject Specialist'}
                            </span>
                            <div className="text-right">
                              <span className="font-mono font-bold text-slate-900 text-base">
                                ₹{tutor.hourlyRate}
                              </span>
                              <span className="text-[11px] text-slate-500"> / hr</span>
                            </div>
                          </div>

                          {/* Subject Expertise & Arrival Time */}
                          <div className="mt-2.5 space-y-1 text-xs text-slate-600">
                            <div className="truncate">
                              <span className="font-medium text-slate-700">Subjects: </span>
                              <span>{tutor.subjects.join(', ')}</span>
                            </div>
                            <div className="truncate">
                              <span className="font-medium text-slate-700">Boards: </span>
                              <span>{tutor.boards.slice(0, 2).join(', ')} ({tutor.classesTaught.slice(0, 2).join(', ')})</span>
                            </div>
                            <div className="flex items-center gap-1.5 pt-1 text-emerald-700 font-semibold text-[11px]">
                              <Clock className="w-3 h-3" />
                              <span>Estimated Arrival: In ~{tutor.etaMinutes || 30} mins</span>
                            </div>
                          </div>
                        </div>

                        {/* Card Actions */}
                        <div className="pt-2 grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => setSelectedTutorModal(tutor)}
                            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors cursor-pointer text-center"
                          >
                            View Profile
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSelectTutor(tutor)}
                            className="px-3 py-2 bg-blue-600 hover:bg-blue-700 active:scale-98 text-white font-bold text-xs rounded-xl transition-all shadow-xs cursor-pointer text-center flex items-center justify-center gap-1"
                          >
                            <span>Select Teacher</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 3. REVIEW SELECTED TUTOR & CONFIRM PAYMENT */}
          {matchingState === 'review_and_pay' && (
            <div className="space-y-6">
              {/* Back to selection button */}
              <button
                type="button"
                onClick={() => setMatchingState('tutor_selection')}
                className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>← Compare / Choose Another Faculty</span>
              </button>

              {/* Selected Tutor Summary Banner */}
              <div className="bg-white rounded-2xl border-2 border-emerald-500 p-6 sm:p-7 shadow-sm">
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-md border border-emerald-200 w-fit mb-4">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span>SELECTED FACULTY · READY FOR IMMEDIATE DISPATCH</span>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-slate-200">
                  <div className="flex items-center gap-4">
                    <img
                      src={matchedTutor.photoUrl}
                      alt={matchedTutor.name}
                      referrerPolicy="no-referrer"
                      className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-slate-200 shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-xl font-bold text-slate-900">{matchedTutor.name}</h3>
                        <span title="Verified Faculty">
                          <ShieldCheck className="w-5 h-5 text-blue-600" />
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-0.5">{matchedTutor.qualifications}</p>
                      <p className="text-xs text-slate-500">{matchedTutor.university}</p>
                      <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-700">
                        <span className="flex items-center text-amber-500 font-bold">
                          <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-500 mr-1" />
                          {matchedTutor.rating}
                        </span>
                        <span>·</span>
                        <span className="font-medium text-slate-600">
                          {matchedTutor.experienceYears} Years Teaching Experience
                        </span>
                        <span>·</span>
                        <span className="text-slate-500">
                          {matchedTutor.reviewsCount} Reviews
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 text-left sm:text-right shrink-0 w-full sm:w-auto">
                    <div className="text-xs text-emerald-800 font-medium">Estimated Arrival Time</div>
                    <div className="text-xl font-bold text-emerald-900 font-mono">
                      ~{matchedTutor.etaMinutes || (teachingFormat === 'offline' ? 24 : 5)} Minutes
                    </div>
                    <div className="text-[11px] text-emerald-700">
                      {teachingFormat === 'offline' ? 'Doorstep Visit' : 'Virtual Classroom'}
                    </div>
                  </div>
                </div>

                {/* Adjust Session Duration on Checkout */}
                <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <span className="text-slate-600 font-medium">
                    Adjust session duration:
                  </span>
                  <div className="flex items-center gap-1.5">
                    {[1, 1.5, 2, 3].map((d) => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => setDurationHours(d)}
                        className={`px-3 py-1 rounded-lg font-semibold cursor-pointer transition-colors ${
                          durationHours === d
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {d} {d === 1 ? 'hr' : 'hrs'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Transparent Pricing Breakdown & Payment */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-slate-900">Session Fee Breakdown</h3>
                  <span className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    Transparent Rates · Zero Hidden Charges
                  </span>
                </div>

                <div className="space-y-3 text-sm text-slate-600 pb-4 border-b border-slate-200">
                  <div className="flex justify-between">
                    <span>
                      Tutor Teaching Charge ({matchedTutor.name} @ ₹{matchedTutor.hourlyRate}/hr × {durationHours} hrs)
                    </span>
                    <span className="font-semibold text-slate-900 font-mono tabular-nums">
                      ₹{tutorRateTotal}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <div>
                      <span>QuickTeach Platform Dispatch Fee</span>
                      <span className="text-[11px] text-slate-400 block">Verification, platform insurance & support</span>
                    </div>
                    <span className="font-semibold text-slate-900 font-mono tabular-nums">
                      ₹{platformFee}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span>Doorstep Travel Charge</span>
                    <span className="font-semibold text-emerald-700 font-mono tabular-nums">
                      {travelFee === 0 ? '₹0 (Included Free)' : `₹${travelFee}`}
                    </span>
                  </div>

                  {instantSurcharge > 0 && (
                    <div className="flex justify-between">
                      <span>Instant Priority Surcharge</span>
                      <span className="font-semibold text-slate-900 font-mono tabular-nums">
                        ₹{instantSurcharge}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between text-xs text-slate-500">
                    <span>Applicable Taxes (GST @ {pricingConfig.gstPercent}%)</span>
                    <span className="font-mono tabular-nums">
                      ₹{taxes}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-center text-lg font-bold text-slate-900">
                  <div>
                    <span>Total Payable</span>
                    <span className="text-xs font-normal text-slate-500 block">
                      Before optional taxes if applicable
                    </span>
                  </div>
                  <span className="text-blue-600 font-mono text-2xl tabular-nums">
                    ₹{totalAmount}
                  </span>
                </div>

                {/* Payment Methods */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2">
                    Select Payment Method (Simulated Escrow Authorization)
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('upi')}
                      className={`p-3 rounded-xl border text-left cursor-pointer transition-colors ${
                        paymentMethod === 'upi'
                          ? 'border-blue-600 bg-blue-50 text-blue-900 font-semibold'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      <div className="text-xs font-bold">UPI / QR Code</div>
                      <div className="text-[11px] text-slate-500 font-normal">GPay, PhonePe, Paytm</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('card')}
                      className={`p-3 rounded-xl border text-left cursor-pointer transition-colors ${
                        paymentMethod === 'card'
                          ? 'border-blue-600 bg-blue-50 text-blue-900 font-semibold'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      <div className="text-xs font-bold">Credit / Debit Card</div>
                      <div className="text-[11px] text-slate-500 font-normal">Visa, Mastercard, RuPay</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('netbanking')}
                      className={`p-3 rounded-xl border text-left cursor-pointer transition-colors ${
                        paymentMethod === 'netbanking'
                          ? 'border-blue-600 bg-blue-50 text-blue-900 font-semibold'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      <div className="text-xs font-bold">Net Banking</div>
                      <div className="text-[11px] text-slate-500 font-normal">All Major Indian Banks</div>
                    </button>
                  </div>

                  {paymentMethod === 'upi' && (
                    <div className="mt-3">
                      <input
                        type="text"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        placeholder="yourname@upi"
                        className="w-full sm:w-72 px-3 py-2 rounded-lg border border-slate-300 text-sm font-mono"
                      />
                    </div>
                  )}
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-xs text-slate-500">
                    🔒 Escrow Security: Payment is held safely and disbursed only upon lesson completion.
                  </div>
                  <button
                    onClick={handleConfirmAndPay}
                    className="w-full sm:w-auto px-8 py-3 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-semibold rounded-xl text-sm transition-all shadow-sm cursor-pointer"
                  >
                    Confirm Tutor & Proceed to Payment
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 4. CONFIRMED BOOKING RECEIPT */}
          {matchingState === 'booked_confirmed' && (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-6">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <Check className="w-8 h-8 stroke-[3]" />
              </div>

              <div>
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  BOOKING CONFIRMED & DISPATCHED
                </span>
                <h2 className="text-2xl font-bold text-slate-900 mt-2">
                  {matchedTutor.name} Is On The Way!
                </h2>
                <p className="text-sm text-slate-600 mt-1">
                  Booking Reference: <span className="font-mono font-bold text-slate-900">{createdBookingId}</span>
                </p>
              </div>

              <div className="max-w-md mx-auto bg-slate-50 rounded-xl p-5 border border-slate-200 text-left text-xs space-y-3">
                <div className="flex justify-between pb-2 border-b border-slate-200">
                  <span className="text-slate-500">Student:</span>
                  <span className="font-semibold text-slate-900">{studentName} ({grade})</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-slate-200">
                  <span className="text-slate-500">Format:</span>
                  <span className="font-semibold text-slate-900 capitalize">
                    {teachingFormat === 'offline' ? `Home Visit to ${address}` : 'Online Class (Link Sent)'}
                  </span>
                </div>
                <div className="flex justify-between pb-2 border-b border-slate-200">
                  <span className="text-slate-500">Estimated Arrival:</span>
                  <span className="font-semibold text-emerald-700 font-mono">
                    In ~{matchedTutor.etaMinutes || (teachingFormat === 'offline' ? 24 : 5)} Minutes
                  </span>
                </div>
                <div className="flex justify-between pb-2 border-b border-slate-200">
                  <span className="text-slate-500">Tutor Rate Applied:</span>
                  <span className="font-semibold text-slate-900 font-mono">
                    ₹{matchedTutor.hourlyRate}/hour × {durationHours} hrs
                  </span>
                </div>
                <div className="flex justify-between pb-2 border-b border-slate-200">
                  <span className="text-slate-500">Tutor Contact Protection:</span>
                  <span className="font-semibold text-slate-900">Masked VoIP Call Active</span>
                </div>
                <div className="flex justify-between pt-1">
                  <span className="text-slate-500">Authorized Escrow Total:</span>
                  <span className="font-bold text-blue-600 font-mono text-sm">₹{totalAmount}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => setCurrentPage('parent-portal')}
                  className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-lg transition-colors cursor-pointer"
                >
                  View in Parent Portal
                </button>
                <button
                  onClick={() => {
                    setStep(1);
                    setMatchingState('searching');
                  }}
                  className="w-full sm:w-auto px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-sm rounded-lg transition-colors cursor-pointer"
                >
                  Book Another Session
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* FULL TUTOR PROFILE MODAL */}
      {selectedTutorModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-2xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl relative">
            <button
              type="button"
              onClick={() => setSelectedTutorModal(null)}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-800 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Profile Header */}
            <div className="flex items-start gap-4">
              <img
                src={selectedTutorModal.photoUrl}
                alt={selectedTutorModal.name}
                referrerPolicy="no-referrer"
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-slate-200 shrink-0"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
                    {selectedTutorModal.name}
                  </h3>
                  <ShieldCheck className="w-5 h-5 text-blue-600" />
                </div>
                <p className="text-xs text-slate-600 mt-0.5">{selectedTutorModal.qualifications}</p>
                <p className="text-xs text-slate-500">{selectedTutorModal.university}</p>

                <div className="flex flex-wrap items-center gap-2 mt-2 text-xs">
                  <span className="bg-blue-50 text-blue-800 font-semibold px-2 py-0.5 rounded border border-blue-200">
                    {selectedTutorModal.category || 'Standard Subject Specialist'}
                  </span>
                  <span className="flex items-center text-amber-500 font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-500 mr-1" />
                    {selectedTutorModal.rating}
                  </span>
                  <span className="text-slate-300">·</span>
                  <span className="text-slate-600">{selectedTutorModal.experienceYears} Years Exp</span>
                </div>
              </div>
            </div>

            {/* Rates & Arrival Banner */}
            <div className="grid grid-cols-2 gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
              <div>
                <span className="text-slate-500">Hourly Teaching Fee:</span>
                <div className="font-mono font-bold text-slate-900 text-lg">
                  ₹{selectedTutorModal.hourlyRate} / hour
                </div>
              </div>
              <div>
                <span className="text-slate-500">Estimated Doorstep Arrival:</span>
                <div className="font-mono font-bold text-emerald-700 text-lg">
                  ~{selectedTutorModal.etaMinutes || 24} minutes
                </div>
              </div>
            </div>

            {/* Bio & Teaching Methodology */}
            <div className="space-y-3 text-xs leading-relaxed text-slate-700">
              <div>
                <h4 className="font-bold text-slate-900 uppercase tracking-wider mb-1">
                  About Faculty
                </h4>
                <p className="text-slate-600">{selectedTutorModal.bio}</p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 uppercase tracking-wider mb-1">
                  Instruction Methodology
                </h4>
                <p className="text-slate-600">{selectedTutorModal.methodology}</p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 uppercase tracking-wider mb-1">
                  Academic Coverage
                </h4>
                <div className="space-y-1">
                  <div>
                    <span className="font-semibold text-slate-800">Subjects: </span>
                    <span>{selectedTutorModal.subjects.join(', ')}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-800">Boards: </span>
                    <span>{selectedTutorModal.boards.join(', ')}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-800">Classes: </span>
                    <span>{selectedTutorModal.classesTaught.join(', ')}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-800">Languages: </span>
                    <span>{selectedTutorModal.languages.join(', ')}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 uppercase tracking-wider mb-1">
                  Safeguarding & Policy
                </h4>
                <p className="text-slate-600">{selectedTutorModal.cancellationPolicy}</p>
              </div>
            </div>

            {/* Bottom Modal CTA */}
            <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedTutorModal(null)}
                className="px-4 py-2 text-slate-600 hover:text-slate-900 font-medium text-xs cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => handleSelectTutor(selectedTutorModal)}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
              >
                <span>Select {selectedTutorModal.name.split(' ')[0]}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
