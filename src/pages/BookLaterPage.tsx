/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  SUBJECTS_LIST,
  BOARDS_LIST,
  GRADES_LIST,
  LANGUAGES_LIST,
} from '../data/mockData';
import { Tutor } from '../types';
import { sanitizeImageUrl, handleImageError } from '../utils/imageUtils';
import {
  Calendar as CalendarIcon,
  Clock,
  Star,
  ShieldCheck,
  Check,
  MapPin,
  Video,
  UserCheck,
  Filter,
  ArrowRight,
  ArrowLeft,
  X,
  CreditCard,
  Building,
  Scale,
  Award,
} from 'lucide-react';

export const BookLaterPage: React.FC = () => {
  const { tutors, pricingConfig, createScheduledBooking, parentAccount, setCurrentPage } = useApp();

  const defaultChild = parentAccount.children[0];

  // Steps: 1: Student, 2: Preferences, 3: Date & Time, 4: Recommended Faculty & Compare, 5: Summary & Payment
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);

  // Step 1: Student details
  const [studentName, setStudentName] = useState(defaultChild?.name || '');
  const [age, setAge] = useState(defaultChild?.age || 15);
  const [grade, setGrade] = useState(defaultChild?.grade || 'Grade 10');
  const [board, setBoard] = useState(defaultChild?.board || 'CBSE');
  const [subject, setSubject] = useState('Mathematics');
  const [language, setLanguage] = useState('English');

  // Step 2: Teaching preferences
  const [teachingFormat, setTeachingFormat] = useState<'offline' | 'online' | 'hybrid'>('online');
  const [offlineAddress, setOfflineAddress] = useState('B-4/12 Safdarjung Enclave, New Delhi');
  const [genderPref, setGenderPref] = useState<'no_preference' | 'male' | 'female'>('no_preference');

  // Step 3: Select date and time
  // Dynamically calculate today, tomorrow, etc. based on 2026-11-02
  const todayStr = '2026-11-03';
  const tomorrowStr = '2026-11-04';
  const dayAfterStr = '2026-11-05';
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);
  const [selectedSlot, setSelectedSlot] = useState<string>('4:00 PM – 5:00 PM');
  const [sessionDuration, setSessionDuration] = useState<number>(1);

  // Step 4: Filters & Faculty selection
  const [filterSort, setFilterSort] = useState<'rated' | 'price_low' | 'experience'>('rated');
  const [filterGender, setFilterGender] = useState<'all' | 'male' | 'female'>('all');
  const [filterFormat, setFilterFormat] = useState<'all' | 'online' | 'offline'>('all');

  // Comparison drawer (up to 3 teachers)
  const [compareTutorIds, setCompareTutorIds] = useState<string[]>([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

  // Selected tutor for booking
  const [selectedTutor, setSelectedTutor] = useState<Tutor | null>(tutors[0]);
  const [detailedModalTutor, setDetailedModalTutor] = useState<Tutor | null>(null);

  // Step 5: Payment
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [upiId, setUpiId] = useState('parent@okaxis');
  const [bookingConfirmedId, setBookingConfirmedId] = useState<string>('');

  // Filtered & sorted tutors
  const filteredTutors = useMemo(() => {
    return tutors
      .filter((tutor) => {
        // Match subject
        const matchesSubj = tutor.subjects.includes(subject) || tutor.subjects.includes('Science');
        // Match gender if filtered
        if (filterGender !== 'all' && tutor.gender !== filterGender) return false;
        // Match format if filtered
        if (filterFormat === 'online' && tutor.format === 'offline') return false;
        if (filterFormat === 'offline' && tutor.format === 'online') return false;
        return matchesSubj;
      })
      .sort((a, b) => {
        if (filterSort === 'price_low') return a.hourlyRate - b.hourlyRate;
        if (filterSort === 'experience') return b.experienceYears - a.experienceYears;
        return b.rating - a.rating; // default: highest rated
      });
  }, [tutors, subject, filterGender, filterFormat, filterSort]);

  const toggleCompare = (tutorId: string) => {
    if (compareTutorIds.includes(tutorId)) {
      setCompareTutorIds(compareTutorIds.filter((id) => id !== tutorId));
    } else {
      if (compareTutorIds.length >= 3) {
        alert('You can compare a maximum of 3 teachers simultaneously.');
        return;
      }
      setCompareTutorIds([...compareTutorIds, tutorId]);
    }
  };

  // Pricing math for scheduled session
  const tutorRateTotal = (selectedTutor?.hourlyRate || 750) * sessionDuration;
  const platformFee = pricingConfig.platformFeeFixed;
  const taxable = tutorRateTotal + platformFee;
  const taxes = Math.round((taxable * pricingConfig.gstPercent) / 100);
  const totalAmount = taxable + taxes;

  const handleFinalizeBooking = () => {
    if (!selectedTutor) return;

    const booking = createScheduledBooking({
      serviceType: 'scheduled',
      studentName,
      age: Number(age),
      grade,
      board,
      subject,
      format: teachingFormat === 'hybrid' ? 'offline' : teachingFormat,
      address: teachingFormat !== 'online' ? offlineAddress : undefined,
      durationHours: sessionDuration,
      preferredLanguage: language,
      scheduledDate: selectedDate,
      scheduledTimeSlot: selectedSlot,
      tutorId: selectedTutor.id,
      tutorName: selectedTutor.name,
      tutorPhoto: selectedTutor.photoUrl,
      tutorRate: selectedTutor.hourlyRate,
      platformFee,
      taxes,
      totalAmount,
      status: 'confirmed',
      paymentMethod:
        paymentMethod === 'upi'
          ? `UPI (${upiId})`
          : paymentMethod === 'card'
          ? 'Credit Card'
          : 'Net Banking',
      paymentId: `PAY-SCH-${Math.floor(100000 + Math.random() * 900000)}`,
    });

    setBookingConfirmedId(booking.id);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full mb-3 border border-indigo-200">
          <CalendarIcon className="w-3.5 h-3.5" />
          <span>SCHEDULE IN ADVANCE</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
          Book the Teacher You Want, Whenever You Need.
        </h1>
        <p className="mt-2 text-sm sm:text-base text-slate-600">
          Choose your preferred teacher and schedule your tutoring session in advance with complete flexibility.
        </p>
      </div>

      {/* Progress bar */}
      {step < 5 && (
        <div className="mb-10 max-w-3xl mx-auto">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-2">
            <span className={step >= 1 ? 'text-blue-600 font-bold' : ''}>1. Student</span>
            <span className={step >= 2 ? 'text-blue-600 font-bold' : ''}>2. Format</span>
            <span className={step >= 3 ? 'text-blue-600 font-bold' : ''}>3. Date & Time</span>
            <span className={step >= 4 ? 'text-blue-600 font-bold' : ''}>4. Faculty</span>
            <span className={step === 5 ? 'text-blue-600 font-bold' : ''}>5. Summary</span>
          </div>
          <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
            <div
              className="bg-indigo-600 h-full transition-all duration-300"
              style={{ width: `${((step - 1) / 4) * 100}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* STEP 1: Student details */}
      {step === 1 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6 max-w-3xl mx-auto">
          <h2 className="text-xl font-bold text-slate-900">Step 1: Student Details & Subject</h2>

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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Target Subject *
              </label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                {SUBJECTS_LIST.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Preferred Teaching Language *
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                {LANGUAGES_LIST.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              onClick={() => {
                if (!studentName.trim()) {
                  alert('Please enter student name.');
                  return;
                }
                setStep(2);
              }}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-lg flex items-center gap-2 cursor-pointer"
            >
              <span>Continue to Teaching Preferences</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Teaching preferences */}
      {step === 2 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6 max-w-3xl mx-auto">
          <h2 className="text-xl font-bold text-slate-900">Step 2: Teaching Preferences</h2>

          {/* Format selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              Teaching Format *
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setTeachingFormat('online')}
                className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                  teachingFormat === 'online'
                    ? 'border-indigo-600 bg-indigo-50/50 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <Video className="w-5 h-5 text-indigo-600 mb-2" />
                <div className="font-bold text-slate-900 text-sm">Online Tuition</div>
                <div className="text-xs text-slate-500 mt-1">Live 1-on-1 virtual classroom</div>
              </button>

              <button
                type="button"
                onClick={() => setTeachingFormat('offline')}
                className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                  teachingFormat === 'offline'
                    ? 'border-indigo-600 bg-indigo-50/50 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <MapPin className="w-5 h-5 text-indigo-600 mb-2" />
                <div className="font-bold text-slate-900 text-sm">Home Tuition / Offline</div>
                <div className="text-xs text-slate-500 mt-1">Tutor visits student’s home</div>
              </button>

              <button
                type="button"
                onClick={() => setTeachingFormat('hybrid')}
                className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                  teachingFormat === 'hybrid'
                    ? 'border-indigo-600 bg-indigo-50/50 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <Building className="w-5 h-5 text-indigo-600 mb-2" />
                <div className="font-bold text-slate-900 text-sm">Hybrid Format</div>
                <div className="text-xs text-slate-500 mt-1">Mix of home visits & online tests</div>
              </button>
            </div>
          </div>

          {teachingFormat !== 'online' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Home Address for Offline Visits *
              </label>
              <input
                type="text"
                value={offlineAddress}
                onChange={(e) => setOfflineAddress(e.target.value)}
                placeholder="House No., Street, Locality, City"
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm"
              />
            </div>
          )}

          {/* Faculty gender preference */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-semibold text-slate-700">
                Faculty Preference
              </label>
              <span className="text-[11px] text-slate-400">
                Subject to suitably qualified teacher availability
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'no_preference', label: 'No Preference' },
                { id: 'female', label: 'Female Faculty' },
                { id: 'male', label: 'Male Faculty' },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setGenderPref(item.id as any)}
                  className={`py-3 px-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                    genderPref === item.id
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-900 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
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
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-lg flex items-center gap-2 cursor-pointer"
            >
              <span>Continue to Schedule</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Select date and time */}
      {step === 3 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6 max-w-3xl mx-auto">
          <h2 className="text-xl font-bold text-slate-900">Step 3: Select Date & Time Slot</h2>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              Choose Session Date
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'Today', date: todayStr, sub: 'Immediate slot' },
                { label: 'Tomorrow', date: tomorrowStr, sub: 'Recommended' },
                { label: 'Thursday', date: dayAfterStr, sub: 'Open slots' },
                { label: 'Weekend', date: '2026-11-07', sub: 'Saturday' },
              ].map((item) => (
                <button
                  key={item.date}
                  type="button"
                  onClick={() => setSelectedDate(item.date)}
                  className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                    selectedDate === item.date
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-950 font-semibold shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <div className="text-sm font-bold">{item.label}</div>
                  <div className="text-xs font-mono text-slate-500 mt-0.5">{item.date}</div>
                  <div className="text-[10px] text-indigo-600 font-medium mt-1">{item.sub}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              Select Time Slot (Based on Teacher Availability)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                '9:00 AM – 10:00 AM',
                '11:00 AM – 12:00 PM',
                '2:00 PM – 3:00 PM',
                '4:00 PM – 5:00 PM',
                '6:00 PM – 7:00 PM',
                '8:00 PM – 9:00 PM',
              ].map((slot) => (
                <button
                  key={slot}
                  type="button"
                  onClick={() => setSelectedSlot(slot)}
                  className={`p-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer flex items-center justify-between ${
                    selectedSlot === slot
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-900 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <span>{slot}</span>
                  {selectedSlot === slot && <Check className="w-4 h-4 text-indigo-600" />}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              Duration per Session
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[1, 1.5, 2].map((dur) => (
                <button
                  key={dur}
                  type="button"
                  onClick={() => setSessionDuration(dur)}
                  className={`py-2.5 px-3 rounded-lg border text-xs font-semibold transition-colors cursor-pointer ${
                    sessionDuration === dur
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {dur} {dur === 1 ? 'Hour' : 'Hours'}
                </button>
              ))}
            </div>
          </div>

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
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-lg flex items-center gap-2 cursor-pointer"
            >
              <span>View Recommended Faculty</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: RECOMMENDED FACULTY LIST & COMPARISON */}
      {step === 4 && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Recommended Faculty for {subject} ({grade})
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Slot requested: {selectedDate} ({selectedSlot}) · Compare up to 3 profiles
              </p>
            </div>

            {/* Compare Bar Trigger */}
            {compareTutorIds.length > 0 && (
              <button
                onClick={() => setIsCompareModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-2 shadow-sm cursor-pointer self-start sm:self-auto"
              >
                <Scale className="w-4 h-4" />
                <span>Compare Selected ({compareTutorIds.length}/3)</span>
              </button>
            )}
          </div>

          {/* Filters Bar */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-slate-700 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" />
                Sort:
              </span>
              <button
                onClick={() => setFilterSort('rated')}
                className={`px-3 py-1.5 rounded-lg font-medium cursor-pointer ${
                  filterSort === 'rated' ? 'bg-indigo-100 text-indigo-900 font-bold' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Highest Rated
              </button>
              <button
                onClick={() => setFilterSort('price_low')}
                className={`px-3 py-1.5 rounded-lg font-medium cursor-pointer ${
                  filterSort === 'price_low' ? 'bg-indigo-100 text-indigo-900 font-bold' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Lowest Price
              </button>
              <button
                onClick={() => setFilterSort('experience')}
                className={`px-3 py-1.5 rounded-lg font-medium cursor-pointer ${
                  filterSort === 'experience' ? 'bg-indigo-100 text-indigo-900 font-bold' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Highest Experience
              </button>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={filterFormat}
                onChange={(e) => setFilterFormat(e.target.value as any)}
                className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-700 bg-white"
              >
                <option value="all">All Formats</option>
                <option value="online">Online Only</option>
                <option value="offline">Home Visits</option>
              </select>

              <select
                value={filterGender}
                onChange={(e) => setFilterGender(e.target.value as any)}
                className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-700 bg-white"
              >
                <option value="all">All Faculty Genders</option>
                <option value="female">Female Faculty</option>
                <option value="male">Male Faculty</option>
              </select>
            </div>
          </div>

          {/* Faculty Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredTutors.map((tutor) => {
              const isCompared = compareTutorIds.includes(tutor.id);
              const isChosen = selectedTutor?.id === tutor.id;

              return (
                <div
                  key={tutor.id}
                  className={`bg-white rounded-2xl border-2 transition-all p-5 flex flex-col justify-between ${
                    isChosen
                      ? 'border-indigo-600 shadow-md ring-1 ring-indigo-600'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div>
                    {/* Top row */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3.5">
                        <img
                          src={sanitizeImageUrl(tutor.photoUrl, tutor.name)}
                          alt={tutor.name}
                          referrerPolicy="no-referrer"
                          onError={(e) => handleImageError(e, tutor.name)}
                          className="w-16 h-16 rounded-xl object-cover border border-slate-200 shrink-0"
                        />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h3 className="font-bold text-slate-900 text-base">{tutor.name}</h3>
                            {tutor.isVerified && (
                              <span title="Verified Faculty">
                                <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-600">{tutor.qualifications}</p>
                          <p className="text-[11px] text-slate-400">{tutor.university}</p>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="text-base font-bold text-slate-900 font-mono tabular-nums">
                          ₹{tutor.hourlyRate}
                          <span className="text-xs text-slate-500 font-normal">/hr</span>
                        </div>
                        <div className="flex items-center justify-end text-xs text-amber-500 font-semibold mt-0.5">
                          <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-500 mr-1" />
                          {tutor.rating}
                          <span className="text-slate-400 font-normal ml-1">({tutor.reviewsCount})</span>
                        </div>
                      </div>
                    </div>

                    {/* Metadata details (Zero-Pill compliant) */}
                    <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-600 space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-700">Experience:</span>
                        <span>{tutor.experienceYears} Years</span>
                        <span>·</span>
                        <span className="font-semibold text-slate-700">Languages:</span>
                        <span>{tutor.languages.join(', ')}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-700">Boards:</span>
                        <span>{tutor.boards.slice(0, 3).join(', ')}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-700">Delivery:</span>
                        <span>
                          {tutor.format === 'both'
                            ? 'Home Visits & Online'
                            : tutor.format === 'offline'
                            ? 'Home Visits Only'
                            : 'Online Only'}
                        </span>
                      </div>
                    </div>

                    <p className="mt-3 text-xs text-slate-600 line-clamp-2 leading-relaxed italic">
                      "{tutor.bio}"
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => toggleCompare(tutor.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                        isCompared
                          ? 'bg-indigo-100 text-indigo-900'
                          : 'text-slate-600 hover:bg-slate-100 border border-slate-200'
                      }`}
                    >
                      {isCompared ? '✓ Added to Compare' : '+ Compare'}
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setDetailedModalTutor(tutor)}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 cursor-pointer"
                      >
                        Full Profile
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setSelectedTutor(tutor);
                          setStep(5);
                        }}
                        className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-colors cursor-pointer shadow-xs"
                      >
                        Select This Teacher
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-4 flex items-center justify-between">
            <button
              onClick={() => setStep(3)}
              className="px-4 py-2 text-slate-600 hover:text-slate-900 font-medium text-sm flex items-center gap-1 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Change Date & Slot</span>
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: BOOKING SUMMARY AND PAYMENT */}
      {step === 5 && selectedTutor && (
        <div className="max-w-3xl mx-auto space-y-6">
          {!bookingConfirmedId ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Step 5: Booking Summary & Payment</h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Review your session parameters and authorize payment.
                  </p>
                </div>
                <button
                  onClick={() => setStep(4)}
                  className="text-xs text-indigo-600 font-semibold hover:underline cursor-pointer"
                >
                  Change Faculty
                </button>
              </div>

              {/* Selected Faculty Card */}
              <div className="bg-indigo-50/50 rounded-xl p-4 border border-indigo-100 flex items-center gap-4">
                <img
                  src={sanitizeImageUrl(selectedTutor.photoUrl, selectedTutor.name)}
                  alt={selectedTutor.name}
                  referrerPolicy="no-referrer"
                  onError={(e) => handleImageError(e, selectedTutor.name)}
                  className="w-16 h-16 rounded-xl object-cover border border-indigo-200 shrink-0"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-bold text-slate-900">{selectedTutor.name}</h3>
                    <ShieldCheck className="w-4 h-4 text-blue-600" />
                  </div>
                  <p className="text-xs text-slate-600">{selectedTutor.qualifications}</p>
                  <div className="text-xs text-slate-700 mt-1 flex items-center gap-2">
                    <span className="font-mono font-bold text-indigo-700">
                      ₹{selectedTutor.hourlyRate}/hour
                    </span>
                    <span>·</span>
                    <span>{selectedTutor.experienceYears} Years Experience</span>
                  </div>
                </div>
              </div>

              {/* Booking Specifications Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                  <div className="text-slate-500">Student & Curriculum</div>
                  <div className="font-bold text-slate-900 text-sm">
                    {studentName} ({grade}, {board})
                  </div>
                  <div className="text-slate-600">Subject: {subject}</div>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                  <div className="text-slate-500">Scheduled Date & Time</div>
                  <div className="font-bold text-slate-900 text-sm">
                    {selectedDate} · {selectedSlot}
                  </div>
                  <div className="text-slate-600">Duration: {sessionDuration} Hour(s)</div>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1 sm:col-span-2">
                  <div className="text-slate-500">Delivery Format & Location</div>
                  <div className="font-bold text-slate-900 text-sm capitalize">
                    {teachingFormat === 'online'
                      ? 'Live Online 1-on-1 Class (Virtual Room Link will be provided)'
                      : `In-Home Visit to: ${offlineAddress}`}
                  </div>
                </div>
              </div>

              {/* Price Calculation Table */}
              <div className="border-t border-slate-200 pt-4 space-y-2 text-sm text-slate-600">
                <div className="flex justify-between">
                  <span>
                    Faculty Teaching Fee (₹{selectedTutor.hourlyRate} × {sessionDuration} hr)
                  </span>
                  <span className="font-semibold text-slate-900 font-mono tabular-nums">
                    ₹{tutorRateTotal}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>QuickTeach Platform Assurance Fee</span>
                  <span className="font-semibold text-slate-900 font-mono tabular-nums">
                    ₹{platformFee}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Taxes (GST @ {pricingConfig.gstPercent}%)</span>
                  <span className="font-semibold text-slate-900 font-mono tabular-nums">
                    ₹{taxes}
                  </span>
                </div>
                <div className="flex justify-between pt-3 border-t border-slate-200 text-base font-bold text-slate-900">
                  <span>Final Payable</span>
                  <span className="text-indigo-600 font-mono text-xl tabular-nums">
                    ₹{totalAmount}
                  </span>
                </div>
              </div>

              {/* Payment selector */}
              <div className="space-y-3 pt-2">
                <label className="block text-xs font-semibold text-slate-700">
                  Payment Method (Simulated Authorization)
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'upi', label: 'UPI (GPay / PhonePe)' },
                    { id: 'card', label: 'Credit / Debit Card' },
                    { id: 'netbanking', label: 'Net Banking' },
                  ].map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setPaymentMethod(m.id as any)}
                      className={`p-3 rounded-xl border text-xs font-semibold text-center cursor-pointer transition-colors ${
                        paymentMethod === m.id
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-950'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>

                {paymentMethod === 'upi' && (
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="name@upi"
                    className="w-full sm:w-72 px-3 py-2 rounded-lg border border-slate-300 text-sm font-mono"
                  />
                )}
              </div>

              <div className="pt-4 flex items-center justify-between">
                <button
                  onClick={() => setStep(4)}
                  className="px-4 py-2 text-slate-600 hover:text-slate-900 font-medium text-sm flex items-center gap-1 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
                <button
                  onClick={handleFinalizeBooking}
                  className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-xl cursor-pointer shadow-sm transition-colors"
                >
                  Confirm & Complete Booking (₹{totalAmount})
                </button>
              </div>
            </div>
          ) : (
            /* Booking Confirmation View */
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-6">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <Check className="w-8 h-8 stroke-[3]" />
              </div>

              <div>
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  SCHEDULED SESSION CONFIRMED
                </span>
                <h2 className="text-2xl font-bold text-slate-900 mt-2">
                  Session Locked with {selectedTutor.name}
                </h2>
                <p className="text-sm text-slate-600 mt-1">
                  Booking Code: <span className="font-mono font-bold text-slate-900">{bookingConfirmedId}</span>
                </p>
              </div>

              <div className="max-w-md mx-auto bg-slate-50 rounded-xl p-5 border border-slate-200 text-left text-xs space-y-3">
                <div className="flex justify-between pb-2 border-b border-slate-200">
                  <span className="text-slate-500">Student:</span>
                  <span className="font-semibold text-slate-900">{studentName} ({grade})</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-slate-200">
                  <span className="text-slate-500">Scheduled Date:</span>
                  <span className="font-semibold text-slate-900">{selectedDate} ({selectedSlot})</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-slate-200">
                  <span className="text-slate-500">Mode:</span>
                  <span className="font-semibold text-slate-900 capitalize">
                    {teachingFormat === 'online' ? 'Online Video Class' : `Home Visit to ${offlineAddress}`}
                  </span>
                </div>
                <div className="flex justify-between pt-1">
                  <span className="text-slate-500">Total Paid:</span>
                  <span className="font-bold text-indigo-700 font-mono text-sm">₹{totalAmount}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => setCurrentPage('parent-portal')}
                  className="w-full sm:w-auto px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-lg transition-colors cursor-pointer"
                >
                  Manage in Parent Dashboard
                </button>
                <button
                  onClick={() => {
                    setStep(1);
                    setBookingConfirmedId('');
                  }}
                  className="w-full sm:w-auto px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-sm rounded-lg transition-colors cursor-pointer"
                >
                  Book for Another Date
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Compare Modal */}
      {isCompareModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Scale className="w-5 h-5 text-indigo-600" />
                Faculty Comparison ({compareTutorIds.length} Teachers)
              </h3>
              <button
                onClick={() => setIsCompareModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 text-xs">
              {compareTutorIds.map((id) => {
                const tutor = tutors.find((t) => t.id === id);
                if (!tutor) return null;
                return (
                  <div key={tutor.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-4">
                    <div className="text-center">
                      <img
                        src={sanitizeImageUrl(tutor.photoUrl, tutor.name)}
                        alt={tutor.name}
                        referrerPolicy="no-referrer"
                        onError={(e) => handleImageError(e, tutor.name)}
                        className="w-20 h-20 rounded-xl object-cover mx-auto border border-slate-300"
                      />
                      <h4 className="font-bold text-slate-900 text-sm mt-2">{tutor.name}</h4>
                      <p className="text-slate-500 text-[11px]">{tutor.qualifications}</p>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-slate-200">
                      <div>
                        <span className="text-slate-400">Hourly Fee:</span>
                        <div className="font-bold font-mono text-slate-900">₹{tutor.hourlyRate}/hr</div>
                      </div>
                      <div>
                        <span className="text-slate-400">Rating:</span>
                        <div className="font-bold text-amber-600">★ {tutor.rating} ({tutor.reviewsCount} reviews)</div>
                      </div>
                      <div>
                        <span className="text-slate-400">Experience:</span>
                        <div className="font-semibold text-slate-800">{tutor.experienceYears} Years</div>
                      </div>
                      <div>
                        <span className="text-slate-400">Subjects:</span>
                        <div className="text-slate-700">{tutor.subjects.join(', ')}</div>
                      </div>
                      <div>
                        <span className="text-slate-400">Teaching Methodology:</span>
                        <div className="text-slate-700 text-[11px] leading-relaxed line-clamp-3">
                          {tutor.methodology}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedTutor(tutor);
                        setIsCompareModalOpen(false);
                        setStep(5);
                      }}
                      className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg text-xs cursor-pointer"
                    >
                      Choose {tutor.name}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Detailed Tutor Profile Modal */}
      {detailedModalTutor && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <h3 className="text-lg font-bold text-slate-900">Faculty Credentials</h3>
              <button
                onClick={() => setDetailedModalTutor(null)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-5">
              <div className="flex items-start gap-4">
                <img
                  src={sanitizeImageUrl(detailedModalTutor.photoUrl, detailedModalTutor.name)}
                  alt={detailedModalTutor.name}
                  referrerPolicy="no-referrer"
                  onError={(e) => handleImageError(e, detailedModalTutor.name)}
                  className="w-20 h-20 rounded-xl object-cover border border-slate-200 shrink-0"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-lg font-bold text-slate-900">{detailedModalTutor.name}</h4>
                    <ShieldCheck className="w-4 h-4 text-blue-600" />
                  </div>
                  <p className="text-xs text-slate-600">{detailedModalTutor.qualifications}</p>
                  <p className="text-xs text-slate-500">{detailedModalTutor.university}</p>
                  <div className="flex items-center gap-2 mt-1.5 text-xs">
                    <span className="font-mono font-bold text-indigo-700">₹{detailedModalTutor.hourlyRate}/hr</span>
                    <span>·</span>
                    <span className="text-amber-600 font-semibold">★ {detailedModalTutor.rating}</span>
                    <span>·</span>
                    <span className="text-slate-600">{detailedModalTutor.experienceYears} Years Exp</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3 text-xs text-slate-700">
                <div>
                  <h5 className="font-bold text-slate-900 mb-1">Teaching Philosophy & Methodology</h5>
                  <p className="leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-200">
                    {detailedModalTutor.methodology}
                  </p>
                </div>

                <div>
                  <h5 className="font-bold text-slate-900 mb-1">Academic Specializations & Boards</h5>
                  <p className="leading-relaxed">
                    Subjects: <span className="font-semibold">{detailedModalTutor.subjects.join(', ')}</span>
                  </p>
                  <p className="leading-relaxed mt-0.5">
                    Boards: <span className="font-semibold">{detailedModalTutor.boards.join(', ')}</span>
                  </p>
                </div>

                <div>
                  <h5 className="font-bold text-slate-900 mb-1">Cancellation & Rescheduling Policy</h5>
                  <p className="text-slate-600">{detailedModalTutor.cancellationPolicy}</p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 flex justify-end gap-3">
                <button
                  onClick={() => setDetailedModalTutor(null)}
                  className="px-4 py-2 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setSelectedTutor(detailedModalTutor);
                    setDetailedModalTutor(null);
                    setStep(5);
                  }}
                  className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs cursor-pointer"
                >
                  Select This Teacher
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
