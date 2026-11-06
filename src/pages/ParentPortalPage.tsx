/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { GRADES_LIST, BOARDS_LIST } from '../data/mockData';
import { sanitizeImageUrl, handleImageError } from '../utils/imageUtils';
import {
  User,
  Users,
  Calendar,
  Clock,
  MessageCircle,
  Star,
  ShieldCheck,
  RotateCcw,
  Plus,
  BookOpen,
  MapPin,
  Video,
  FileText,
  CreditCard,
  ChevronRight,
} from 'lucide-react';

export const ParentPortalPage: React.FC = () => {
  const {
    parentAccount,
    addChildProfile,
    selectChildProfile,
    bookings,
    doubtSessions,
    tutors,
    savedTutorIds,
    toggleSaveTutor,
    setCurrentPage,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'sessions' | 'doubts' | 'saved_tutors' | 'children'>(
    'sessions'
  );
  const [isAddChildModalOpen, setIsAddChildModalOpen] = useState(false);

  // New child form
  const [newChildName, setNewChildName] = useState('');
  const [newChildAge, setNewChildAge] = useState(12);
  const [newChildGrade, setNewChildGrade] = useState('Grade 7');
  const [newChildBoard, setNewChildBoard] = useState('ICSE');
  const [newChildSchool, setNewChildSchool] = useState('');

  const selectedChild =
    parentAccount.children.find((c) => c.id === parentAccount.selectedChildId) ||
    parentAccount.children[0];

  const handleAddChild = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChildName.trim()) return;
    addChildProfile({
      name: newChildName,
      age: Number(newChildAge),
      grade: newChildGrade,
      board: newChildBoard,
      schoolName: newChildSchool,
    });
    setNewChildName('');
    setIsAddChildModalOpen(false);
  };

  const upcomingBookings = bookings.filter(
    (b) => b.status === 'confirmed' || b.status === 'tutor_accepted' || b.status === 'in_progress'
  );
  const pastBookings = bookings.filter(
    (b) => b.status === 'completed' || b.status === 'cancelled'
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
      {/* Account Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xs">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xl">
            {parentAccount.name.slice(0, 1)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900">{parentAccount.name}</h1>
              <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                Guardian Verified
              </span>
            </div>
            <div className="text-xs text-slate-500 mt-0.5">
              {parentAccount.email} · {parentAccount.phone}
            </div>
          </div>
        </div>

        {/* Child Selector pills */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-slate-500 font-medium mr-1">Active Student:</span>
          {parentAccount.children.map((child) => (
            <button
              key={child.id}
              onClick={() => selectChildProfile(child.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                parentAccount.selectedChildId === child.id
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {child.name} ({child.grade})
            </button>
          ))}
          <button
            onClick={() => setIsAddChildModalOpen(true)}
            className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-blue-600 hover:bg-blue-50 border border-blue-200 flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Child</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-xs font-semibold text-slate-600">
        <button
          onClick={() => setActiveTab('sessions')}
          className={`px-4 py-2 rounded-lg transition-colors cursor-pointer ${
            activeTab === 'sessions' ? 'bg-slate-900 text-white' : 'hover:text-slate-900'
          }`}
        >
          Tutoring Sessions ({bookings.length})
        </button>
        <button
          onClick={() => setActiveTab('doubts')}
          className={`px-4 py-2 rounded-lg transition-colors cursor-pointer ${
            activeTab === 'doubts' ? 'bg-slate-900 text-white' : 'hover:text-slate-900'
          }`}
        >
          Doubt Solver History ({doubtSessions.length})
        </button>
        <button
          onClick={() => setActiveTab('saved_tutors')}
          className={`px-4 py-2 rounded-lg transition-colors cursor-pointer ${
            activeTab === 'saved_tutors' ? 'bg-slate-900 text-white' : 'hover:text-slate-900'
          }`}
        >
          Saved Faculty ({savedTutorIds.length})
        </button>
        <button
          onClick={() => setActiveTab('children')}
          className={`px-4 py-2 rounded-lg transition-colors cursor-pointer ${
            activeTab === 'children' ? 'bg-slate-900 text-white' : 'hover:text-slate-900'
          }`}
        >
          Family & Safety Controls
        </button>
      </div>

      {/* TAB 1: SESSIONS */}
      {activeTab === 'sessions' && (
        <div className="space-y-8">
          {/* Upcoming Sessions */}
          <div className="space-y-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-600" />
              Upcoming & Confirmed Sessions
            </h2>

            {upcomingBookings.length === 0 ? (
              <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-xs text-slate-500">
                No active upcoming bookings. Request an instant tutor or schedule a session above.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {upcomingBookings.map((b) => (
                  <div
                    key={b.id}
                    className="bg-white rounded-2xl border-2 border-blue-500/80 p-5 space-y-4 shadow-xs flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-[10px] font-bold text-blue-800 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 uppercase tracking-wider">
                            {b.status.replace('_', ' ')}
                          </span>
                          <h3 className="font-bold text-slate-900 text-base mt-2">
                            {b.subject} with {b.tutorName}
                          </h3>
                          <div className="text-xs text-slate-500 mt-0.5">
                            For {b.studentName} ({b.grade})
                          </div>
                        </div>

                        {b.tutorPhoto && (
                          <img
                            src={sanitizeImageUrl(b.tutorPhoto, b.tutorName)}
                            alt={b.tutorName}
                            referrerPolicy="no-referrer"
                            onError={(e) => handleImageError(e, b.tutorName)}
                            className="w-14 h-14 rounded-xl object-cover border border-slate-200 shrink-0"
                          />
                        )}
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-600 space-y-1.5">
                        <div className="flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>
                            {b.scheduledDate
                              ? `${b.scheduledDate} · ${b.scheduledTimeSlot}`
                              : `Instant Dispatch · Arriving in ~${b.etaMinutes || 24} min`}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {b.format === 'offline' ? (
                            <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          ) : (
                            <Video className="w-3.5 h-3.5 text-slate-400" />
                          )}
                          <span>
                            {b.format === 'offline' ? `In-Home: ${b.address}` : 'Online Virtual Classroom'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="font-mono font-bold text-slate-900 text-sm">
                        ₹{b.totalAmount}
                      </span>
                      {b.format === 'online' ? (
                        <button
                          onClick={() => alert('Virtual Classroom link active. Joining session...')}
                          className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs cursor-pointer"
                        >
                          Join Virtual Room
                        </button>
                      ) : (
                        <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          Faculty Dispatched
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Past Sessions */}
          <div className="space-y-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-600" />
              Completed Sessions History
            </h2>

            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="p-3.5">Ref ID</th>
                      <th className="p-3.5">Student</th>
                      <th className="p-3.5">Subject & Teacher</th>
                      <th className="p-3.5">Format</th>
                      <th className="p-3.5">Date</th>
                      <th className="p-3.5">Amount</th>
                      <th className="p-3.5 text-right">Rebook</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {pastBookings.map((b) => (
                      <tr key={b.id} className="hover:bg-slate-50/70">
                        <td className="p-3.5 font-mono font-bold text-slate-800">{b.id}</td>
                        <td className="p-3.5">{b.studentName}</td>
                        <td className="p-3.5 font-medium text-slate-900">
                          {b.subject} with {b.tutorName}
                        </td>
                        <td className="p-3.5 capitalize">{b.format}</td>
                        <td className="p-3.5 text-slate-500">{b.createdAt}</td>
                        <td className="p-3.5 font-mono font-bold text-slate-900">₹{b.totalAmount}</td>
                        <td className="p-3.5 text-right">
                          <button
                            onClick={() => setCurrentPage('instant-tutor')}
                            className="px-3 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100 font-semibold rounded text-xs cursor-pointer inline-flex items-center gap-1"
                          >
                            <RotateCcw className="w-3 h-3" />
                            <span>Rebook</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: DOUBTS HISTORY */}
      {activeTab === 'doubts' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">
              Live Doubt-Solving Sessions & Saved Notes
            </h2>
            <button
              onClick={() => setCurrentPage('doubt-solver')}
              className="text-xs font-bold text-emerald-600 hover:text-emerald-700 cursor-pointer"
            >
              + Solve New Doubt
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {doubtSessions.map((d) => (
              <div
                key={d.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs text-slate-800">{d.id}</span>
                      <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        {d.subject} · {d.grade}
                      </span>
                    </div>
                    <div className="text-sm font-bold text-slate-900 mt-1">
                      Faculty: {d.tutorName}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-mono font-bold text-slate-900 text-base">₹{d.totalCost}</div>
                    <div className="text-[11px] text-slate-500 font-mono">
                      {Math.ceil(d.durationSeconds / 60)} min session
                    </div>
                  </div>
                </div>

                {d.doubtText && (
                  <div className="p-3 bg-slate-50 rounded-lg text-xs font-mono text-slate-700 border border-slate-200">
                    <span className="text-[10px] text-slate-400 block mb-0.5">Question asked:</span>
                    {d.doubtText}
                  </div>
                )}

                {d.studentNotes && (
                  <div className="p-3 bg-blue-50/60 rounded-lg text-xs font-mono text-blue-900 border border-blue-200">
                    <span className="text-[10px] text-blue-700 font-semibold block mb-0.5">
                      Saved Whiteboard Formula & Solution Notes:
                    </span>
                    {d.studentNotes}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: SAVED TUTORS */}
      {activeTab === 'saved_tutors' && (
        <div className="space-y-4">
          <h2 className="text-base font-bold text-slate-900">
            Favorite & Verified Family Tutors
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {tutors
              .filter((t) => savedTutorIds.includes(t.id))
              .map((tutor) => (
                <div
                  key={tutor.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center gap-3">
                      <img
                        src={sanitizeImageUrl(tutor.photoUrl, tutor.name)}
                        alt={tutor.name}
                        referrerPolicy="no-referrer"
                        onError={(e) => handleImageError(e, tutor.name)}
                        className="w-14 h-14 rounded-xl object-cover border border-slate-200"
                      />
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">{tutor.name}</h4>
                        <p className="text-xs text-slate-500">{tutor.qualifications}</p>
                        <div className="flex items-center gap-1 text-xs text-amber-500 font-bold mt-0.5">
                          <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-500" />
                          <span>{tutor.rating}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 text-xs text-slate-600">
                      <strong>Subjects:</strong> {tutor.subjects.join(', ')}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div className="font-mono font-bold text-slate-900 text-sm">
                      ₹{tutor.hourlyRate}/hr
                    </div>
                    <button
                      onClick={() => setCurrentPage('instant-tutor')}
                      className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs cursor-pointer"
                    >
                      Instant Rebook
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* TAB 4: FAMILY & SAFETY CONTROLS */}
      {activeTab === 'children' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            Children Profiles & Parental Safeguarding Policies
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {parentAccount.children.map((c) => (
              <div key={c.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-slate-900 text-sm">{c.name}</h3>
                  <span className="text-[11px] font-semibold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
                    {c.grade} ({c.board})
                  </span>
                </div>
                <p className="text-xs text-slate-600">Age: {c.age} Years</p>
                {c.schoolName && <p className="text-xs text-slate-500">School: {c.schoolName}</p>}
              </div>
            ))}
          </div>

          {/* Parental control switches */}
          <div className="pt-4 border-t border-slate-200 space-y-3 text-xs text-slate-700">
            <div className="font-bold text-slate-900">Active Safeguarding Protections</div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Mandatory Guardian Presence rule enforced for all home tutoring visits.</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Masked phone numbers: Tutors cannot see minor student personal phone numbers.</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Live session audio transcripts archived for 30 days for parent audit.</span>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Add Child */}
      {isAddChildModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleAddChild}
            className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4"
          >
            <h3 className="text-base font-bold text-slate-900">Add Child Profile</h3>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Child Full Name *
              </label>
              <input
                type="text"
                required
                value={newChildName}
                onChange={(e) => setNewChildName(e.target.value)}
                placeholder="e.g. Rohan Malhotra"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Age</label>
                <input
                  type="number"
                  min={5}
                  max={20}
                  value={newChildAge}
                  onChange={(e) => setNewChildAge(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Grade</label>
                <select
                  value={newChildGrade}
                  onChange={(e) => setNewChildGrade(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white"
                >
                  {GRADES_LIST.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Board</label>
              <select
                value={newChildBoard}
                onChange={(e) => setNewChildBoard(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white"
              >
                {BOARDS_LIST.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>

            <div className="pt-3 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsAddChildModalOpen(false)}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg cursor-pointer"
              >
                Save Child Profile
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
