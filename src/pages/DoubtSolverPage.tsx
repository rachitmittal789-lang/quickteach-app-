/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  SUBJECTS_LIST,
  BOARDS_LIST,
  GRADES_LIST,
  LANGUAGES_LIST,
  SAMPLE_DOUBT_QUESTIONS,
} from '../data/mockData';
import { CommunityDoubtFeed } from '../components/CommunityDoubtFeed';
import { sanitizeImageUrl, handleImageError } from '../utils/imageUtils';
import {
  MessageCircle,
  Phone,
  Video,
  Upload,
  FileText,
  ShieldCheck,
  Star,
  Clock,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Camera,
  Check,
  AlertCircle,
  Users,
} from 'lucide-react';

export const DoubtSolverPage: React.FC = () => {
  const {
    tutors,
    pricingConfig,
    startDoubtSession,
    parentAccount,
    setCurrentPage,
    activeDoubtTab,
    setActiveDoubtTab,
  } = useApp();

  const defaultChild = parentAccount.children[0];

  // Steps: 1: Student Info, 2: Submit Doubt, 3: Mode, 4: Matching & Connect
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form
  const [studentName, setStudentName] = useState(defaultChild?.name || '');
  const [grade, setGrade] = useState(defaultChild?.grade || 'Grade 10');
  const [board, setBoard] = useState(defaultChild?.board || 'CBSE');
  const [subject, setSubject] = useState('Mathematics');
  const [language, setLanguage] = useState('English');

  // Doubt submission: 'upload' vs 'type'
  const [submissionType, setSubmissionType] = useState<'type' | 'upload'>('type');
  const [typedDoubt, setTypedDoubt] = useState(
    'How do I find the roots of 3x² - 5x + 2 = 0 using the quadratic formula step-by-step? Please show the discriminant calculation.'
  );
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>('');

  // Call mode: 'voice' | 'video'
  const [callMode, setCallMode] = useState<'voice' | 'video'>('voice');

  // Matching state
  const [isMatching, setIsMatching] = useState(false);
  const [matchedFaculty, setMatchedFaculty] = useState(tutors[0]);

  const handleSelectSample = (sample: (typeof SAMPLE_DOUBT_QUESTIONS)[0]) => {
    setSubject(sample.subject);
    setTypedDoubt(sample.text);
    setSubmissionType('type');
  };

  const handleMockImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // In browser, create an object URL for preview
      const previewUrl = URL.createObjectURL(file);
      setUploadedImageUrl(previewUrl);
      setSubmissionType('upload');
    }
  };

  const handleStartMatching = () => {
    setStep(4);
    setIsMatching(true);

    const faculty =
      tutors.find((t) => t.subjects.includes(subject)) || tutors[0];
    setMatchedFaculty(faculty);

    // After 2.5 seconds, matching completes
    setTimeout(() => {
      setIsMatching(false);
    }, 2500);
  };

  const handleConnectCall = () => {
    startDoubtSession({
      studentName,
      grade,
      board,
      subject,
      language,
      doubtType: submissionType === 'type' ? 'text' : 'upload',
      doubtText: typedDoubt,
      doubtImageUrl: uploadedImageUrl,
      mode: callMode,
      tutorId: matchedFaculty.id,
      tutorName: matchedFaculty.name,
      tutorPhoto: matchedFaculty.photoUrl,
      perMinuteRate: matchedFaculty.perMinuteRate || pricingConfig.baseDoubtPerMinute,
    });
    setCurrentPage('live-call');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full mb-3 border border-emerald-200">
          <MessageCircle className="w-3.5 h-3.5" />
          <span>DOUBT CLARITY PORTAL · TWO WAYS TO LEARN</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
          Have a Question? <br />
          <span className="text-emerald-600">Get Instant or Free Clarity.</span>
        </h1>
        <p className="mt-2 text-sm sm:text-base text-slate-600">
          Connect immediately with an expert over a live voice/video call, or post your question for free to our verified faculty community.
        </p>
      </div>

      {/* Two Prominent Tabs: Instant Expert vs Free Community */}
      <div className="flex items-center justify-center gap-2 max-w-md mx-auto p-1.5 bg-slate-100 rounded-2xl">
        <button
          type="button"
          onClick={() => setActiveDoubtTab('instant_expert')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
            activeDoubtTab === 'instant_expert'
              ? 'bg-white text-emerald-800 shadow-xs border border-slate-200'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Phone className="w-3.5 h-3.5 text-emerald-600" />
          <span>Instant Expert (Paid)</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveDoubtTab('free_community')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
            activeDoubtTab === 'free_community'
              ? 'bg-white text-blue-800 shadow-xs border border-slate-200'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Users className="w-3.5 h-3.5 text-blue-600" />
          <span>Ask Community (Free)</span>
        </button>
      </div>

      {/* CONDITIONAL TAB RENDER */}
      {activeDoubtTab === 'free_community' ? (
        <CommunityDoubtFeed />
      ) : (
        <div className="max-w-3xl mx-auto space-y-8">
          {/* Steps indicator for Instant Expert */}
          {step < 4 && (
            <div className="mb-8 max-w-md mx-auto">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-2">
                <span className={step >= 1 ? 'text-emerald-600 font-bold' : ''}>1. Student</span>
                <span className={step >= 2 ? 'text-emerald-600 font-bold' : ''}>2. Question</span>
                <span className={step >= 3 ? 'text-emerald-600 font-bold' : ''}>3. Mode</span>
                <span className={step === 4 ? 'text-emerald-600 font-bold' : ''}>4. Connect</span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-600 h-full transition-all duration-300"
                  style={{ width: `${((step - 1) / 3) * 100}%` }}
                ></div>
              </div>
            </div>
          )}

      {/* STEP 1: Student Information */}
      {step === 1 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6">
          <h2 className="text-xl font-bold text-slate-900">Step 1: Student Information</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Student Name *
              </label>
              <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="e.g. Aryan Malhotra"
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Subject with Doubt *
              </label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
              >
                {SUBJECTS_LIST.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Class / Grade *
              </label>
              <select
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
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
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
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
                Preferred Language *
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
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
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-lg flex items-center gap-2 cursor-pointer"
            >
              <span>Continue to Doubt Submission</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Submit the doubt */}
      {step === 2 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6">
          <h2 className="text-xl font-bold text-slate-900">Step 2: Submit Your Question</h2>

          {/* Selector: Option A vs Option B */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setSubmissionType('type')}
              className={`p-3 rounded-xl border text-left cursor-pointer transition-colors ${
                submissionType === 'type'
                  ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-semibold'
                  : 'border-slate-200 hover:border-slate-300 text-slate-700'
              }`}
            >
              <FileText className="w-5 h-5 text-emerald-600 mb-1" />
              <div className="text-xs font-bold">Option A: Type Your Question</div>
              <div className="text-[11px] text-slate-500 font-normal">Text editor & equations</div>
            </button>

            <button
              type="button"
              onClick={() => setSubmissionType('upload')}
              className={`p-3 rounded-xl border text-left cursor-pointer transition-colors ${
                submissionType === 'upload'
                  ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-semibold'
                  : 'border-slate-200 hover:border-slate-300 text-slate-700'
              }`}
            >
              <Upload className="w-5 h-5 text-emerald-600 mb-1" />
              <div className="text-xs font-bold">Option B: Upload a Question</div>
              <div className="text-[11px] text-slate-500 font-normal">Photo / image / PDF snapshot</div>
            </button>
          </div>

          {/* Form based on selected option */}
          {submissionType === 'type' ? (
            <div className="space-y-3">
              <label className="block text-xs font-semibold text-slate-700">
                Type question, topic or concept you do not understand *
              </label>
              <textarea
                rows={5}
                value={typedDoubt}
                onChange={(e) => setTypedDoubt(e.target.value)}
                placeholder="Write the exact problem, theorem, or question..."
                className="w-full px-3.5 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
              />

              {/* Sample high-yield questions */}
              <div>
                <span className="text-xs text-slate-500 block mb-1.5">Or try a sample question:</span>
                <div className="flex flex-wrap gap-1.5">
                  {SAMPLE_DOUBT_QUESTIONS.map((s, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectSample(s)}
                      className="text-[11px] px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 cursor-pointer"
                    >
                      {s.title}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <label className="block text-xs font-semibold text-slate-700">
                Upload Photograph or Image of the Problem *
              </label>

              <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:border-emerald-500 transition-colors">
                <input
                  type="file"
                  id="doubt-file"
                  accept="image/*"
                  onChange={handleMockImageUpload}
                  className="hidden"
                />
                <label
                  htmlFor="doubt-file"
                  className="cursor-pointer flex flex-col items-center justify-center space-y-2"
                >
                  <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <Camera className="w-6 h-6" />
                  </div>
                  <div className="text-xs font-semibold text-slate-800">
                    Click to capture or upload textbook / homework snapshot
                  </div>
                  <div className="text-[11px] text-slate-500">Supports PNG, JPG, or PDF snapshot</div>
                </label>
              </div>

              {/* Image Preview */}
              {uploadedImageUrl && (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <span className="text-xs font-semibold text-slate-700">Question Preview:</span>
                  <img
                    src={uploadedImageUrl}
                    alt="Question preview"
                    className="max-h-60 rounded-lg object-contain border border-slate-200 mx-auto"
                  />
                </div>
              )}
            </div>
          )}

          <div className="pt-4 flex items-center justify-between">
            <button
              onClick={() => setStep(1)}
              className="px-4 py-2 text-slate-600 hover:text-slate-900 font-medium text-sm flex items-center gap-1 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              onClick={() => {
                if (submissionType === 'type' && !typedDoubt.trim()) {
                  alert('Please type your question.');
                  return;
                }
                setStep(3);
              }}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-lg flex items-center gap-2 cursor-pointer"
            >
              <span>Choose Call Mode</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Choose connection mode */}
      {step === 3 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6">
          <h2 className="text-xl font-bold text-slate-900">Step 3: Choose Connection Mode</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Voice call */}
            <div
              onClick={() => setCallMode('voice')}
              className={`p-5 rounded-xl border-2 transition-all cursor-pointer relative ${
                callMode === 'voice'
                  ? 'border-emerald-600 bg-emerald-50/40'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <Phone className="w-5 h-5" />
                </div>
                {callMode === 'voice' && (
                  <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs">
                    ✓
                  </div>
                )}
              </div>
              <h3 className="font-bold text-slate-900 text-base">Voice Call</h3>
              <p className="text-xs text-slate-600 mt-1">
                Audio call with live synchronized interactive digital whiteboard for solving equations.
              </p>
              <div className="mt-3 text-[11px] text-emerald-800 font-mono font-semibold">
                Rate: ₹{pricingConfig.baseDoubtPerMinute}/minute
              </div>
            </div>

            {/* Video call */}
            <div
              onClick={() => setCallMode('video')}
              className={`p-5 rounded-xl border-2 transition-all cursor-pointer relative ${
                callMode === 'video'
                  ? 'border-emerald-600 bg-emerald-50/40'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                  <Video className="w-5 h-5" />
                </div>
                {callMode === 'video' && (
                  <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs">
                    ✓
                  </div>
                )}
              </div>
              <h3 className="font-bold text-slate-900 text-base">Video Call</h3>
              <p className="text-xs text-slate-600 mt-1">
                Face-to-face HD video with teacher + dual screen sharing and digital chalkboard.
              </p>
              <div className="mt-3 text-[11px] text-emerald-800 font-mono font-semibold">
                Rate: ₹{pricingConfig.baseDoubtPerMinute}/minute
              </div>
            </div>
          </div>

          {/* Billing disclosure note */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-2">
            <div className="font-bold text-slate-800 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Transparent Per-Minute Billing Architecture</span>
            </div>
            <ul className="list-disc pl-5 space-y-1 text-slate-600">
              <li>No waiting charge: You are never billed while waiting for teacher connection.</li>
              <li>Running meter: Real-time clock and cost display during the call.</li>
              <li>Minimum billing increment: 1 minute (billing stops the second call ends).</li>
              <li>Estimated 10-minute session cost: ₹{pricingConfig.baseDoubtPerMinute * 10}.</li>
            </ul>
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
              onClick={handleStartMatching}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-lg flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <Sparkles className="w-4 h-4" />
              <span>Connect to a Teacher</span>
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: Matching & Connection Card */}
      {step === 4 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6">
          {isMatching ? (
            <div className="text-center py-8 space-y-5">
              <div className="w-20 h-20 rounded-full bg-emerald-50 border-2 border-emerald-500 flex items-center justify-center mx-auto text-emerald-600">
                <Clock className="w-8 h-8 animate-spin" />
              </div>

              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  Connecting you with a subject expert...
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Matching with available {subject} faculty for {grade} ({board})
                </p>
              </div>

              <div className="inline-block bg-slate-50 px-4 py-2 rounded-lg border border-slate-200 text-xs text-slate-600">
                Mode: <span className="font-semibold capitalize text-slate-900">{callMode} Call</span> · Language: <span className="font-semibold text-slate-900">{language}</span>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-md border border-emerald-200 w-fit">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>SUBJECT EXPERT AVAILABLE & READY TO CALL</span>
              </div>

              <div className="flex items-center gap-4 pb-6 border-b border-slate-200">
                <img
                  src={sanitizeImageUrl(matchedFaculty.photoUrl, matchedFaculty.name)}
                  alt={matchedFaculty.name}
                  referrerPolicy="no-referrer"
                  onError={(e) => handleImageError(e, matchedFaculty.name)}
                  className="w-18 h-18 rounded-2xl object-cover border border-slate-200 shrink-0"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-lg font-bold text-slate-900">{matchedFaculty.name}</h3>
                    <ShieldCheck className="w-4 h-4 text-blue-600" />
                  </div>
                  <p className="text-xs text-slate-600">{matchedFaculty.qualifications}</p>
                  <p className="text-[11px] text-slate-400">{matchedFaculty.university}</p>
                  <div className="flex items-center gap-2 mt-1 text-xs">
                    <span className="font-semibold text-amber-600">★ {matchedFaculty.rating}</span>
                    <span>·</span>
                    <span className="text-slate-600">{matchedFaculty.experienceYears} Years Exp</span>
                    <span>·</span>
                    <span className="font-bold text-emerald-700 font-mono">
                      ₹{matchedFaculty.perMinuteRate}/min
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Question Topic:</span>
                  <span className="font-semibold text-slate-900">{subject}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Connection Mode:</span>
                  <span className="font-semibold text-slate-900 capitalize">{callMode} Call + Whiteboard</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Session Rate:</span>
                  <span className="font-mono font-bold text-emerald-700">₹{matchedFaculty.perMinuteRate}/minute</span>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                <button
                  onClick={() => setStep(3)}
                  className="px-4 py-2 text-slate-600 hover:text-slate-900 font-medium text-xs cursor-pointer"
                >
                  Change Settings
                </button>
                <button
                  onClick={handleConnectCall}
                  className="w-full sm:w-auto px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  {callMode === 'voice' ? <Phone className="w-4 h-4" /> : <Video className="w-4 h-4" />}
                  <span>Join Live Call Now</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )}
</div>
  );
};
