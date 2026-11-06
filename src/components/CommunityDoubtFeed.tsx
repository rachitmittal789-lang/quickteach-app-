/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CommunityQuestion } from '../types';
import {
  MessageSquare,
  Users,
  ShieldCheck,
  CheckCircle,
  ThumbsUp,
  Clock,
  Send,
  AlertTriangle,
  Upload,
  Camera,
  Filter,
  Check,
  Search,
  MessageCircle,
  Sparkles,
  Award,
  ChevronDown,
  ChevronUp,
  FileText,
} from 'lucide-react';

export const CommunityDoubtFeed: React.FC = () => {
  const {
    communityQuestions,
    askCommunityQuestion,
    answerCommunityQuestion,
    addCommunityFollowUp,
    upvoteQuestion,
    parentAccount,
  } = useApp();

  const [activeSubView, setActiveSubView] = useState<
    'browse' | 'ask' | 'my_questions' | 'faculty_console'
  >('browse');

  // Filters
  const [filterSubject, setFilterSubject] = useState<string>('All');
  const [filterClass, setFilterClass] = useState<string>('All');
  const [filterBoard, setFilterBoard] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Selected Question for expanded discussion view
  const [expandedQuestionId, setExpandedQuestionId] = useState<string | null>('CQ-101');

  // Ask Question Form
  const [askStudentName, setAskStudentName] = useState('Aryan_M10');
  const [askClass, setAskClass] = useState('Grade 10');
  const [askBoard, setAskBoard] = useState('CBSE');
  const [askSubject, setAskSubject] = useState('Mathematics');
  const [askChapter, setAskChapter] = useState('Quadratic Equations');
  const [askQuestionText, setAskQuestionText] = useState('');
  const [askImageUrl, setAskImageUrl] = useState<string>('');
  const [postConfirmation, setPostConfirmation] = useState<boolean>(false);

  // Faculty Answer Form (for Faculty Console)
  const [answeringQuestionId, setAnsweringQuestionId] = useState<string | null>(null);
  const [facultyName, setFacultyName] = useState('Dr. Priya Sharma');
  const [facultyDesignation, setFacultyDesignation] = useState('Verified Senior Science & Math Faculty');
  const [facultyExplanation, setFacultyExplanation] = useState('');
  const [facultyExample, setFacultyExample] = useState('');
  const [facultyConclusion, setFacultyConclusion] = useState('');

  // Follow-up input state per question
  const [followUpText, setFollowUpText] = useState<{ [qId: string]: string }>({});

  const SUBJECTS_FILTER = [
    'All',
    'Mathematics',
    'Physics',
    'Chemistry',
    'Biology',
    'English',
    'Economics',
    'Computer Science',
  ];

  const filteredQuestions = communityQuestions.filter((q) => {
    if (filterSubject !== 'All' && q.subject !== filterSubject) return false;
    if (filterClass !== 'All') {
      if (filterClass === 'Class 6–8' && !['Grade 6', 'Grade 7', 'Grade 8'].includes(q.grade)) return false;
      if (filterClass === 'Class 9–10' && !['Grade 9', 'Grade 10'].includes(q.grade)) return false;
      if (filterClass === 'Class 11–12' && !['Grade 11', 'Grade 12'].includes(q.grade)) return false;
    }
    if (filterBoard !== 'All' && q.board !== filterBoard) return false;
    if (searchQuery.trim()) {
      const qText = `${q.questionText} ${q.chapter} ${q.subject}`.toLowerCase();
      if (!qText.includes(searchQuery.toLowerCase())) return false;
    }
    return true;
  });

  const handleMockImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setAskImageUrl(URL.createObjectURL(file));
    }
  };

  const handlePostQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!askQuestionText.trim()) {
      alert('Please enter your question details.');
      return;
    }

    askCommunityQuestion({
      studentDisplayName: askStudentName || 'Anonymous_Student',
      grade: askClass,
      board: askBoard,
      subject: askSubject,
      chapter: askChapter,
      questionText: askQuestionText,
      questionImageUrl: askImageUrl,
      hasAttachment: !!askImageUrl,
    });

    setPostConfirmation(true);
    setAskQuestionText('');
    setAskImageUrl('');
  };

  const handleSubmitFacultyAnswer = (qId: string) => {
    if (!facultyExplanation.trim()) {
      alert('Please provide an explanation.');
      return;
    }

    answerCommunityQuestion(qId, {
      facultyName,
      facultyDesignation,
      isVerifiedFaculty: true,
      answerExplanation: facultyExplanation,
      example: facultyExample || undefined,
      conclusion: facultyConclusion || undefined,
    });

    setAnsweringQuestionId(null);
    setFacultyExplanation('');
    setFacultyExample('');
    setFacultyConclusion('');
    setExpandedQuestionId(qId);
  };

  const handleSendFollowUp = (qId: string, answerId: string) => {
    const text = followUpText[qId];
    if (!text || !text.trim()) return;

    addCommunityFollowUp(qId, answerId, text, askStudentName || 'Student', false);
    setFollowUpText({ ...followUpText, [qId]: '' });
  };

  return (
    <div className="space-y-6">
      {/* Community Sub-Navigation Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-1.5 bg-slate-100 rounded-xl text-xs font-semibold text-slate-600">
        <div className="flex items-center gap-1 overflow-x-auto">
          <button
            onClick={() => setActiveSubView('browse')}
            className={`px-3.5 py-2 rounded-lg cursor-pointer transition-colors whitespace-nowrap ${
              activeSubView === 'browse' ? 'bg-white text-slate-900 shadow-xs' : 'hover:text-slate-900'
            }`}
          >
            Browse Questions ({communityQuestions.length})
          </button>
          <button
            onClick={() => {
              setActiveSubView('ask');
              setPostConfirmation(false);
            }}
            className={`px-3.5 py-2 rounded-lg cursor-pointer transition-colors whitespace-nowrap flex items-center gap-1 ${
              activeSubView === 'ask' ? 'bg-white text-emerald-700 shadow-xs' : 'hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Ask a Free Question</span>
          </button>
          <button
            onClick={() => setActiveSubView('my_questions')}
            className={`px-3.5 py-2 rounded-lg cursor-pointer transition-colors whitespace-nowrap ${
              activeSubView === 'my_questions' ? 'bg-white text-slate-900 shadow-xs' : 'hover:text-slate-900'
            }`}
          >
            My Asked Questions
          </button>
        </div>

        <button
          onClick={() => setActiveSubView('faculty_console')}
          className={`px-3 py-1.5 rounded-lg border text-xs cursor-pointer transition-colors self-start sm:self-auto ${
            activeSubView === 'faculty_console'
              ? 'bg-emerald-600 text-white border-emerald-600'
              : 'border-slate-300 text-slate-700 hover:bg-slate-200'
          }`}
        >
          Faculty Answering Console ({communityQuestions.filter((q) => q.status === 'new').length} Pending)
        </button>
      </div>

      {/* VIEW: ASK A FREE QUESTION FORM */}
      {activeSubView === 'ask' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="border-b border-slate-100 pb-3">
            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200 uppercase tracking-wider">
              100% FREE ACADEMIC DOUBT POSTING
            </span>
            <h2 className="text-xl font-bold text-slate-900 mt-1">
              Ask Our Verified Faculty Community
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Post your doubt and receive an authoritative, step-by-step written explanation from a verified teacher.
            </p>
          </div>

          {postConfirmation ? (
            <div className="p-6 bg-emerald-50/80 rounded-xl border border-emerald-200 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <Check className="w-6 h-6 stroke-[3]" />
              </div>
              <h3 className="text-base font-bold text-emerald-950">
                Question Submitted to Faculty Community!
              </h3>
              <p className="text-xs text-emerald-800 max-w-md mx-auto">
                <strong>Typical faculty response: 4–12 hours.</strong> <br />
                <span className="text-[11px] text-emerald-700">
                  (Note: This is an expected average response window, not a guaranteed response time. You will receive an instant notification when answered.)
                </span>
              </p>
              <div className="pt-2 flex justify-center gap-3">
                <button
                  onClick={() => setActiveSubView('browse')}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-lg cursor-pointer"
                >
                  View Community Feed
                </button>
                <button
                  onClick={() => setPostConfirmation(false)}
                  className="px-4 py-2 bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 font-semibold text-xs rounded-lg cursor-pointer"
                >
                  Ask Another Question
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handlePostQuestion} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Student Display Name (Anonymous to peers) *
                  </label>
                  <input
                    type="text"
                    required
                    value={askStudentName}
                    onChange={(e) => setAskStudentName(e.target.value)}
                    placeholder="e.g. ScienceSeeker10"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Class / Grade *
                  </label>
                  <select
                    value={askClass}
                    onChange={(e) => setAskClass(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white"
                  >
                    <option value="Grade 6">Grade 6</option>
                    <option value="Grade 7">Grade 7</option>
                    <option value="Grade 8">Grade 8</option>
                    <option value="Grade 9">Grade 9</option>
                    <option value="Grade 10">Grade 10</option>
                    <option value="Grade 11">Grade 11</option>
                    <option value="Grade 12">Grade 12</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Educational Board *
                  </label>
                  <select
                    value={askBoard}
                    onChange={(e) => setAskBoard(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white"
                  >
                    <option value="CBSE">CBSE</option>
                    <option value="ICSE">ICSE</option>
                    <option value="IB">IB</option>
                    <option value="IGCSE">IGCSE</option>
                    <option value="State Board">State Board</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Subject *
                  </label>
                  <select
                    value={askSubject}
                    onChange={(e) => setAskSubject(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white"
                  >
                    {SUBJECTS_FILTER.filter((s) => s !== 'All').map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Chapter / Topic *
                  </label>
                  <input
                    type="text"
                    required
                    value={askChapter}
                    onChange={(e) => setAskChapter(e.target.value)}
                    placeholder="e.g. Motion in a Straight Line / Acids & Bases"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Type Your Academic Question or Describe the Doubt *
                </label>
                <textarea
                  rows={4}
                  required
                  value={askQuestionText}
                  onChange={(e) => setAskQuestionText(e.target.value)}
                  placeholder="State the problem clearly. Mention which step you are stuck on..."
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs font-mono leading-relaxed focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Optional Photo upload */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Attach Photograph / Question Snapshot (Optional)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="file"
                    id="free-doubt-file"
                    accept="image/*"
                    onChange={handleMockImageUpload}
                    className="hidden"
                  />
                  <label
                    htmlFor="free-doubt-file"
                    className="px-3.5 py-2 rounded-lg border border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-medium cursor-pointer flex items-center gap-1.5"
                  >
                    <Camera className="w-4 h-4 text-emerald-600" />
                    <span>Upload Textbook Photo / Diagram</span>
                  </label>
                  {askImageUrl && (
                    <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" />
                      Image Attached
                    </span>
                  )}
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <div className="text-[11px] text-slate-500">
                  🔒 Safe community: No personal phone numbers or off-platform contact allowed.
                </div>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer transition-colors"
                >
                  Post My Question — Free
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* VIEW: FACULTY ANSWERING CONSOLE */}
      {activeSubView === 'faculty_console' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <span className="text-[10px] font-bold text-blue-800 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 uppercase tracking-wider">
                TEACHER DASHBOARD
              </span>
              <h2 className="text-xl font-bold text-slate-900 mt-1">
                Faculty Community Answering Station
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Review pending student questions, claim a topic, and submit comprehensive explanations.
              </p>
            </div>
            <div className="text-right text-xs">
              <span className="text-slate-400">Acting as Faculty:</span>
              <div className="font-bold text-slate-900">{facultyName}</div>
            </div>
          </div>

          <div className="space-y-4">
            {communityQuestions
              .filter((q) => q.status === 'new' || q.status === 'assigned')
              .map((q) => (
                <div
                  key={q.id}
                  className="p-5 rounded-xl border-2 border-slate-200 bg-slate-50/70 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs text-slate-900">{q.id}</span>
                      <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                        {q.subject} · {q.grade} ({q.board})
                      </span>
                      <span className="text-xs text-slate-500">Chapter: {q.chapter}</span>
                    </div>
                    <span className="text-[11px] font-bold uppercase text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                      Awaiting Faculty Answer
                    </span>
                  </div>

                  <p className="text-xs font-mono text-slate-800 bg-white p-3 rounded-lg border border-slate-200">
                    "{q.questionText}"
                  </p>

                  {answeringQuestionId === q.id ? (
                    <div className="p-4 bg-white rounded-xl border border-emerald-300 space-y-3 pt-3">
                      <h4 className="text-xs font-bold text-emerald-950">
                        Drafting Verified Answer for Question {q.id}
                      </h4>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                          Core Step-by-Step Explanation *
                        </label>
                        <textarea
                          rows={4}
                          value={facultyExplanation}
                          onChange={(e) => setFacultyExplanation(e.target.value)}
                          placeholder="Provide the conceptual foundation and formula derivation..."
                          className="w-full p-2.5 text-xs rounded border border-slate-300 font-mono"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                            Worked Numerical Example / Proof (Optional)
                          </label>
                          <textarea
                            rows={2}
                            value={facultyExample}
                            onChange={(e) => setFacultyExample(e.target.value)}
                            placeholder="e.g. Let initial velocity u = 19.6 m/s..."
                            className="w-full p-2 text-xs rounded border border-slate-300 font-mono"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                            Final Conclusion / Key Takeaway *
                          </label>
                          <textarea
                            rows={2}
                            value={facultyConclusion}
                            onChange={(e) => setFacultyConclusion(e.target.value)}
                            placeholder="e.g. Conclusion: Velocity is momentarily zero but g is active..."
                            className="w-full p-2 text-xs rounded border border-slate-300 font-mono"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => setAnsweringQuestionId(null)}
                          className="px-3 py-1.5 rounded text-xs text-slate-600 hover:bg-slate-100"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSubmitFacultyAnswer(q.id)}
                          className="px-4 py-1.5 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
                        >
                          Submit Verified Faculty Answer
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-end">
                      <button
                        onClick={() => {
                          setAnsweringQuestionId(q.id);
                          if (q.id === 'CQ-102') {
                            setFacultyExplanation(
                              'To factorise 2x² - 5x + 3 = 0, multiply the coefficient of x² (2) and constant term (3) which equals +6. Find two factors of +6 whose sum equals -5. The factors are -2 and -3.\nSplit middle term: 2x² - 2x - 3x + 3 = 0\nFactor by grouping: 2x(x - 1) - 3(x - 1) = 0\n(2x - 3)(x - 1) = 0\nRoots: x = 3/2 or x = 1.'
                            );
                            setFacultyExample('Verification: Plug x = 1 -> 2(1)² - 5(1) + 3 = 2 - 5 + 3 = 0 (Matches).');
                            setFacultyConclusion('Conclusion: The two roots of the quadratic equation are x = 1.5 and x = 1.');
                          }
                        }}
                        className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs cursor-pointer"
                      >
                        Claim & Answer This Question →
                      </button>
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>
      )}

      {/* VIEW: BROWSE QUESTIONS FEED */}
      {(activeSubView === 'browse' || activeSubView === 'my_questions') && (
        <div className="space-y-6">
          {/* Filters Bar */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search questions by keyword, topic or chapter..."
                  className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs"
                />
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={filterClass}
                  onChange={(e) => setFilterClass(e.target.value)}
                  className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs bg-white text-slate-700"
                >
                  <option value="All">All Classes</option>
                  <option value="Class 6–8">Class 6–8</option>
                  <option value="Class 9–10">Class 9–10</option>
                  <option value="Class 11–12">Class 11–12</option>
                </select>

                <select
                  value={filterBoard}
                  onChange={(e) => setFilterBoard(e.target.value)}
                  className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs bg-white text-slate-700"
                >
                  <option value="All">All Boards</option>
                  <option value="CBSE">CBSE</option>
                  <option value="ICSE">ICSE</option>
                  <option value="IB">IB</option>
                  <option value="IGCSE">IGCSE</option>
                </select>
              </div>
            </div>

            {/* Subject horizontal filter strip */}
            <div className="flex items-center gap-1.5 overflow-x-auto pt-1 text-xs">
              <span className="text-slate-400 font-medium mr-1 text-[11px]">Subject:</span>
              {SUBJECTS_FILTER.map((subj) => (
                <button
                  key={subj}
                  type="button"
                  onClick={() => setFilterSubject(subj)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap cursor-pointer transition-colors ${
                    filterSubject === subj
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {subj}
                </button>
              ))}
            </div>
          </div>

          {/* Sample Live Discussion Callout */}
          <div className="p-3 bg-blue-50/80 rounded-xl border border-blue-200 text-xs text-blue-900 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
              <span>
                <strong>Sample Live Discussions: </strong> Every answer below features peer-reviewed pedagogical explanations, diagrams and follow-ups.
              </span>
            </div>
            <button
              onClick={() => setActiveSubView('ask')}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold rounded-lg cursor-pointer shrink-0"
            >
              + Ask Question
            </button>
          </div>

          {/* Questions Feed Cards */}
          <div className="space-y-4">
            {filteredQuestions.map((q) => {
              const isExpanded = expandedQuestionId === q.id;
              const hasAnswer = q.answers && q.answers.length > 0;

              return (
                <div
                  key={q.id}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:border-slate-300 transition-colors"
                >
                  {/* Card Header & Question */}
                  <div className="p-5 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono font-bold text-slate-700">{q.id}</span>
                        <span>·</span>
                        <span className="font-semibold text-slate-900">{q.studentDisplayName}</span>
                        <span>·</span>
                        <span className="text-slate-500">{q.grade} ({q.board})</span>
                        <span>·</span>
                        <span className="text-blue-700 font-medium">{q.subject}</span>
                        <span>·</span>
                        <span className="text-slate-400">Chapter: {q.chapter}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        {hasAnswer ? (
                          <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <CheckCircle className="w-3 h-3 text-emerald-600" />
                            <span>Answered by Faculty</span>
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                            Awaiting Answer
                          </span>
                        )}
                        <span className="text-[11px] text-slate-400">{q.createdAt}</span>
                      </div>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 leading-snug">
                      {q.questionText}
                    </h3>

                    {q.questionImageUrl && (
                      <div className="p-2 bg-slate-50 rounded-lg border border-slate-200 w-fit">
                        <img
                          src={q.questionImageUrl}
                          alt="Student snapshot"
                          className="max-h-48 rounded object-contain"
                        />
                      </div>
                    )}

                    {/* Meta strip */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => upvoteQuestion(q.id)}
                          className="flex items-center gap-1 text-slate-500 hover:text-blue-600 transition-colors cursor-pointer"
                        >
                          <ThumbsUp className="w-3.5 h-3.5" />
                          <span>{q.upvotes} Helpful</span>
                        </button>
                        <span className="text-slate-300">|</span>
                        <span className="text-slate-500">
                          {q.answers.length} Verified Answer{q.answers.length === 1 ? '' : 's'}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => setExpandedQuestionId(isExpanded ? null : q.id)}
                        className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
                      >
                        <span>{isExpanded ? 'Hide Discussion' : 'View Faculty Answer & Follow-ups'}</span>
                        {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  {/* Expanded Faculty Answers & Discussion Thread */}
                  {isExpanded && (
                    <div className="bg-slate-50/80 p-5 border-t border-slate-200 space-y-4">
                      {hasAnswer ? (
                        q.answers.map((ans) => (
                          <div
                            key={ans.id}
                            className="bg-white rounded-xl border border-slate-200 p-5 space-y-3.5 text-xs shadow-xs"
                          >
                            {/* Faculty Badge */}
                            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                              <div className="flex items-center gap-2.5">
                                <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs">
                                  ✓
                                </div>
                                <div>
                                  <div className="flex items-center gap-1.5 font-bold text-slate-900 text-sm">
                                    <span>{ans.facultyName}</span>
                                    <ShieldCheck className="w-4 h-4 text-blue-600" />
                                  </div>
                                  <div className="text-[11px] text-slate-500">
                                    {ans.facultyDesignation} · {ans.createdAt}
                                  </div>
                                </div>
                              </div>
                              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                                Verified Teacher Solution
                              </span>
                            </div>

                            {/* Answer Text */}
                            <div className="text-slate-800 leading-relaxed text-xs space-y-2.5">
                              <p className="whitespace-pre-wrap">{ans.answerExplanation}</p>

                              {ans.example && (
                                <div className="p-3 bg-blue-50/60 rounded-lg border border-blue-200 text-blue-950 font-mono text-[11px] leading-relaxed">
                                  <strong>Worked Example / Analogy:</strong>
                                  <p className="mt-1">{ans.example}</p>
                                </div>
                              )}

                              {ans.conclusion && (
                                <div className="p-3 bg-emerald-50/60 rounded-lg border border-emerald-200 text-emerald-950 font-medium">
                                  {ans.conclusion}
                                </div>
                              )}
                            </div>

                            {/* Follow-up comments thread */}
                            <div className="pt-3 border-t border-slate-100 space-y-2">
                              <div className="font-bold text-slate-800 text-[11px] flex items-center gap-1">
                                <MessageCircle className="w-3.5 h-3.5 text-slate-500" />
                                <span>Follow-Up Clarifications ({ans.followUps?.length || 0})</span>
                              </div>

                              {ans.followUps && ans.followUps.length > 0 && (
                                <div className="space-y-1.5">
                                  {ans.followUps.map((f) => (
                                    <div
                                      key={f.id}
                                      className={`p-2.5 rounded-lg text-[11px] leading-relaxed ${
                                        f.isFaculty
                                          ? 'bg-blue-50 border border-blue-100 text-blue-900 ml-4'
                                          : 'bg-slate-100 text-slate-800'
                                      }`}
                                    >
                                      <div className="font-semibold text-slate-900 mb-0.5 flex justify-between">
                                        <span>{f.author} {f.isFaculty && '(Faculty)'}</span>
                                        <span className="text-[10px] text-slate-400 font-normal">{f.createdAt}</span>
                                      </div>
                                      <p>{f.text}</p>
                                    </div>
                                  ))}
                                </div>
                              )}

                              {/* Add follow-up input */}
                              <div className="flex gap-2 pt-1">
                                <input
                                  type="text"
                                  value={followUpText[q.id] || ''}
                                  onChange={(e) =>
                                    setFollowUpText({ ...followUpText, [q.id]: e.target.value })
                                  }
                                  placeholder="Ask a clarifying follow-up question..."
                                  className="flex-1 px-3 py-1.5 rounded-lg border border-slate-300 text-xs bg-white"
                                />
                                <button
                                  type="button"
                                  onClick={() => handleSendFollowUp(q.id, ans.id)}
                                  className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs cursor-pointer flex items-center gap-1"
                                >
                                  <Send className="w-3 h-3" />
                                  <span>Send</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-4 bg-white rounded-xl border border-slate-200 text-center text-xs text-slate-500 space-y-2">
                          <Clock className="w-5 h-5 mx-auto text-amber-500" />
                          <p>This question has been assigned to a verified subject faculty member.</p>
                          <span className="text-[11px] text-slate-400">Typical response window: 4–12 hours.</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Child Safeguarding & Educational Guidance Disclaimer */}
          <div className="p-4 bg-slate-100 rounded-xl text-xs text-slate-600 leading-relaxed border border-slate-200 space-y-1">
            <strong className="text-slate-800 block">Community Safety & Pedagogical Code:</strong>
            <p>
              Only authenticated students and verified teachers participate. Any exchange of personal phone numbers, off-platform messaging or inappropriate remarks results in immediate moderation and parent notification. Community answers represent academic guidance and do not replace comprehensive one-on-one sessions.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
