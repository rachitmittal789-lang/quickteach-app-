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
} from '../data/mockData';
import { TeachingFormat } from '../types';
import {
  GraduationCap,
  ShieldCheck,
  CheckCircle,
  Upload,
  AlertTriangle,
  Award,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export const BecomeTutorPage: React.FC = () => {
  const { submitTutorApplication, setCurrentPage } = useApp();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [qualification, setQualification] = useState('M.Sc. Mathematics');
  const [university, setUniversity] = useState('St. Stephen’s College, Delhi');
  const [experienceYears, setExperienceYears] = useState(4);

  const [selectedSubjects, setSelectedSubjects] = useState<string[]>(['Mathematics', 'Physics']);
  const [selectedBoards, setSelectedBoards] = useState<string[]>(['CBSE', 'ICSE']);
  const [selectedClasses, setSelectedClasses] = useState<string[]>([
    'Grade 9',
    'Grade 10',
    'Grade 11',
    'Grade 12',
  ]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(['English', 'Hindi']);

  const [formatPreference, setFormatPreference] = useState<TeachingFormat>('both');
  const [citiesServiced, setCitiesServiced] = useState('South Delhi, Gurugram, Noida');
  const [expectedHourlyRate, setExpectedHourlyRate] = useState(800);

  const [idDocName, setIdDocName] = useState('Govt_Aadhaar_ID_FrontBack.pdf');
  const [degreeDocName, setDegreeDocName] = useState('Master_Degree_Transcript.pdf');
  const [childSafeguardingAccepted, setChildSafeguardingAccepted] = useState(false);

  const [isSubmitted, setIsSubmitted] = useState(false);

  const toggleItem = (list: string[], setList: (v: string[]) => void, item: string) => {
    if (list.includes(item)) {
      if (list.length > 1) {
        setList(list.filter((i) => i !== item));
      }
    } else {
      setList([...list, item]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !phone) {
      alert('Please fill out all mandatory contact details.');
      return;
    }
    if (!childSafeguardingAccepted) {
      alert('You must review and accept the Child Safeguarding & Code of Conduct.');
      return;
    }

    submitTutorApplication({
      fullName,
      email,
      phone,
      qualification,
      university,
      experienceYears: Number(experienceYears),
      subjects: selectedSubjects,
      boards: selectedBoards,
      classes: selectedClasses,
      languages: selectedLanguages,
      formatPreference,
      citiesServiced,
      expectedHourlyRate: Number(expectedHourlyRate),
      idDocumentName: idDocName,
      degreeDocumentName: degreeDocName,
      childSafeguardingAccepted,
    });

    setIsSubmitted(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Hero Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 bg-blue-50 px-3 py-1 rounded-full mb-3 border border-blue-200">
          <GraduationCap className="w-3.5 h-3.5" />
          <span>JOIN QUICKTEACH FACULTY NETWORK</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
          Teach With QuickTeach. <br />
          <span className="text-blue-600">Empower Ambitious Students.</span>
        </h1>
        <p className="mt-2 text-sm sm:text-base text-slate-600">
          Earn competitive hourly rates for doorstep and online tutoring, plus earn per-minute for live doubt-solving sessions.
        </p>
      </div>

      {isSubmitted ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-10 text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle className="w-8 h-8" />
          </div>

          <div>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              APPLICATION RECEIVED · UNDER ADMIN AUDIT
            </span>
            <h2 className="text-2xl font-bold text-slate-900 mt-2">
              Thank You, {fullName}!
            </h2>
            <p className="text-sm text-slate-600 mt-1 max-w-lg mx-auto">
              Your academic credentials and verification documents have been submitted to our verification team. In compliance with our child-safeguarding policy, public profiles are only activated after manual background clearance.
            </p>
          </div>

          <div className="max-w-md mx-auto bg-slate-50 p-4 rounded-xl border border-slate-200 text-left text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-500">Applicant:</span>
              <span className="font-semibold text-slate-900">{fullName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Qualifications:</span>
              <span className="font-semibold text-slate-900">{qualification}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Subjects:</span>
              <span className="font-semibold text-slate-900">{selectedSubjects.join(', ')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Audit Status:</span>
              <span className="font-semibold text-amber-600">Pending Review in Admin Console</span>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => setCurrentPage('admin')}
              className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl cursor-pointer"
            >
              Open Admin Console to Review / Approve Application →
            </button>
            <button
              onClick={() => setIsSubmitted(false)}
              className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl cursor-pointer"
            >
              Submit Another Application
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-8">
          {/* Section 1: Personal & Contact */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs flex items-center justify-center font-bold">1</span>
              Personal & Contact Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Legal Name *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Dr. Kavita Sharma"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="kavita@example.com"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Phone Number (WhatsApp Active) *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98110 00000"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Academic Qualifications */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs flex items-center justify-center font-bold">2</span>
              Academic Background & Experience
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Highest Degree & Specialization *
                </label>
                <input
                  type="text"
                  required
                  value={qualification}
                  onChange={(e) => setQualification(e.target.value)}
                  placeholder="e.g. M.Sc. Physics, B.Ed."
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  College / University *
                </label>
                <input
                  type="text"
                  required
                  value={university}
                  onChange={(e) => setUniversity(e.target.value)}
                  placeholder="e.g. IIT Delhi, Delhi University"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Years of Teaching Experience *
                </label>
                <input
                  type="number"
                  min={1}
                  max={40}
                  required
                  value={experienceYears}
                  onChange={(e) => setExperienceYears(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Subjects multi-select */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Subjects You Teach (Select all that apply)
              </label>
              <div className="flex flex-wrap gap-2">
                {SUBJECTS_LIST.map((subj) => {
                  const isSel = selectedSubjects.includes(subj);
                  return (
                    <button
                      key={subj}
                      type="button"
                      onClick={() => toggleItem(selectedSubjects, setSelectedSubjects, subj)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                        isSel
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {subj} {isSel && '✓'}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Boards multi-select */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Educational Boards Covered
              </label>
              <div className="flex flex-wrap gap-2">
                {BOARDS_LIST.map((b) => {
                  const isSel = selectedBoards.includes(b);
                  return (
                    <button
                      key={b}
                      type="button"
                      onClick={() => toggleItem(selectedBoards, setSelectedBoards, b)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                        isSel
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {b} {isSel && '✓'}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Section 3: Delivery Preferences & Rates */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs flex items-center justify-center font-bold">3</span>
              Teaching Format & Expected Hourly Charge
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Format Preference *
                </label>
                <select
                  value={formatPreference}
                  onChange={(e) => setFormatPreference(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="both">Both Home Tuition & Online</option>
                  <option value="online">Online Virtual Classroom Only</option>
                  <option value="offline">In-Home Doorstep Visits Only</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Cities / Localities Serviced
                </label>
                <input
                  type="text"
                  value={citiesServiced}
                  onChange={(e) => setCitiesServiced(e.target.value)}
                  placeholder="e.g. South Delhi, Gurgaon Sec 54"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Expected Hourly Fee (₹) *
                </label>
                <input
                  type="number"
                  min={300}
                  max={5000}
                  step={50}
                  value={expectedHourlyRate}
                  onChange={(e) => setExpectedHourlyRate(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Document Verification Uploads & Child Safeguarding */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs flex items-center justify-center font-bold">4</span>
              Verification Documents & Child Safety Compliance
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                  Government Identity Document (Aadhaar / Passport)
                </span>
                <p className="text-[11px] text-slate-500">
                  Required for identity screening and police verification certificate issuance.
                </p>
                <div className="flex items-center gap-2 text-xs font-mono text-slate-700 bg-white p-2 rounded border border-slate-200">
                  <Upload className="w-3.5 h-3.5 text-blue-600" />
                  <span>{idDocName}</span>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-blue-600" />
                  Degree Certificate / Academic Transcript
                </span>
                <p className="text-[11px] text-slate-500">
                  Required to authenticate subject qualification and grading credentials.
                </p>
                <div className="flex items-center gap-2 text-xs font-mono text-slate-700 bg-white p-2 rounded border border-slate-200">
                  <Upload className="w-3.5 h-3.5 text-blue-600" />
                  <span>{degreeDocName}</span>
                </div>
              </div>
            </div>

            {/* Child Safeguarding Agreement */}
            <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 text-xs text-slate-800 space-y-3">
              <div className="flex items-start gap-2.5">
                <input
                  type="checkbox"
                  id="safeguarding"
                  checked={childSafeguardingAccepted}
                  onChange={(e) => setChildSafeguardingAccepted(e.target.checked)}
                  className="mt-0.5 rounded text-blue-600 focus:ring-blue-500 cursor-pointer w-4 h-4"
                  required
                />
                <label htmlFor="safeguarding" className="cursor-pointer leading-relaxed text-slate-700">
                  <strong className="text-slate-900">Child Safeguarding & Safety Code: </strong>
                  I agree to undergo mandatory police background verification. For in-home tutoring involving minor students, I agree to conduct all sessions in a shared common room under parent/guardian presence, and will never solicit off-platform direct private contact with minor students.
                </label>
              </div>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-end">
            <button
              type="submit"
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl cursor-pointer shadow-sm transition-all"
            >
              Submit Application for Admin Review
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
