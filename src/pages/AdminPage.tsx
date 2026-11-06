/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BookingStatus } from '../types';
import {
  ShieldAlert,
  UserCheck,
  CreditCard,
  DollarSign,
  CheckCircle,
  XCircle,
  Clock,
  Layers,
  Settings,
  AlertTriangle,
  FileCheck,
  Search,
} from 'lucide-react';

export const AdminPage: React.FC = () => {
  const {
    tutorApplications,
    updateTutorApplicationStatus,
    bookings,
    updateBookingStatus,
    pricingConfig,
    updatePricingConfig,
    doubtSessions,
    tutors,
    updateTutor,
  } = useApp();

  const [activeTab, setActiveTab] = useState<
    'applications' | 'bookings' | 'pricing' | 'financials' | 'safety'
  >('applications');

  // Pricing edit form
  const [platformFee, setPlatformFee] = useState(pricingConfig.platformFeeFixed);
  const [gstPercent, setGstPercent] = useState(pricingConfig.gstPercent);
  const [baseDoubtRate, setBaseDoubtRate] = useState(pricingConfig.baseDoubtPerMinute);
  const [instantSurcharge, setInstantSurcharge] = useState(pricingConfig.instantMatchingSurcharge);
  const [pricingSavedToast, setPricingSavedToast] = useState(false);

  const handleSavePricing = (e: React.FormEvent) => {
    e.preventDefault();
    updatePricingConfig({
      platformFeeFixed: Number(platformFee),
      gstPercent: Number(gstPercent),
      baseDoubtPerMinute: Number(baseDoubtRate),
      instantMatchingSurcharge: Number(instantSurcharge),
    });
    setPricingSavedToast(true);
    setTimeout(() => setPricingSavedToast(false), 2500);
  };

  // Financial calculations
  const totalGrossBookings = bookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);
  const totalDoubtRevenue = doubtSessions.reduce((sum, d) => sum + (d.totalCost || 0), 0);
  const totalPlatformFees = bookings.reduce((sum, b) => sum + (b.platformFee || 49), 0);
  const totalTutorPayouts = totalGrossBookings - totalPlatformFees;

  const ALL_STATUSES: BookingStatus[] = [
    'new_request',
    'matching',
    'tutor_accepted',
    'payment_pending',
    'confirmed',
    'in_progress',
    'completed',
    'cancelled',
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Administration & Safety Operations
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-1">
            QuickTeach Management Console
          </h1>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl overflow-x-auto text-xs font-semibold text-slate-600">
          <button
            onClick={() => setActiveTab('applications')}
            className={`px-3 py-2 rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'applications' ? 'bg-white text-slate-900 shadow-xs' : 'hover:text-slate-900'
            }`}
          >
            Tutor Verification ({tutorApplications.filter((a) => a.status === 'pending').length})
          </button>
          <button
            onClick={() => setActiveTab('bookings')}
            className={`px-3 py-2 rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'bookings' ? 'bg-white text-slate-900 shadow-xs' : 'hover:text-slate-900'
            }`}
          >
            Bookings ({bookings.length})
          </button>
          <button
            onClick={() => setActiveTab('pricing')}
            className={`px-3 py-2 rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'pricing' ? 'bg-white text-slate-900 shadow-xs' : 'hover:text-slate-900'
            }`}
          >
            Pricing Architecture
          </button>
          <button
            onClick={() => setActiveTab('financials')}
            className={`px-3 py-2 rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'financials' ? 'bg-white text-slate-900 shadow-xs' : 'hover:text-slate-900'
            }`}
          >
            Revenue & Payouts
          </button>
          <button
            onClick={() => setActiveTab('safety')}
            className={`px-3 py-2 rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'safety' ? 'bg-white text-slate-900 shadow-xs' : 'hover:text-slate-900'
            }`}
          >
            Safety Logs
          </button>
        </div>
      </div>

      {/* TAB 1: TUTOR APPLICATIONS AUDIT */}
      {activeTab === 'applications' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">
              Faculty Registration Review Queue
            </h2>
            <span className="text-xs text-slate-500">
              Rule: No tutor is published publicly without manual admin verification.
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {tutorApplications.map((app) => (
              <div
                key={app.id}
                className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <h3 className="font-bold text-slate-900 text-base">{app.fullName}</h3>
                    <span
                      className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                        app.status === 'pending'
                          ? 'bg-amber-100 text-amber-800'
                          : app.status === 'approved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {app.status}
                    </span>
                  </div>

                  <div className="text-xs text-slate-600 flex flex-wrap items-center gap-3">
                    <span>Email: <strong className="text-slate-800">{app.email}</strong></span>
                    <span>·</span>
                    <span>Phone: <strong className="text-slate-800 font-mono">{app.phone}</strong></span>
                    <span>·</span>
                    <span>Submitted: <strong className="text-slate-800">{app.submittedAt}</strong></span>
                  </div>

                  <div className="text-xs text-slate-700 space-y-1 pt-1">
                    <div>
                      <strong>Degree & University:</strong> {app.qualification} ({app.university}) · {app.experienceYears} Years Exp
                    </div>
                    <div>
                      <strong>Subjects:</strong> {app.subjects.join(', ')} · <strong>Boards:</strong> {app.boards.join(', ')}
                    </div>
                    <div>
                      <strong>Requested Rate:</strong> ₹{app.expectedHourlyRate}/hr · <strong>Format:</strong> {app.formatPreference}
                    </div>
                  </div>

                  {/* Documents verified strip */}
                  <div className="flex items-center gap-3 pt-2 text-xs">
                    <div className="flex items-center gap-1.5 text-blue-700 bg-blue-50 px-2.5 py-1 rounded border border-blue-200">
                      <FileCheck className="w-3.5 h-3.5" />
                      <span>{app.idDocumentName}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-blue-700 bg-blue-50 px-2.5 py-1 rounded border border-blue-200">
                      <FileCheck className="w-3.5 h-3.5" />
                      <span>{app.degreeDocumentName}</span>
                    </div>
                  </div>
                </div>

                {/* Approval buttons */}
                {app.status === 'pending' ? (
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => updateTutorApplicationStatus(app.id, 'rejected')}
                      className="px-4 py-2 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-semibold cursor-pointer"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => updateTutorApplicationStatus(app.id, 'approved')}
                      className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold cursor-pointer shadow-xs"
                    >
                      Verify & Activate Tutor
                    </button>
                  </div>
                ) : (
                  <div className="text-xs text-slate-500 font-medium shrink-0">
                    Decision Recorded ({app.status})
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: BOOKINGS DISPATCH MANAGEMENT */}
      {activeTab === 'bookings' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">
              Active & Past Booking Records
            </h2>
            <span className="text-xs text-slate-500">
              Update dispatch workflow state dynamically
            </span>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="p-3.5">Booking ID</th>
                    <th className="p-3.5">Student / Grade</th>
                    <th className="p-3.5">Service & Mode</th>
                    <th className="p-3.5">Assigned Faculty</th>
                    <th className="p-3.5">Date & Slot</th>
                    <th className="p-3.5">Total (₹)</th>
                    <th className="p-3.5">Current Status</th>
                    <th className="p-3.5 text-right">Update Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {bookings.map((b) => (
                    <tr key={b.id} className="hover:bg-slate-50/70">
                      <td className="p-3.5 font-mono font-bold text-slate-900">{b.id}</td>
                      <td className="p-3.5">
                        <div className="font-semibold text-slate-900">{b.studentName}</div>
                        <div className="text-slate-500">{b.grade} · {b.board}</div>
                      </td>
                      <td className="p-3.5">
                        <span className="font-semibold capitalize text-slate-800">
                          {b.serviceType} ({b.subject})
                        </span>
                        <div className="text-slate-500 capitalize">
                          {b.format === 'offline' ? 'In-Home Visit' : 'Online Classroom'}
                        </div>
                      </td>
                      <td className="p-3.5 font-medium text-slate-800">{b.tutorName || 'Searching'}</td>
                      <td className="p-3.5 text-slate-600">
                        {b.scheduledDate ? `${b.scheduledDate} (${b.scheduledTimeSlot})` : 'Instant ASAP'}
                      </td>
                      <td className="p-3.5 font-mono font-bold text-slate-900 tabular-nums">
                        ₹{b.totalAmount}
                      </td>
                      <td className="p-3.5">
                        <span
                          className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                            b.status === 'confirmed' || b.status === 'tutor_accepted'
                              ? 'bg-blue-100 text-blue-800'
                              : b.status === 'completed'
                              ? 'bg-emerald-100 text-emerald-800'
                              : b.status === 'in_progress'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-slate-100 text-slate-800'
                          }`}
                        >
                          {b.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="p-3.5 text-right">
                        <select
                          value={b.status}
                          onChange={(e) => updateBookingStatus(b.id, e.target.value as BookingStatus)}
                          className="px-2 py-1 rounded border border-slate-300 text-xs bg-white text-slate-700 cursor-pointer"
                        >
                          {ALL_STATUSES.map((st) => (
                            <option key={st} value={st}>
                              {st.replace('_', ' ')}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: CENTRAL PRICING CONFIGURATION */}
      {activeTab === 'pricing' && (
        <div className="space-y-6">
          <div className="max-w-3xl bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Central Platform Pricing Architecture
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Adjust platform commission, taxes, and doubt-solver per-minute pricing across the entire application in real-time.
              </p>
            </div>

            <form onSubmit={handleSavePricing} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    QuickTeach Platform Booking Fee (₹ Fixed)
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={500}
                    value={platformFee}
                    onChange={(e) => setPlatformFee(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm font-mono"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">E.g. ₹30 default transparent platform fee</p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Instant Matching Dispatch Surcharge (₹)
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={500}
                    value={instantSurcharge}
                    onChange={(e) => setInstantSurcharge(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm font-mono"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">Set to 0 for zero-surcharge transparent pricing</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Base Doubt Solver Rate (₹ / Minute)
                  </label>
                  <input
                    type="number"
                    min={5}
                    max={100}
                    value={baseDoubtRate}
                    onChange={(e) => setBaseDoubtRate(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Applicable GST (%)
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={28}
                    value={gstPercent}
                    onChange={(e) => setGstPercent(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm font-mono"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">0% before optional government taxes</p>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between">
                {pricingSavedToast ? (
                  <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                    <CheckCircle className="w-4 h-4" />
                    Central platform fee configuration saved and published!
                  </span>
                ) : (
                  <span className="text-xs text-slate-500">Applies globally across all booking calculators.</span>
                )}

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl cursor-pointer"
                >
                  Save Configuration
                </button>
              </div>
            </form>
          </div>

          {/* Standard Parent-Facing Tier Reference */}
          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6">
            <h3 className="text-sm font-bold text-slate-900 mb-2">
              Proposed Standard School-Level Rate Structure
            </h3>
            <p className="text-xs text-slate-600 mb-4">
              Standard pricing benchmarks designed to keep offline home tutoring transparent and affordable for parents:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <div className="font-semibold text-slate-700">Junior / General School Tutor</div>
                <div className="text-lg font-bold font-mono text-emerald-600 mt-0.5">₹400 / hr</div>
                <div className="text-[11px] text-slate-400 mt-1">Foundational grades (1–8) & homework support</div>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <div className="font-semibold text-slate-700">Standard Subject Specialist</div>
                <div className="text-lg font-bold font-mono text-blue-600 mt-0.5">₹450 / hr</div>
                <div className="text-[11px] text-slate-400 mt-1">Secondary (9–10) board core sciences & maths</div>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <div className="font-semibold text-slate-700">Experienced School Faculty</div>
                <div className="text-lg font-bold font-mono text-indigo-600 mt-0.5">₹500 / hr</div>
                <div className="text-[11px] text-slate-400 mt-1">Senior secondary (11–12) & board exam evaluations</div>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <div className="font-semibold text-slate-700">Higher Specialist Faculty</div>
                <div className="text-lg font-bold font-mono text-purple-600 mt-0.5">Custom Quotation</div>
                <div className="text-[11px] text-slate-400 mt-1">International Baccalaureate (IB) & Olympiads</div>
              </div>
            </div>
          </div>

          {/* Editable Faculty Hourly Rates Table */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Individual Faculty Hourly Rates & Availability Roster
                </h3>
                <p className="text-xs text-slate-500">
                  Edit each teacher's exact parent-facing rate, estimated arrival time, and live instant availability toggle.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-600 font-semibold">
                    <th className="p-3">Faculty</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Hourly Rate (₹/hr)</th>
                    <th className="p-3">ETA (Mins)</th>
                    <th className="p-3">Instant Status</th>
                    <th className="p-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {tutors.map((t) => (
                    <tr key={t.id} className="hover:bg-slate-50/60">
                      <td className="p-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={t.photoUrl}
                            alt={t.name}
                            referrerPolicy="no-referrer"
                            className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0"
                          />
                          <div>
                            <div className="font-bold text-slate-900">{t.name}</div>
                            <div className="text-[11px] text-slate-500">{t.qualifications}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-3">
                        <span className="text-[11px] font-medium text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                          {t.category || 'Standard Subject Specialist'}
                        </span>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-1">
                          <span className="text-slate-400">₹</span>
                          <input
                            type="number"
                            min={200}
                            max={2000}
                            step={10}
                            defaultValue={t.hourlyRate}
                            id={`rate-input-${t.id}`}
                            className="w-20 px-2 py-1 rounded border border-slate-300 font-mono font-bold text-slate-900 text-xs"
                          />
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            min={5}
                            max={120}
                            defaultValue={t.etaMinutes || 30}
                            id={`eta-input-${t.id}`}
                            className="w-16 px-2 py-1 rounded border border-slate-300 font-mono text-slate-900 text-xs"
                          />
                          <span className="text-slate-400 text-[11px]">min</span>
                        </div>
                      </td>
                      <td className="p-3">
                        <button
                          type="button"
                          onClick={() => {
                            const newStatus = t.isAvailableNow === false ? true : false;
                            updateTutor(t.id, { isAvailableNow: newStatus });
                          }}
                          className={`px-2.5 py-1 rounded-full text-[11px] font-bold cursor-pointer transition-colors ${
                            t.isAvailableNow !== false
                              ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                              : 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                          }`}
                        >
                          {t.isAvailableNow !== false ? '● Available Live' : '○ Busy / Off-Duty'}
                        </button>
                      </td>
                      <td className="p-3 text-right">
                        <button
                          type="button"
                          onClick={() => {
                            const rateEl = document.getElementById(`rate-input-${t.id}`) as HTMLInputElement;
                            const etaEl = document.getElementById(`eta-input-${t.id}`) as HTMLInputElement;
                            const newRate = rateEl ? Number(rateEl.value) : t.hourlyRate;
                            const newEta = etaEl ? Number(etaEl.value) : (t.etaMinutes || 30);
                            updateTutor(t.id, {
                              hourlyRate: newRate,
                              etaMinutes: newEta,
                            });
                            alert(`Updated ${t.name}'s rate to ₹${newRate}/hr, ETA ${newEta} mins!`);
                          }}
                          className="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded text-[11px] font-medium transition-colors cursor-pointer"
                        >
                          Update
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: REVENUE & PAYOUTS */}
      {activeTab === 'financials' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="p-5 bg-white rounded-2xl border border-slate-200">
              <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
                Gross Bookings
              </span>
              <div className="text-2xl font-bold font-mono text-slate-900 mt-1 tabular-nums">
                ₹{totalGrossBookings}
              </div>
              <span className="text-[11px] text-slate-400">Total authorized value</span>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-slate-200">
              <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
                Platform Fees
              </span>
              <div className="text-2xl font-bold font-mono text-blue-600 mt-1 tabular-nums">
                ₹{totalPlatformFees}
              </div>
              <span className="text-[11px] text-slate-400">Retained revenue</span>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-slate-200">
              <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
                Tutor Payouts
              </span>
              <div className="text-2xl font-bold font-mono text-emerald-600 mt-1 tabular-nums">
                ₹{totalTutorPayouts}
              </div>
              <span className="text-[11px] text-slate-400">Disbursed to verified teachers</span>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-slate-200">
              <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
                Doubt Solver GMV
              </span>
              <div className="text-2xl font-bold font-mono text-indigo-600 mt-1 tabular-nums">
                ₹{totalDoubtRevenue}
              </div>
              <span className="text-[11px] text-slate-400">Live per-minute revenue</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: SAFETY & INCIDENT LOGS */}
      {activeTab === 'safety' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-emerald-600" />
            Child Safeguarding & Session Safety Audit Trail
          </h2>

          <div className="space-y-3 text-xs">
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-start gap-3">
              <CheckCircle className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
              <div>
                <strong className="text-emerald-950">Aadhaar & Police Clearance Verified:</strong>
                <p className="text-emerald-800 mt-0.5">
                  Dr. Priya Sharma background check re-certified for South Delhi home tuition zones. Zero infractions.
                </p>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-3">
              <Clock className="w-4 h-4 text-slate-500 mt-0.5 shrink-0" />
              <div>
                <strong className="text-slate-900">Live Session Audio Audit Passed:</strong>
                <p className="text-slate-600 mt-0.5">
                  Session QT-DB-301 between Aryan Malhotra and Rahul Verma reviewed for conduct compliance. Full academic focus maintained.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
