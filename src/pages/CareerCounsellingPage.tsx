/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  CAREER_INTERESTS_LIST,
  CAREER_CONFUSION_OPTIONS,
  EXAMINATION_PATHWAYS,
  LANGUAGES_LIST,
  BOARDS_LIST,
} from '../data/mockData';
import { CareerCounsellor } from '../types';
import {
  Compass,
  CheckCircle,
  Clock,
  ShieldCheck,
  Star,
  ArrowRight,
  ArrowLeft,
  Calendar as CalendarIcon,
  Video,
  MapPin,
  AlertCircle,
  HelpCircle,
  Sparkles,
  BookOpen,
  GraduationCap,
  Briefcase,
  Check,
} from 'lucide-react';

export const CareerCounsellingPage: React.FC = () => {
  const {
    careerCounsellors,
    createCareerBooking,
    parentAccount,
    setCurrentPage,
  } = useApp();

  const defaultChild = parentAccount.children[0];

  // Steps: 1: Profile, 2: Interests & Confusion, 3: Exam Pathways, 4: Personal Report, 5: Counsellor, 6: Booking & Confirmation
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5 | 6>(1);

  // Step 1: Student Profile
  const [studentName, setStudentName] = useState(defaultChild?.name || 'Aryan Malhotra');
  const [age, setAge] = useState(defaultChild?.age || 15);
  const [currentClass, setCurrentClass] = useState('Class 11');
  const [board, setBoard] = useState(defaultChild?.board || 'CBSE');
  const [stream, setStream] = useState('Science (PCM)');
  const [location, setLocation] = useState('New Delhi / NCR');
  const [counsellingLanguage, setCounsellingLanguage] = useState('English');

  // Step 2: Interests & Confusion
  const [selectedInterests, setSelectedInterests] = useState<string[]>([
    'Engineering & Technology',
    'Business & Management',
  ]);
  const [biggestConfusion, setBiggestConfusion] = useState<string>(
    'Which competitive examination should I prepare for?'
  );

  // Step 3: Pathway selection tab
  const [selectedPathwayCategory, setSelectedPathwayCategory] = useState<string>(
    'Engineering & Technology'
  );

  // Step 5: Counsellor selection
  const [selectedCounsellor, setSelectedCounsellor] = useState<CareerCounsellor>(
    careerCounsellors[0]
  );
  const [sessionFormat, setSessionFormat] = useState<'online' | 'offline'>('online');
  const [sessionDuration, setSessionDuration] = useState<30 | 45 | 60>(45);

  // Step 6: Slot & Payment
  const todayStr = '2026-11-04';
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);
  const [selectedSlot, setSelectedSlot] = useState<string>('2:00 PM – 3:00 PM');
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [upiId, setUpiId] = useState('parent@okaxis');
  const [confirmedBookingId, setConfirmedBookingId] = useState<string>('');

  const toggleInterest = (interestName: string) => {
    if (selectedInterests.includes(interestName)) {
      if (selectedInterests.length > 1) {
        setSelectedInterests(selectedInterests.filter((i) => i !== interestName));
      }
    } else {
      setSelectedInterests([...selectedInterests, interestName]);
    }
  };

  const sessionPrice = selectedCounsellor.prices[sessionDuration] || 699;

  const handleBookSession = () => {
    const booking = createCareerBooking({
      studentName,
      age: Number(age),
      grade: currentClass,
      board,
      stream,
      location,
      language: counsellingLanguage,
      interests: selectedInterests,
      biggestConfusion,
      counsellorId: selectedCounsellor.id,
      counsellorName: selectedCounsellor.name,
      counsellorPhoto: selectedCounsellor.photoUrl,
      date: selectedDate,
      timeSlot: selectedSlot,
      durationMinutes: sessionDuration,
      sessionPrice,
      format: sessionFormat,
      status: 'confirmed',
    });
    setConfirmedBookingId(booking.id);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-10">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 bg-blue-50 px-3.5 py-1 rounded-full border border-blue-200">
          <Compass className="w-3.5 h-3.5 text-blue-600" />
          <span>CAREER COUNSELLING & ENTRANCE ROADMAPS · CLASSES 10, 11 & 12</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
          Confused About Your Future? <br />
          <span className="text-blue-600">Let’s Find the Right Path.</span>
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
          Explore career possibilities, understand entrance examinations and get personalised guidance from experienced career counsellors.
        </p>
      </div>

      {/* Progress Bar */}
      {step < 6 && (
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-2">
            <span className={step >= 1 ? 'text-blue-600 font-bold' : ''}>1. Profile</span>
            <span className={step >= 2 ? 'text-blue-600 font-bold' : ''}>2. Interests</span>
            <span className={step >= 3 ? 'text-blue-600 font-bold' : ''}>3. Exam Pathways</span>
            <span className={step >= 4 ? 'text-blue-600 font-bold' : ''}>4. Report</span>
            <span className={step >= 5 ? 'text-blue-600 font-bold' : ''}>5. Counsellor</span>
            <span className={step === 6 ? 'text-blue-600 font-bold' : ''}>6. Book</span>
          </div>
          <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
            <div
              className="bg-blue-600 h-full transition-all duration-300"
              style={{ width: `${((step - 1) / 5) * 100}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* STEP 1: STUDENT PROFILE */}
      {step === 1 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6 max-w-3xl mx-auto shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-lg font-bold text-slate-900">Step 1: Student Profile</h2>
            <span className="text-xs text-slate-500">Targeted for Classes 10, 11 & 12</span>
          </div>

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
                min={13}
                max={22}
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Current Class *
              </label>
              <select
                value={currentClass}
                onChange={(e) => setCurrentClass(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm bg-white"
              >
                <option value="Class 10">Class 10 (Stream Selection Stage)</option>
                <option value="Class 11">Class 11 (Foundational Entrance Prep)</option>
                <option value="Class 12">Class 12 (Target Exam & Board Year)</option>
                <option value="Dropper / Passout">Dropper / Gap Year</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Educational Board *
              </label>
              <select
                value={board}
                onChange={(e) => setBoard(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm bg-white"
              >
                {BOARDS_LIST.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Academic Stream *
              </label>
              <select
                value={stream}
                onChange={(e) => setStream(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm bg-white"
              >
                <option value="Science (PCM)">Science (Physics, Chemistry, Math)</option>
                <option value="Science (PCB)">Science (Physics, Chemistry, Biology)</option>
                <option value="Science (PCMB)">Science (PCMB Combined)</option>
                <option value="Commerce (with Math)">Commerce (with Mathematics)</option>
                <option value="Commerce (without Math)">Commerce (without Math)</option>
                <option value="Arts / Humanities">Arts & Humanities</option>
                <option value="Undecided / Class 10">Undecided (Need Stream Guidance)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Location (City / State) *
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. New Delhi, Bengaluru, Mumbai"
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Preferred Counselling Language *
              </label>
              <select
                value={counsellingLanguage}
                onChange={(e) => setCounsellingLanguage(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm bg-white"
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
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <span>Continue to Career Interests</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: UNDERSTAND STUDENT'S INTERESTS & CONFUSION */}
      {step === 2 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6 max-w-3xl mx-auto shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-lg font-bold text-slate-900">
              Step 2: Understand Student’s Interests & Biggest Confusion
            </h2>
            <span className="text-xs text-slate-500">Multi-select interest cards</span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              Select Career Areas That Intrigue You (Select all that apply) *
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {CAREER_INTERESTS_LIST.map((item) => {
                const isSelected = selectedInterests.includes(item.name);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => toggleInterest(item.name)}
                    className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/60 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 text-xs">{item.name}</span>
                      {isSelected && (
                        <div className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]">
                          ✓
                        </div>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{item.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-2">
            <label className="block text-xs font-bold text-slate-900 mb-2">
              What is your biggest confusion right now? *
            </label>
            <div className="space-y-2">
              {CAREER_CONFUSION_OPTIONS.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setBiggestConfusion(opt)}
                  className={`w-full p-3 rounded-xl border text-left text-xs font-medium transition-colors cursor-pointer flex items-center justify-between ${
                    biggestConfusion === opt
                      ? 'border-blue-600 bg-blue-50 text-blue-900 font-semibold'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <span>{opt}</span>
                  {biggestConfusion === opt && <Check className="w-4 h-4 text-blue-600 shrink-0" />}
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
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <span>Explore Examination Pathways</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: EXPLORE EXAMINATION PATHWAYS & ELIGIBILITY */}
      {step === 3 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Step 3: Explore Examination Pathways & Real Eligibility
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Understand when you become eligible and what preparation can begin at {currentClass} stage.
              </p>
            </div>
            <div className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200">
              Current: {currentClass} · {stream}
            </div>
          </div>

          {/* Educational stage alert */}
          <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong>Crucial Eligibility Guideline for {currentClass} Students:</strong>
              <p className="mt-0.5 text-amber-800">
                Certain career pathways (like UPSC Civil Services or SBI PO) require a full graduate degree (Bachelor's) and cannot be attempted in school. In contrast, examinations like JEE, NEET, IPMAT, CLAT, and NDA are open directly after/during Class 12. We distinguish between immediate test preparation and future planning below.
              </p>
            </div>
          </div>

          {/* Category tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-semibold">
            {EXAMINATION_PATHWAYS.map((cat) => (
              <button
                key={cat.category}
                type="button"
                onClick={() => setSelectedPathwayCategory(cat.category)}
                className={`px-3.5 py-2 rounded-lg whitespace-nowrap cursor-pointer transition-colors ${
                  selectedPathwayCategory === cat.category
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {cat.category}
              </button>
            ))}
          </div>

          {/* Examination Detail Cards */}
          <div className="grid grid-cols-1 gap-4">
            {EXAMINATION_PATHWAYS.find((c) => c.category === selectedPathwayCategory)?.exams.map(
              (exam, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-xl border border-slate-200 bg-slate-50/60 space-y-3 text-xs"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-2 border-b border-slate-200">
                    <div>
                      <h3 className="text-base font-bold text-slate-900">{exam.name}</h3>
                      <span className="text-blue-700 font-medium">{exam.targetLevel}</span>
                    </div>
                    <span className="text-slate-500 font-mono text-[11px]">{exam.topInstitutes}</span>
                  </div>

                  <p className="text-slate-700 leading-relaxed">{exam.description}</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 pt-1 text-slate-700">
                    <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                      <strong className="text-slate-900 block mb-0.5">Eligibility Stage:</strong>
                      <span>{exam.eligibilityStage}</span>
                    </div>
                    <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                      <strong className="text-slate-900 block mb-0.5">Required Subjects:</strong>
                      <span>{exam.requiredSubjects}</span>
                    </div>
                  </div>

                  <div className="bg-blue-50/80 p-2.5 rounded-lg border border-blue-200 text-blue-900">
                    <strong className="block mb-0.5">When to Start Preparation:</strong>
                    <span>{exam.preparationStage}</span>
                  </div>
                </div>
              )
            )}
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
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <span>Generate Personal Career Report</span>
              <Sparkles className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: VIEW PERSONAL CAREER RECOMMENDATIONS REPORT */}
      {step === 4 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200 uppercase tracking-wider">
                PERSONALIZED ADVISORY REPORT
              </span>
              <h2 className="text-xl font-bold text-slate-900 mt-1">
                Career Exploration Report for {studentName}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Cohort: {currentClass} · {stream} · {board}
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400">Analysis Date</span>
              <div className="text-xs font-mono font-semibold text-slate-700">Nov 2026</div>
            </div>
          </div>

          {/* Core Recommended Pathways */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Compass className="w-4 h-4 text-blue-600" />
              Suggested Career Pathways Based on Your Profile
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedInterests.map((interest, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2 text-xs">
                  <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                    <span>Pathway {idx + 1}: {interest}</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed">
                    Well aligned with {stream}. Offers both high-demand commercial applications and long-term research or leadership opportunities.
                  </p>
                  <div className="pt-2 text-[11px] text-slate-500 space-y-1">
                    <div>
                      <strong>Recommended Entrance Route: </strong>
                      {interest.includes('Engineering')
                        ? 'JEE Main, BITSAT, State Engineering CETs'
                        : interest.includes('Business')
                        ? 'IPMAT (IIM Indore/Rohtak), CUET UG (BMS/BBA)'
                        : interest.includes('Medical')
                        ? 'NEET UG'
                        : interest.includes('Law')
                        ? 'CLAT, AILET'
                        : 'Undergraduate Degree followed by specialized entrance'}
                    </div>
                    <div>
                      <strong>Potential College Clusters: </strong>
                      IITs, NITs, IIMs, National Law Universities, Central Universities
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actionable Next Steps */}
          <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 text-xs text-slate-800 space-y-2">
            <h4 className="font-bold text-blue-950 flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-blue-600" />
              Suggested Next Steps for {currentClass}
            </h4>
            <ul className="list-disc pl-5 space-y-1 text-slate-700">
              <li>
                <strong>Immediate Focus: </strong> Master Class 11 core textbook principles. Over 55% of competitive entrance questions test Class 11 mechanics/fundamentals.
              </li>
              <li>
                <strong>Aptitude Habit: </strong> Dedicate 45 minutes daily to analytical problem-solving and critical comprehension reading.
              </li>
              <li>
                <strong>Avoid premature panic: </strong> Target entrance examinations are taken in Class 12. Use Class 11 to crystallize foundational concepts.
              </li>
            </ul>
          </div>

          {/* Mandatory Guidance Disclaimer */}
          <div className="p-3 bg-slate-100 rounded-lg text-[11px] text-slate-500 leading-relaxed flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            <span>
              <strong>Advisory Notice: </strong> This report represents exploratory guidance based on self-reported interests and curriculum stage. It is not an absolute psychometric diagnosis or guarantee of entrance exam outcomes. A 1-on-1 discussion with a certified counsellor is recommended to tailor the roadmap.
            </span>
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
              onClick={() => setStep(5)}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <span>Connect with a Career Counsellor</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: SELECT A CAREER COUNSELLOR */}
      {step === 5 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Step 5: Select Your Verified Career Counsellor
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Experienced educational psychologists and admissions strategists.
              </p>
            </div>
            {/* Format toggle */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs font-semibold">
              <button
                type="button"
                onClick={() => setSessionFormat('online')}
                className={`px-3 py-1.5 rounded-md cursor-pointer transition-colors ${
                  sessionFormat === 'online' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600'
                }`}
              >
                Online Video
              </button>
              <button
                type="button"
                onClick={() => setSessionFormat('offline')}
                className={`px-3 py-1.5 rounded-md cursor-pointer transition-colors ${
                  sessionFormat === 'offline' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600'
                }`}
              >
                In-Person Centre
              </button>
            </div>
          </div>

          {/* Counsellors Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {careerCounsellors.map((counsellor) => {
              const isSelected = selectedCounsellor.id === counsellor.id;
              return (
                <div
                  key={counsellor.id}
                  className={`p-5 rounded-2xl border-2 transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50/30 shadow-md ring-1 ring-blue-600'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <img
                        src={counsellor.photoUrl}
                        alt={counsellor.name}
                        referrerPolicy="no-referrer"
                        className="w-14 h-14 rounded-xl object-cover border border-slate-200 shrink-0"
                      />
                      <div>
                        <div className="flex items-center gap-1">
                          <h4 className="font-bold text-slate-900 text-sm">{counsellor.name}</h4>
                          {counsellor.isVerified && (
                            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 line-clamp-1">{counsellor.qualifications}</p>
                        <div className="text-[11px] text-slate-600 mt-0.5">
                          {counsellor.experienceYears} Years Exp · {counsellor.languages.join(', ')}
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2 italic leading-relaxed">
                      "{counsellor.bio}"
                    </p>

                    <div className="space-y-1 text-[11px] text-slate-700">
                      <strong className="block text-slate-900">Specialisations:</strong>
                      <div className="flex flex-wrap gap-1">
                        {counsellor.specialisations.map((s, i) => (
                          <span key={i} className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[10px]">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400">Starting at</span>
                      <div className="font-bold font-mono text-slate-900 text-sm">
                        ₹{counsellor.prices[30]}
                        <span className="text-xs text-slate-500 font-normal"> / 30m</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedCounsellor(counsellor);
                        setStep(6);
                      }}
                      className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs cursor-pointer"
                    >
                      Choose Slot
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-4 flex items-center justify-between">
            <button
              onClick={() => setStep(4)}
              className="px-4 py-2 text-slate-600 hover:text-slate-900 font-medium text-sm flex items-center gap-1 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Report</span>
            </button>
          </div>
        </div>
      )}

      {/* STEP 6: BOOK SESSION & PAYMENT CONFIRMATION */}
      {step === 6 && (
        <div className="max-w-3xl mx-auto space-y-6">
          {!confirmedBookingId ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
              <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Step 6: Confirm Career Counselling Session
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Lock in your 1-on-1 appointment with {selectedCounsellor.name}.
                  </p>
                </div>
                <button
                  onClick={() => setStep(5)}
                  className="text-xs text-blue-600 font-semibold hover:underline cursor-pointer"
                >
                  Change Counsellor
                </button>
              </div>

              {/* Selected Counsellor card */}
              <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100 flex items-center gap-4">
                <img
                  src={selectedCounsellor.photoUrl}
                  alt={selectedCounsellor.name}
                  referrerPolicy="no-referrer"
                  className="w-16 h-16 rounded-xl object-cover border border-blue-200 shrink-0"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-bold text-slate-900">{selectedCounsellor.name}</h3>
                    <ShieldCheck className="w-4 h-4 text-blue-600" />
                  </div>
                  <p className="text-xs text-slate-600">{selectedCounsellor.qualifications}</p>
                  <p className="text-xs text-blue-700 font-medium mt-0.5">
                    Mode: {sessionFormat === 'online' ? 'Live Video Room' : 'In-Person Guidance Centre'}
                  </p>
                </div>
              </div>

              {/* Session Duration Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  Select Session Duration
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[30, 45, 60].map((dur) => (
                    <button
                      key={dur}
                      type="button"
                      onClick={() => setSessionDuration(dur as any)}
                      className={`p-3 rounded-xl border text-center cursor-pointer transition-colors ${
                        sessionDuration === dur
                          ? 'border-blue-600 bg-blue-50 text-blue-900 font-bold'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      <div className="text-sm">{dur} Minutes</div>
                      <div className="text-xs font-mono font-semibold mt-0.5">
                        ₹{selectedCounsellor.prices[dur as 30 | 45 | 60]}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Date & Slot selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Select Appointment Date
                  </label>
                  <select
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white"
                  >
                    <option value="2026-11-04">Tomorrow (Nov 4, 2026)</option>
                    <option value="2026-11-05">Thursday (Nov 5, 2026)</option>
                    <option value="2026-11-07">Saturday (Nov 7, 2026)</option>
                    <option value="2026-11-08">Sunday (Nov 8, 2026)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Available Time Slot
                  </label>
                  <select
                    value={selectedSlot}
                    onChange={(e) => setSelectedSlot(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white"
                  >
                    {selectedCounsellor.availableSlots.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Fee summary & payment */}
              <div className="border-t border-slate-200 pt-4 space-y-2 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>
                    Career Counselling Session ({sessionDuration} mins with {selectedCounsellor.name})
                  </span>
                  <span className="font-semibold text-slate-900 font-mono">₹{sessionPrice}</span>
                </div>
                <div className="flex justify-between">
                  <span>QuickTeach Roadmap & Report Archive Fee</span>
                  <span className="font-semibold text-slate-900 font-mono">₹0 (Free)</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-200 text-sm font-bold text-slate-900">
                  <span>Total Payable:</span>
                  <span className="text-blue-600 font-mono text-base">₹{sessionPrice}</span>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  Payment Method (Simulated Authorization)
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'upi', label: 'UPI / QR Code' },
                    { id: 'card', label: 'Credit / Debit Card' },
                    { id: 'netbanking', label: 'Net Banking' },
                  ].map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setPaymentMethod(m.id as any)}
                      className={`p-2.5 rounded-lg border text-xs font-semibold text-center cursor-pointer transition-colors ${
                        paymentMethod === m.id
                          ? 'border-blue-600 bg-blue-50 text-blue-900'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>

                {paymentMethod === 'upi' && (
                  <div className="mt-2.5">
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="parent@upi"
                      className="w-full sm:w-64 px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-mono"
                    />
                  </div>
                )}
              </div>

              <div className="pt-4 flex items-center justify-between">
                <button
                  onClick={() => setStep(5)}
                  className="px-4 py-2 text-slate-600 hover:text-slate-900 font-medium text-sm flex items-center gap-1 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
                <button
                  onClick={handleBookSession}
                  className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl cursor-pointer shadow-sm transition-colors"
                >
                  Confirm & Pay ₹{sessionPrice}
                </button>
              </div>
            </div>
          ) : (
            /* Confirmation Receipt */
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-6 shadow-xs">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <Check className="w-8 h-8 stroke-[3]" />
              </div>

              <div>
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  APPOINTMENT CONFIRMED
                </span>
                <h2 className="text-2xl font-bold text-slate-900 mt-2">
                  Session Scheduled with {selectedCounsellor.name}
                </h2>
                <p className="text-sm text-slate-600 mt-1">
                  Booking Reference: <span className="font-mono font-bold text-slate-900">{confirmedBookingId}</span>
                </p>
              </div>

              <div className="max-w-md mx-auto bg-slate-50 rounded-xl p-5 border border-slate-200 text-left text-xs space-y-3">
                <div className="flex justify-between pb-2 border-b border-slate-200">
                  <span className="text-slate-500">Student:</span>
                  <span className="font-semibold text-slate-900">{studentName} ({currentClass})</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-slate-200">
                  <span className="text-slate-500">Date & Slot:</span>
                  <span className="font-semibold text-slate-900">{selectedDate} ({selectedSlot})</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-slate-200">
                  <span className="text-slate-500">Duration:</span>
                  <span className="font-semibold text-slate-900">{sessionDuration} Minutes ({sessionFormat})</span>
                </div>
                <div className="flex justify-between pt-1">
                  <span className="text-slate-500">Session Fee:</span>
                  <span className="font-bold text-blue-600 font-mono text-sm">₹{sessionPrice} (Paid)</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => setCurrentPage('parent-portal')}
                  className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl transition-colors cursor-pointer"
                >
                  View in Parent Portal
                </button>
                <button
                  onClick={() => {
                    setStep(1);
                    setConfirmedBookingId('');
                  }}
                  className="w-full sm:w-auto px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-sm rounded-xl transition-colors cursor-pointer"
                >
                  Plan Another Session
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
