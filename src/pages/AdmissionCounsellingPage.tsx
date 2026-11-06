/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  AdmissionCounsellor,
  AdmissionCounsellingBooking,
  PreExamApplication,
  PostExamApplication,
  ApplicationExpert,
  PreExamStatus,
} from '../types';
import {
  ShieldCheck,
  Clock,
  CheckCircle,
  AlertCircle,
  Star,
  ArrowRight,
  ArrowLeft,
  Search,
  BookOpen,
  Filter,
  Check,
  FileText,
  Building2,
  Globe,
  Calendar,
  Lock,
  Upload,
  Eye,
  Send,
  Download,
  SlidersHorizontal,
  ChevronRight,
  Users,
  Award,
  Zap,
  GraduationCap,
  Sparkles,
  RefreshCw,
  X,
  Video,
  UserCheck,
  CheckCircle2,
  Scale,
  BookmarkCheck,
  HelpCircle,
  ExternalLink,
} from 'lucide-react';

type AdmissionSectionTab =
  | 'overview'
  | 'service-one-to-one'
  | 'service-pre-exam'
  | 'service-post-exam'
  | 'dashboard'
  | 'admin-pricing';

type DashboardSubTab = 'one-to-one' | 'pre-exam' | 'post-exam';

// Examination Pathway Categories for One-to-One Counselling
interface ExamPathwayCategory {
  id: string;
  category: string;
  targetLevel: string;
  exams: string[];
}

const EXAM_PATHWAY_CATEGORIES: ExamPathwayCategory[] = [
  {
    id: 'engineering',
    category: 'Engineering & Technology',
    targetLevel: 'Class 11, 12 & Droppers',
    exams: ['JEE Main', 'JEE Advanced', 'BITSAT', 'VITEEE', 'COMEDK', 'Other Engineering Exams'],
  },
  {
    id: 'medical',
    category: 'Medical & Healthcare',
    targetLevel: 'Class 11, 12 & NEET Aspirants',
    exams: ['NEET UG', 'AIIMS Nursing', 'Other Healthcare Entrance Exams'],
  },
  {
    id: 'management',
    category: 'Management & B-Schools',
    targetLevel: 'Graduates, Final Year & Class 12 (IPMAT)',
    exams: ['CAT', 'XAT', 'CMAT', 'NMAT', 'SNAP', 'IPMAT (IIM Indore/Rohtak)', 'Other MBA Entrances'],
  },
  {
    id: 'undergraduate',
    category: 'Undergraduate University Admissions',
    targetLevel: 'Class 12 & Passouts',
    exams: ['CUET UG (Central Universities)', 'DU CSAS', 'IPU CET', 'Other University Entrance Exams'],
  },
  {
    id: 'law',
    category: 'Law & Legal Studies',
    targetLevel: 'Class 12 & Law Aspirants',
    exams: ['CLAT UG', 'AILET (NLU Delhi)', 'SLAT (Symbiosis)', 'Other Law Entrance Exams'],
  },
  {
    id: 'government_defence',
    category: 'Government, Defence & Banking',
    targetLevel: 'Class 12 (NDA/CHSL) & Graduates (UPSC/CGL/PO)',
    exams: ['NDA (UPSC)', 'UPSC Civil Services', 'SSC CGL', 'SSC CHSL', 'SBI PO / IBPS PO', 'RBI Grade B', 'Other Government Examinations'],
  },
  {
    id: 'international',
    category: 'International Admissions (US/UK/Canada)',
    targetLevel: 'High School & Undergraduates',
    exams: ['SAT', 'ACT', 'AP Exams', 'UCAT', 'LNAT', 'Other University-Specific Exams'],
  },
];

const GUIDANCE_NEEDS_CARDS = [
  { id: 'exam_choice', title: 'Which examination should I choose?', desc: 'Compare eligibility, syllabus overlap, and career prospects for your stream.' },
  { id: 'college_match', title: 'Which colleges and courses are suitable for me?', desc: 'Discover high-fit universities based on your academic profile, budget, and location.' },
  { id: 'rank_prediction', title: 'What colleges can I get based on my rank or score?', desc: 'Previous-year cut-off trends, tier mapping (Safe, Target, Dream), and seat matrices.' },
  { id: 'forms_deadlines', title: 'Which forms should I fill and what are the deadlines?', desc: 'Track portal schedules, choice locking dates, and avoid missing crucial cut-offs.' },
  { id: 'stream_course', title: 'Which stream, course or career should I pursue?', desc: 'In-depth clarity between competing degrees (e.g. B.Tech CS vs ECE, B.Com vs BMS).' },
  { id: 'multiple_confusion', title: 'I am confused between multiple options.', desc: 'Holistic 1-on-1 session to eliminate second thoughts and chart a structured action plan.' },
];

export const AdmissionCounsellingPage: React.FC = () => {
  const {
    admissionCounsellors,
    admissionBookings,
    createAdmissionBooking,
    preExamApplications,
    addPreExamApplication,
    updatePreExamApplication,
    postExamApplications,
    addPostExamApplication,
    updatePostExamApplication,
    applicationExperts,
    admissionPricing,
    updateAdmissionPricing,
  } = useApp();

  const [activeTab, setActiveTab] = useState<AdmissionSectionTab>('overview');
  const [dashboardSubTab, setDashboardSubTab] = useState<DashboardSubTab>('one-to-one');

  // Comparison Drawer State for 1-on-1 Experts
  const [selectedExpertsForComparison, setSelectedExpertsForComparison] = useState<string[]>([]);
  const [showComparisonModal, setShowComparisonModal] = useState(false);

  // Active Booking Inspect Modal for Student Dashboard
  const [inspectedBooking, setInspectedBooking] = useState<AdmissionCounsellingBooking | null>(null);

  // ==========================================
  // 1. ONE-TO-ONE ADMISSION COUNSELLING STATE
  // ==========================================
  const [otoStep, setOtoStep] = useState<number>(1);
  const [otoName, setOtoName] = useState('Aarav Sharma');
  const [otoAge, setOtoAge] = useState<number>(18);
  const [otoClass, setOtoClass] = useState('Class 12');
  const [otoBoard, setOtoBoard] = useState('CBSE');
  const [otoStream, setOtoStream] = useState('Science (PCM)');
  const [otoSelectedExams, setOtoSelectedExams] = useState<string[]>(['JEE Main', 'BITSAT']);
  const [otoNoExamYet, setOtoNoExamYet] = useState(false);
  const [otoExamStatus, setOtoExamStatus] = useState('Currently preparing');
  const [otoExamYear, setOtoExamYear] = useState('2026');
  const [otoScore, setOtoScore] = useState('');
  const [otoRank, setOtoRank] = useState('');
  const [otoPercentile, setOtoPercentile] = useState('');
  const [otoCategory, setOtoCategory] = useState('General / Open');
  const [otoDomicile, setOtoDomicile] = useState('Delhi (NCT)');
  const [otoGuidanceNeeds, setOtoGuidanceNeeds] = useState<string[]>([
    'Which colleges and courses are suitable for me?',
    'What colleges can I get based on my rank or score?',
  ]);
  const [otoUserNotes, setOtoUserNotes] = useState('');
  const [otoSelectedExpertId, setOtoSelectedExpertId] = useState<string>('ac-1');
  const [otoFormat, setOtoFormat] = useState<'online' | 'offline'>('online');
  const [otoDuration, setOtoDuration] = useState<30 | 45 | 60>(45);
  const [otoDate, setOtoDate] = useState('Tomorrow');
  const [otoTimeSlot, setOtoTimeSlot] = useState('4:00 PM – 4:45 PM');
  const [otoBookingSuccess, setOtoBookingSuccess] = useState<AdmissionCounsellingBooking | null>(null);

  // ==========================================
  // 2. BEFORE EXAM FORM FILLING STATE (Simplified)
  // ==========================================
  const [preStep, setPreStep] = useState<number>(1);
  const [preStudentName, setPreStudentName] = useState('Meera Joshi');
  const [preMobile, setPreMobile] = useState('+91 98765 43210');
  const [preEmail, setPreEmail] = useState('meera.joshi@example.com');
  const [preQualification, setPreQualification] = useState('Graduation (Final Year B.Com)');
  const [preStream, setPreStream] = useState('Commerce & Management');
  const [preGradStatus, setPreGradStatus] = useState('Appearing in final semester');
  const [preExamYear, setPreExamYear] = useState('2026');
  const [preSelectedExams, setPreSelectedExams] = useState<string[]>(['CAT', 'XAT', 'CMAT']);
  const [preUploadedDocs, setPreUploadedDocs] = useState<Array<{ id: string; name: string; size: string; status: 'uploaded' | 'verified' }>>([
    { id: 'd1', name: 'candidate_photo_35x45mm.jpg', size: '42 KB', status: 'verified' },
    { id: 'd2', name: 'candidate_signature_black_ink.jpg', size: '22 KB', status: 'verified' },
    { id: 'd3', name: 'class_10_marksheet_cbse.pdf', size: '185 KB', status: 'verified' },
  ]);
  const [preSelectedExpertId, setPreSelectedExpertId] = useState<string>('exp-2');
  const [preSuccessApp, setPreSuccessApp] = useState<PreExamApplication | null>(null);

  // ==========================================
  // 3. AFTER EXAM ADMISSION ASSISTANCE STATE (Simplified)
  // ==========================================
  const [postStep, setPostStep] = useState<number>(1);
  const [postStudentName, setPostStudentName] = useState('Kavya Mehra');
  const [postMobile, setPostMobile] = useState('+91 98223 99120');
  const [postEmail, setPostEmail] = useState('kavya.mehra@example.com');
  const [postQualification, setPostQualification] = useState('Class 12 Passed (CBSE 92.4%)');
  const [postStream, setPostStream] = useState('Science (PCB)');
  const [postExamAppeared, setPostExamAppeared] = useState('NEET UG');
  const [postExamYear, setPostExamYear] = useState('2026');
  const [postResultStatus, setPostResultStatus] = useState('Score / Rank received');
  const [postScore, setPostScore] = useState('618 / 720');
  const [postRank, setPostRank] = useState('AIR 14,890');
  const [postPercentile, setPostPercentile] = useState('98.4 %ile');
  const [postCategory, setPostCategory] = useState('General');
  const [postDomicile, setPostDomicile] = useState('Maharashtra');
  const [postTargetCourse, setPostTargetCourse] = useState('MBBS / BDS');
  const [postHelpSelected, setPostHelpSelected] = useState<string[]>([
    'College prediction and shortlisting',
    'Counselling registration',
    'College preference and choice filling',
  ]);
  const [postServiceType, setPostServiceType] = useState<'one_time' | '15_day'>('15_day');
  const [postSelectedExpertId, setPostSelectedExpertId] = useState<string>('exp-4');
  const [postSuccessApp, setPostSuccessApp] = useState<PostExamApplication | null>(null);

  // Pre-Exam student draft approval modal simulation
  const [reviewAppModal, setReviewAppModal] = useState<PreExamApplication | null>(null);
  const [studentDraftAgreement, setStudentDraftAgreement] = useState(false);

  // Admin Pricing Form State
  const [editablePricing, setEditablePricing] = useState({
    oneToOne30Min: admissionPricing.oneToOne30Min || 499,
    oneToOne45Min: admissionPricing.oneToOne45Min || 699,
    oneToOne60Min: admissionPricing.oneToOne60Min || 899,
    preExamSingle: admissionPricing.preExamSingle || 799,
    preExamMulti: admissionPricing.preExamMulti || 1499,
    postExamUG15Day: admissionPricing.postExamUG15Day || 4999,
    postExamMBA15Day: admissionPricing.postExamMBA15Day || 6999,
    postExamGovt15Day: admissionPricing.postExamGovt15Day || 3999,
  });
  const [pricingSavedToast, setPricingSavedToast] = useState(false);

  // Filter 1-on-1 experts matching user stream or general
  const getSelectedCounsellor = (): AdmissionCounsellor => {
    return (
      admissionCounsellors.find((c) => c.id === otoSelectedExpertId) ||
      admissionCounsellors[0]
    );
  };

  // Toggle multi-select exams in 1-on-1 flow
  const toggleOtoExam = (examName: string) => {
    setOtoNoExamYet(false);
    if (otoSelectedExams.includes(examName)) {
      setOtoSelectedExams(otoSelectedExams.filter((e) => e !== examName));
    } else {
      setOtoSelectedExams([...otoSelectedExams, examName]);
    }
  };

  // Toggle multi-select guidance needs
  const toggleOtoGuidance = (guidanceTitle: string) => {
    if (otoGuidanceNeeds.includes(guidanceTitle)) {
      setOtoGuidanceNeeds(otoGuidanceNeeds.filter((g) => g !== guidanceTitle));
    } else {
      setOtoGuidanceNeeds([...otoGuidanceNeeds, guidanceTitle]);
    }
  };

  // Toggle expert in comparison list
  const toggleExpertComparison = (expertId: string) => {
    if (selectedExpertsForComparison.includes(expertId)) {
      setSelectedExpertsForComparison(selectedExpertsForComparison.filter((id) => id !== expertId));
    } else {
      if (selectedExpertsForComparison.length >= 3) {
        alert('You can compare a maximum of 3 experts at a time.');
        return;
      }
      setSelectedExpertsForComparison([...selectedExpertsForComparison, expertId]);
    }
  };

  // Calculate 1-on-1 session fee based on duration
  const getSessionFee = (duration: 30 | 45 | 60): number => {
    if (duration === 30) return editablePricing.oneToOne30Min;
    if (duration === 60) return editablePricing.oneToOne60Min;
    return editablePricing.oneToOne45Min;
  };

  // Handle 1-on-1 Booking Submission
  const handleConfirmOtoBooking = () => {
    const counsellor = getSelectedCounsellor();
    const fee = getSessionFee(otoDuration);

    const newBooking = createAdmissionBooking({
      studentName: otoName,
      age: otoAge,
      grade: otoClass,
      board: otoBoard,
      stream: otoStream,
      targetCourse: otoSelectedExams.join(', ') || 'General Admission Guidance',
      preferredLocation: otoDomicile,
      examDetails: {
        examName: otoSelectedExams[0] || 'General Guidance',
        selectedExams: otoNoExamYet ? ['I have not selected an exam yet'] : otoSelectedExams,
        score: otoScore || undefined,
        rank: otoRank || undefined,
        percentile: otoPercentile || undefined,
        category: otoCategory,
        domicile: otoDomicile,
        year: otoExamYear,
        resultStatus: otoExamStatus,
      },
      selectedServices: ['1-on-1 Admission Counselling', ...otoGuidanceNeeds],
      guidanceNeeds: otoGuidanceNeeds,
      userNotes: otoUserNotes,
      counsellorId: counsellor.id,
      counsellorName: counsellor.name,
      counsellorPhoto: counsellor.photoUrl,
      format: otoFormat,
      date: otoDate,
      timeSlot: otoTimeSlot,
      durationMinutes: otoDuration,
      sessionFee: fee,
      status: 'confirmed',
      postSessionSummary: {
        recommendedPathways: [
          `${otoSelectedExams[0] || 'Target Degree'} Top Institutional Hierarchy`,
          'Central University & Premier Private Deemed Options',
          'State Quota vs All India Open Seat Optimization',
        ],
        suitableColleges: [
          'Premier Tier 1 Target Institutions',
          'High Probability Safe Match Institutions',
          'Emerging High-Placement Campuses',
        ],
        eligibilityNotes: `Tailored for ${otoCategory} Category, Domicile: ${otoDomicile}. Official certificates require validity post April 1st of admission year.`,
        upcomingDeadlines: [
          'Application Window & Verification Stage: Next 14 Days',
          'Choice Locking / Counselling Preference Freeze: Upcoming Round 1',
        ],
        recommendedNextSteps: [
          'Review the session action checklist prepared by your mentor.',
          'Organize attested academic marksheets and category certificates.',
          'Consider our 15-Day Post-Exam Assistance Package for ongoing round-by-round seat allocation support.',
        ],
      },
    });

    setOtoBookingSuccess(newBooking);
    setOtoStep(7);
  };

  // Handle Before Exam Form Submission
  const handleConfirmPreExam = () => {
    const assignedExpert = applicationExperts.find((e) => e.id === preSelectedExpertId) || applicationExperts[0];
    const isMulti = preSelectedExams.length > 1;
    const fee = isMulti ? editablePricing.preExamMulti : editablePricing.preExamSingle;

    const newApp = addPreExamApplication({
      studentName: preStudentName,
      mobile: preMobile,
      email: preEmail,
      currentQualification: preQualification,
      graduationStatus: preGradStatus,
      educationalBackground: `${preStream} (${preQualification})`,
      targetExams: preSelectedExams,
      examYear: preExamYear,
      selectedServices: [
        'Registration & Account Creation',
        'Multi-Exam Form Data Entry',
        'Document Specification Optimization',
        'Student Draft Approval Verification',
      ],
      documents: preUploadedDocs.map((d) => ({
        id: d.id,
        docType: d.name.includes('photo') ? 'Photograph' : d.name.includes('signature') ? 'Signature' : 'Academic Proof',
        fileName: d.name,
        fileSize: d.size,
        status: 'verified',
        uploadDate: '2026-11-03',
      })),
      expertId: assignedExpert.id,
      expertName: assignedExpert.name,
      expertPhoto: assignedExpert.photoUrl,
      expertQualification: assignedExpert.qualification,
      consultationFee: fee,
      scheduledDate: '2026-11-06',
      scheduledSlot: '3:00 PM – 4:00 PM',
      status: 'awaiting_student_approval',
      studentApproved: false,
      notes: `Coordinating multi-exam registration for ${preSelectedExams.join(', ')}. Expert draft prepared and pending student approval.`,
    });

    setPreSuccessApp(newApp);
  };

  // Handle After Exam Form Submission
  const handleConfirmPostExam = () => {
    const assignedExpert = applicationExperts.find((e) => e.id === postSelectedExpertId) || applicationExperts[1];
    let packageType: '15_day_ug' | '15_day_mba' | '15_day_govt' = '15_day_ug';
    let packageFee = editablePricing.postExamUG15Day;

    if (postExamAppeared.includes('CAT') || postExamAppeared.includes('XAT') || postExamAppeared.includes('CMAT')) {
      packageType = '15_day_mba';
      packageFee = editablePricing.postExamMBA15Day;
    } else if (postExamAppeared.includes('SSC') || postExamAppeared.includes('UPSC') || postExamAppeared.includes('RBI')) {
      packageType = '15_day_govt';
      packageFee = editablePricing.postExamGovt15Day;
    }

    const newPostApp = addPostExamApplication({
      studentName: postStudentName,
      mobile: postMobile,
      email: postEmail,
      categoryType:
        packageType === '15_day_mba'
          ? 'mba'
          : packageType === '15_day_govt'
          ? 'government_recruitment'
          : 'undergraduate',
      examName: postExamAppeared,
      examYear: postExamYear,
      score: postScore,
      rank: postRank,
      percentile: postPercentile,
      categoryQuota: postCategory,
      domicileState: postDomicile,
      qualification: postQualification,
      targetColleges: ['Top 5 Preference Institutions based on Score Mapping'],
      preferredCourse: postTargetCourse,
      preferredLocation: postDomicile,
      selectedHelp: postHelpSelected,
      packageType,
      packageTitle:
        postServiceType === '15_day'
          ? `Complete 15-Day Admission & Counselling Support (${postExamAppeared})`
          : `One-Time Admission Counselling Session (${postExamAppeared})`,
      packageFee: postServiceType === '15_day' ? packageFee : editablePricing.oneToOne45Min,
      startDate: '2026-11-03',
      endDate: '2026-11-18',
      daysRemaining: 15,
      expertId: assignedExpert.id,
      expertName: assignedExpert.name,
      expertPhoto: assignedExpert.photoUrl,
      expertSpecialisation: assignedExpert.specialisation,
      status: 'active_15_day',
      trackedColleges: [
        {
          id: 'tc-auto-1',
          institutionName: 'Top Target University (Choice 1)',
          course: postTargetCourse,
          deadline: 'Registration / Preference Locking: Upcoming Round',
          status: 'Form In Progress',
          notes: 'Score and rank mapped against previous 3 years closing cut-offs.',
        },
      ],
      timelineEvents: [
        {
          dayRange: 'Day 1–3',
          title: 'Score Analysis & College Tier Mapping',
          description: 'Evaluating percentile vs seat matrices across quotas.',
          isCompleted: true,
        },
        {
          dayRange: 'Day 4–7',
          title: 'Counselling Portal Registration & Preferences',
          description: 'Drafting optimal priority order list for student confirmation.',
          isCompleted: false,
        },
        {
          dayRange: 'Day 8–11',
          title: 'Choice Locking & Verification Tracking',
          description: 'Submitting finalized choices and validating scanned dossiers.',
          isCompleted: false,
        },
        {
          dayRange: 'Day 12–15',
          title: 'Mock Seat Allotment & Decision Strategy',
          description: 'Guiding Freeze, Float, or Slide options for Round upgrades.',
          isCompleted: false,
        },
      ],
    });

    setPostSuccessApp(newPostApp);
  };

  // Student Approval Action for Pre-Exam Draft
  const handleApproveDraft = (appId: string) => {
    updatePreExamApplication(appId, {
      studentApproved: true,
      status: 'submitted',
      registrationNumber: `QT-EXAM-${Math.floor(100000 + Math.random() * 900000)}`,
      confirmationReceipt: `Official_Submission_Summary_${appId}.pdf`,
      notes: 'Form officially authorized and submitted with student explicit consent. No credentials or OTPs were shared.',
    });
    setReviewAppModal(null);
    setStudentDraftAgreement(false);
  };

  // Save Admin Pricing Changes
  const handleSavePricing = () => {
    updateAdmissionPricing(editablePricing);
    setPricingSavedToast(true);
    setTimeout(() => setPricingSavedToast(false), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-24">
      {/* Top Banner / Breadcrumb Header */}
      <div className="bg-slate-900 text-white border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-300 text-xs font-semibold uppercase tracking-wider mb-4">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                Personalised Admission & Form-Filling Ecosystem
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
                Not Sure What's Next? <br className="hidden sm:inline" />
                <span className="text-blue-400">Get Expert Admission Guidance.</span>
              </h1>
              <p className="mt-3 text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
                From choosing the right entrance examination to understanding college cut-offs,
                applications and admission opportunities, get personalised one-to-one guidance from experienced admission experts.
              </p>
            </div>

            {/* Quick Summary Badge Pill */}
            <div className="flex flex-col sm:flex-row md:flex-col gap-3 shrink-0">
              <div className="bg-slate-800/80 border border-slate-700/80 p-4 rounded-xl flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-medium">100% Privacy & Security</p>
                  <p className="text-sm font-bold text-white">No Passwords or OTPs Shared</p>
                </div>
              </div>
              <div className="bg-slate-800/80 border border-slate-700/80 p-4 rounded-xl flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-medium">Mandatory Protocol</p>
                  <p className="text-sm font-bold text-white">Student Approves Every Draft</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sub-Navigation Bar */}
          <div className="mt-8 pt-6 border-t border-slate-800 flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
                activeTab === 'overview'
                  ? 'bg-white text-slate-900 shadow-md font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>3 Services Overview</span>
            </button>
            <button
              onClick={() => setActiveTab('service-one-to-one')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
                activeTab === 'service-one-to-one'
                  ? 'bg-blue-600 text-white shadow-md font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Users className="w-4 h-4 text-blue-400" />
              <span>1. One-to-One Counselling</span>
              <span className="text-[10px] font-bold uppercase bg-amber-400 text-slate-900 px-1.5 py-0.5 rounded">
                Main
              </span>
            </button>
            <button
              onClick={() => setActiveTab('service-pre-exam')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
                activeTab === 'service-pre-exam'
                  ? 'bg-blue-600 text-white shadow-md font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <FileText className="w-4 h-4 text-blue-400" />
              <span>2. Before Exam: Form Filling</span>
            </button>
            <button
              onClick={() => setActiveTab('service-post-exam')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
                activeTab === 'service-post-exam'
                  ? 'bg-blue-600 text-white shadow-md font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Award className="w-4 h-4 text-indigo-400" />
              <span>3. After Exam: Admission Assistance</span>
            </button>
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ml-auto ${
                activeTab === 'dashboard'
                  ? 'bg-slate-700 text-white shadow-sm font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Clock className="w-4 h-4 text-emerald-400" />
              <span>Student Dashboard</span>
              {(admissionBookings.length > 0 || preExamApplications.length > 0) && (
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('admin-pricing')}
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'admin-pricing'
                  ? 'bg-slate-700 text-white shadow-sm font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
              title="Admin pricing and fee configuration"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span className="text-xs">Admin Fees</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Container Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {/* ========================================================= */}
        {/* VIEW 1: THREE SERVICE CARDS OVERVIEW                       */}
        {/* ========================================================= */}
        {activeTab === 'overview' && (
          <div className="space-y-12">
            {/* The 3 Main Cards Grid */}
            <div>
              <div className="text-center max-w-2xl mx-auto mb-8">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                  Three Simple Ways QuickTeach Guides Your Journey
                </h2>
                <p className="mt-2 text-slate-600 text-sm sm:text-base">
                  Whether you are planning your future examinations, registering for multiple tests, or navigating college counselling cut-offs.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* CARD 1 — ONE-TO-ONE ADMISSION COUNSELLING (TAG: MOST IMPORTANT SERVICE) */}
                <div className="bg-white rounded-2xl border-2 border-blue-600 shadow-xl overflow-hidden flex flex-col justify-between relative transform md:-translate-y-2 transition-transform hover:shadow-2xl">
                  {/* Glowing Top Ribbon */}
                  <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-4 py-2 flex items-center justify-between text-xs font-bold tracking-wide">
                    <span className="flex items-center gap-1.5 uppercase">
                      <Sparkles className="w-4 h-4 text-amber-300" />
                      MOST IMPORTANT SERVICE
                    </span>
                    <span className="bg-white/20 text-white text-[11px] px-2 py-0.5 rounded-full font-semibold">
                      Primary Offering
                    </span>
                  </div>

                  <div className="p-6 sm:p-7 flex-1 flex flex-col">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xl mb-4 border border-blue-100">
                      <Users className="w-6 h-6" />
                    </div>

                    <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                      One-to-One Admission Counselling
                    </h3>

                    <p className="mt-3 text-slate-600 text-sm leading-relaxed">
                      Confused about which college to choose, what your examination score means or where to apply?
                      Connect with an experienced admission expert who understands your academic background and goals.
                    </p>

                    <div className="mt-6 pt-5 border-t border-slate-100 flex-1">
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                        What's Included:
                      </p>
                      <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700">
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                          <span>Personalised expert consultation (30 / 45 / 60 min)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                          <span>College and course shortlisting (Dream, Target, Safe)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                          <span>Cut-off and eligibility guidance across quotas</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                          <span>Examination and admission pathway guidance</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                          <span>Application and counselling guidance</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                          <span>Personalised next-step recommendations & dossier</span>
                        </li>
                      </ul>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                      <div>
                        <span className="text-xs text-slate-400">Starting from</span>
                        <p className="text-xl font-black text-slate-900">₹{editablePricing.oneToOne30Min}</p>
                      </div>
                      <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-100">
                        Online or In-Person
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        setActiveTab('service-one-to-one');
                        setOtoStep(1);
                        window.scrollTo({ top: 300, behavior: 'smooth' });
                      }}
                      className="mt-5 w-full py-3.5 px-4 rounded-xl bg-blue-600 text-white font-bold text-sm sm:text-base hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg flex items-center justify-center gap-2 group cursor-pointer"
                    >
                      <span>Book an Admission Counsellor</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>

                {/* CARD 2 — BEFORE EXAM: FORM FILLING */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col justify-between">
                  <div className="bg-slate-100 text-slate-700 px-4 py-2 text-xs font-semibold tracking-wide border-b border-slate-200 flex items-center justify-between">
                    <span>SERVICE TWO</span>
                    <span>Multi-Exam Application</span>
                  </div>

                  <div className="p-6 sm:p-7 flex-1 flex flex-col">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center font-bold text-xl mb-4 border border-slate-200">
                      <FileText className="w-6 h-6 text-blue-600" />
                    </div>

                    <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                      Before Exam: Form Filling
                    </h3>

                    <p className="mt-3 text-slate-600 text-sm leading-relaxed">
                      Get expert help with examination eligibility, document preparation, registration and application submission.
                    </p>

                    <div className="mt-6 pt-5 border-t border-slate-100 flex-1">
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                        Supported Examinations:
                      </p>
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {['CAT', 'XAT', 'CMAT', 'NMAT', 'SNAP', 'CUET UG', 'JEE Main', 'NEET UG', 'CLAT', 'SSC CGL', 'RBI Grade B'].map(
                          (exam) => (
                            <span
                              key={exam}
                              className="text-xs bg-slate-100 text-slate-700 font-medium px-2 py-1 rounded-md border border-slate-200"
                            >
                              {exam}
                            </span>
                          )
                        )}
                      </div>

                      <ul className="space-y-2 text-xs text-slate-600">
                        <li className="flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 text-blue-600" />
                          <span>Select multiple exams in a single request</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 text-blue-600" />
                          <span>Consolidated dynamic document checklist</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 text-blue-600" />
                          <span>Dedicated expert handles submission drafts</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 text-blue-600" />
                          <span>Mandatory student approval before submission</span>
                        </li>
                      </ul>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                      <div>
                        <span className="text-xs text-slate-400">Assistance from</span>
                        <p className="text-xl font-black text-slate-900">₹{editablePricing.preExamSingle}</p>
                      </div>
                      <span className="text-xs font-semibold text-slate-500 bg-slate-50 px-2 py-1 rounded-md">
                        Single or Multi-Exam
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        setActiveTab('service-pre-exam');
                        setPreStep(1);
                        window.scrollTo({ top: 300, behavior: 'smooth' });
                      }}
                      className="mt-5 w-full py-3 px-4 rounded-xl bg-slate-900 text-white font-semibold text-sm hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>Get Form Filling Assistance</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* CARD 3 — AFTER EXAM: ADMISSION ASSISTANCE */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col justify-between">
                  <div className="bg-slate-100 text-slate-700 px-4 py-2 text-xs font-semibold tracking-wide border-b border-slate-200 flex items-center justify-between">
                    <span>SERVICE THREE</span>
                    <span>15-Day Package & Guidance</span>
                  </div>

                  <div className="p-6 sm:p-7 flex-1 flex flex-col">
                    <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold text-xl mb-4 border border-indigo-100">
                      <Award className="w-6 h-6 text-indigo-600" />
                    </div>

                    <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                      After Exam: Admission Assistance
                    </h3>

                    <p className="mt-3 text-slate-600 text-sm leading-relaxed">
                      Get dedicated help with college applications, cut-offs, counselling registration, preference filling and admission procedures.
                    </p>

                    <div className="mt-6 pt-5 border-t border-slate-100 flex-1">
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                        Post-Exam Support Scope:
                      </p>
                      <ul className="space-y-2 text-xs text-slate-600 mb-4">
                        <li className="flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 text-indigo-600" />
                          <span>College prediction based on actual rank / percentile</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 text-indigo-600" />
                          <span>Counselling portal registration (JoSAA, CSAS, MCC, State CET)</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 text-indigo-600" />
                          <span>Optimal choice order & preference matrix filling</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 text-indigo-600" />
                          <span>Government recruitment next stages (DAF, post preferences)</span>
                        </li>
                      </ul>

                      <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-100 text-xs text-indigo-900">
                        <span className="font-bold">15-Day Dedicated Window:</span> Personal counsellor monitors every choice-locking and mock seat allocation until admission.
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                      <div>
                        <span className="text-xs text-slate-400">15-Day Package</span>
                        <p className="text-xl font-black text-slate-900">₹{editablePricing.postExamUG15Day}</p>
                      </div>
                      <span className="text-xs font-semibold text-indigo-700 bg-indigo-50 px-2 py-1 rounded-md">
                        15 Days Full Cover
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        setActiveTab('service-post-exam');
                        setPostStep(1);
                        window.scrollTo({ top: 300, behavior: 'smooth' });
                      }}
                      className="mt-5 w-full py-3 px-4 rounded-xl bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>Get 15-Day Admission Support</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Trust and Security Assurance Bar */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <Lock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">Strict Zero-Password Policy</h4>
                    <p className="text-xs text-slate-500 mt-1">
                      Our counsellors guide you via shared drafts or screen-shares. We never ask for your login password or OTPs.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">Student Approval Required</h4>
                    <p className="text-xs text-slate-500 mt-1">
                      Every single application draft must be thoroughly reviewed and authorized by the student before submission.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                    <Scale className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">Transparent Fee Disclosure</h4>
                    <p className="text-xs text-slate-500 mt-1">
                      QuickTeach professional counselling fees are separated from official government or university examination fees.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* VIEW 2: SERVICE 1 — ONE-TO-ONE ADMISSION COUNSELLING (MAIN) */}
        {/* ========================================================= */}
        {activeTab === 'service-one-to-one' && (
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Step Navigation Progress Indicator */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                    Service 1: Personalised 1-on-1 Guidance
                  </span>
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                    Tell Us Where You Stand. We'll Help You Decide What's Next.
                  </h2>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold text-slate-400">Step {otoStep} of 7</span>
                  <p className="text-sm font-bold text-blue-600">
                    {otoStep === 1 && 'Student Profile'}
                    {otoStep === 2 && 'Exam Pathways'}
                    {otoStep === 3 && 'Exam Status'}
                    {otoStep === 4 && 'Guidance Needs'}
                    {otoStep === 5 && 'Select Expert'}
                    {otoStep === 6 && 'Book Session'}
                    {otoStep === 7 && 'Session Summary'}
                  </p>
                </div>
              </div>

              {/* Step Pills */}
              <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
                {[1, 2, 3, 4, 5, 6, 7].map((stepNum) => (
                  <button
                    key={stepNum}
                    disabled={stepNum > otoStep}
                    onClick={() => setOtoStep(stepNum)}
                    className={`h-2 rounded-full transition-all cursor-pointer ${
                      stepNum === otoStep
                        ? 'bg-blue-600 ring-2 ring-blue-200'
                        : stepNum < otoStep
                        ? 'bg-emerald-500'
                        : 'bg-slate-200 cursor-not-allowed'
                    }`}
                    title={`Go to Step ${stepNum}`}
                  />
                ))}
              </div>
            </div>

            {/* STEP 1: STUDENT PROFILE */}
            {otoStep === 1 && (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Step 1: Student Profile</h3>
                  <p className="text-slate-600 text-sm mt-1">
                    Please share your current academic stage so we can personalize the questions and recommended pathways.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                      Student Name *
                    </label>
                    <input
                      type="text"
                      value={otoName}
                      onChange={(e) => setOtoName(e.target.value)}
                      placeholder="e.g. Aarav Sharma"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                      Age *
                    </label>
                    <input
                      type="number"
                      value={otoAge}
                      onChange={(e) => setOtoAge(Number(e.target.value))}
                      min={14}
                      max={35}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                      Current Class / Qualification *
                    </label>
                    <select
                      value={otoClass}
                      onChange={(e) => {
                        const val = e.target.value;
                        setOtoClass(val);
                        if (val.includes('Graduation')) {
                          setOtoStream('Graduation');
                        }
                      }}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-800"
                    >
                      <option value="Class 11">Class 11</option>
                      <option value="Class 12">Class 12</option>
                      <option value="Class 12 Completed">Class 12 Completed (Dropper / Taking Gap)</option>
                      <option value="Graduation">Graduation (Pursuing Bachelor's)</option>
                      <option value="Graduation Completed">Graduation Completed (Graduate)</option>
                      <option value="Other">Other Stage</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                      Educational Board / University *
                    </label>
                    <select
                      value={otoBoard}
                      onChange={(e) => setOtoBoard(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-800"
                    >
                      <option value="CBSE">CBSE</option>
                      <option value="ICSE / ISC">ICSE / ISC</option>
                      <option value="IB (International Baccalaureate)">IB (International Baccalaureate)</option>
                      <option value="IGCSE / Cambridge">IGCSE / Cambridge</option>
                      <option value="State Board">State Board</option>
                      <option value="University / College">Recognised University / College</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                      Academic Stream *
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      {[
                        'Science (PCM)',
                        'Science (PCB)',
                        'Science (PCMB)',
                        'Commerce',
                        'Arts / Humanities',
                        'Graduation',
                        'Other',
                      ].map((st) => (
                        <button
                          key={st}
                          type="button"
                          onClick={() => setOtoStream(st)}
                          className={`p-3 rounded-xl border text-left text-xs font-semibold transition-all cursor-pointer ${
                            otoStream === st
                              ? 'border-blue-600 bg-blue-50 text-blue-900 ring-2 ring-blue-200'
                              : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          <span className="block">{st}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-end">
                  <button
                    onClick={() => setOtoStep(2)}
                    className="py-3 px-6 rounded-xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <span>Proceed to Examination Pathways</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: SELECT THE EXAMINATION OR CAREER PATHWAY */}
            {otoStep === 2 && (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">
                    Step 2: Select the Examination or Career Pathway
                  </h3>
                  <p className="text-slate-600 text-sm mt-1">
                    Select one or multiple examinations you are targeting. You can also select "I haven't selected an exam yet" to explore options.
                  </p>
                </div>

                {/* Selected Exams Counter Banner */}
                <div className="p-4 rounded-xl bg-blue-50/80 border border-blue-200 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <span className="text-xs font-bold text-blue-800 uppercase tracking-wide">
                      Selected Examinations ({otoNoExamYet ? 'General Guidance' : otoSelectedExams.length}):
                    </span>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {otoNoExamYet ? (
                        <span className="text-xs bg-white text-blue-700 font-bold px-2.5 py-1 rounded-md border border-blue-300">
                          General Guidance (No specific exam yet)
                        </span>
                      ) : otoSelectedExams.length > 0 ? (
                        otoSelectedExams.map((ex) => (
                          <span
                            key={ex}
                            className="text-xs bg-white text-blue-800 font-bold px-2.5 py-1 rounded-md border border-blue-300 flex items-center gap-1"
                          >
                            <span>{ex}</span>
                            <button
                              type="button"
                              onClick={() => toggleOtoExam(ex)}
                              className="text-slate-400 hover:text-red-500 cursor-pointer"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-slate-500 italic">No exams chosen yet</span>
                      )}
                    </div>
                  </div>

                  {/* Open Guidance Quick Button */}
                  <button
                    type="button"
                    onClick={() => {
                      setOtoNoExamYet(true);
                      setOtoSelectedExams([]);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                      otoNoExamYet
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-blue-700 border border-blue-300 hover:bg-blue-100'
                    }`}
                  >
                    I haven't selected an exam yet
                  </button>
                </div>

                {/* Pathway Category Cards */}
                <div className="space-y-4">
                  {EXAM_PATHWAY_CATEGORIES.map((cat) => (
                    <div key={cat.id} className="border border-slate-200 rounded-xl p-4 bg-slate-50/50">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-bold text-slate-900 text-sm">{cat.category}</h4>
                        <span className="text-[11px] text-slate-500 font-medium">{cat.targetLevel}</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {cat.exams.map((examName) => {
                          const isSelected = otoSelectedExams.includes(examName);
                          return (
                            <button
                              key={examName}
                              type="button"
                              onClick={() => toggleOtoExam(examName)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                                isSelected
                                  ? 'bg-blue-600 text-white shadow-sm'
                                  : 'bg-white text-slate-700 border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50'
                              }`}
                            >
                              {isSelected ? <Check className="w-3.5 h-3.5" /> : null}
                              <span>{examName}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => setOtoStep(1)}
                    className="py-2.5 px-4 rounded-xl border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50 flex items-center gap-1.5 cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>
                  <button
                    onClick={() => {
                      if (otoSelectedExams.length === 0 && !otoNoExamYet) {
                        alert('Please select at least one examination or choose "I haven\'t selected an exam yet".');
                        return;
                      }
                      setOtoStep(3);
                    }}
                    className="py-3 px-6 rounded-xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <span>Proceed to Exam Status</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: EXAM STATUS */}
            {otoStep === 3 && (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">
                    Step 3: What is your current examination status?
                  </h3>
                  <p className="text-slate-600 text-sm mt-1">
                    Select your current stage so the counsellor knows whether you need preparation strategy or immediate counselling cut-offs.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    'Planning which examination to prepare for',
                    'Currently preparing',
                    'Examination completed',
                    'Result declared',
                    'Score / Rank received',
                    'Waiting for counselling or admission',
                    'Already received an offer but unsure which college to choose',
                  ].map((statusOption) => (
                    <button
                      key={statusOption}
                      type="button"
                      onClick={() => setOtoExamStatus(statusOption)}
                      className={`p-3.5 rounded-xl border text-left text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-3 ${
                        otoExamStatus === statusOption
                          ? 'border-blue-600 bg-blue-50 text-blue-900 ring-2 ring-blue-200'
                          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                          otoExamStatus === statusOption
                            ? 'border-blue-600 bg-blue-600 text-white'
                            : 'border-slate-300'
                        }`}
                      >
                        {otoExamStatus === statusOption && <Check className="w-2.5 h-2.5" />}
                      </div>
                      <span>{statusOption}</span>
                    </button>
                  ))}
                </div>

                {/* Optional Details if Score / Result received */}
                {(otoExamStatus === 'Score / Rank received' ||
                  otoExamStatus === 'Result declared' ||
                  otoExamStatus === 'Waiting for counselling or admission' ||
                  otoExamStatus === 'Already received an offer but unsure which college to choose') && (
                  <div className="mt-4 p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-4">
                    <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
                      <FileText className="w-4 h-4 text-blue-600" />
                      <span>Optional Examination Scores & Rank (Helps match cut-offs)</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">Score Obtained</label>
                        <input
                          type="text"
                          value={otoScore}
                          onChange={(e) => setOtoScore(e.target.value)}
                          placeholder="e.g. 210/300 or 612/720"
                          className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-xs font-medium"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">Rank / All India Rank</label>
                        <input
                          type="text"
                          value={otoRank}
                          onChange={(e) => setOtoRank(e.target.value)}
                          placeholder="e.g. AIR 8,420"
                          className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-xs font-medium"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">Percentile</label>
                        <input
                          type="text"
                          value={otoPercentile}
                          onChange={(e) => setOtoPercentile(e.target.value)}
                          placeholder="e.g. 98.7%ile"
                          className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-xs font-medium"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">Reservation Category</label>
                        <select
                          value={otoCategory}
                          onChange={(e) => setOtoCategory(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-xs font-medium"
                        >
                          <option value="General / Open">General / Open</option>
                          <option value="OBC-NCL">OBC-NCL (Central List)</option>
                          <option value="EWS">EWS (Economically Weaker Section)</option>
                          <option value="SC">Scheduled Caste (SC)</option>
                          <option value="ST">Scheduled Tribe (ST)</option>
                          <option value="PwD">Person with Benchmark Disability (PwD)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">State Domicile</label>
                        <input
                          type="text"
                          value={otoDomicile}
                          onChange={(e) => setOtoDomicile(e.target.value)}
                          placeholder="e.g. Delhi, Maharashtra, Karnataka"
                          className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-xs font-medium"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">Examination Year</label>
                        <input
                          type="text"
                          value={otoExamYear}
                          onChange={(e) => setOtoExamYear(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-xs font-medium"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => setOtoStep(2)}
                    className="py-2.5 px-4 rounded-xl border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50 flex items-center gap-1.5 cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>
                  <button
                    onClick={() => setOtoStep(4)}
                    className="py-3 px-6 rounded-xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <span>Proceed to Guidance Needs</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: WHAT DO YOU NEED GUIDANCE WITH? */}
            {otoStep === 4 && (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">
                    Step 4: What do you need guidance with?
                  </h3>
                  <p className="text-slate-600 text-sm mt-1">
                    Select the key questions you would like your counsellor to address in this session. Multiple selections allowed.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {GUIDANCE_NEEDS_CARDS.map((card) => {
                    const isSelected = otoGuidanceNeeds.includes(card.title);
                    return (
                      <button
                        key={card.id}
                        type="button"
                        onClick={() => toggleOtoGuidance(card.title)}
                        className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex items-start gap-3.5 ${
                          isSelected
                            ? 'border-blue-600 bg-blue-50/70 text-blue-950 ring-2 ring-blue-200'
                            : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <div
                          className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 mt-0.5 ${
                            isSelected
                              ? 'border-blue-600 bg-blue-600 text-white'
                              : 'border-slate-300 bg-white'
                          }`}
                        >
                          {isSelected && <Check className="w-3.5 h-3.5" />}
                        </div>
                        <div>
                          <h4 className="font-bold text-sm text-slate-900">{card.title}</h4>
                          <p className="text-xs text-slate-500 mt-1 leading-relaxed">{card.desc}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                    Tell us briefly about your confusion or specific requirements (Optional)
                  </label>
                  <textarea
                    rows={3}
                    value={otoUserNotes}
                    onChange={(e) => setOtoUserNotes(e.target.value)}
                    placeholder="e.g. I am torn between Computer Science at a newer IIIT versus Mechanical Engineering at top NIT. What are the 4-year placement differences?"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm text-slate-800"
                  />
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => setOtoStep(3)}
                    className="py-2.5 px-4 rounded-xl border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50 flex items-center gap-1.5 cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>
                  <button
                    onClick={() => setOtoStep(5)}
                    className="py-3 px-6 rounded-xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <span>View Recommended Experts</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 5: EXPERT RECOMMENDATION & COMPARISON */}
            {otoStep === 5 && (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">
                      Step 5: Recommended Admission Counsellors
                    </h3>
                    <p className="text-slate-600 text-sm mt-1">
                      Matched to your target exams ({otoSelectedExams.join(', ') || 'General Guidance'}) and stream ({otoStream}).
                    </p>
                  </div>

                  {/* Comparison Action Bar */}
                  {selectedExpertsForComparison.length > 0 && (
                    <button
                      onClick={() => setShowComparisonModal(true)}
                      className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
                    >
                      <Scale className="w-4 h-4" />
                      <span>Compare ({selectedExpertsForComparison.length}/3) Experts</span>
                    </button>
                  )}
                </div>

                <div className="space-y-4">
                  {admissionCounsellors.map((counsellor) => {
                    const isSelected = otoSelectedExpertId === counsellor.id;
                    const isComparing = selectedExpertsForComparison.includes(counsellor.id);
                    return (
                      <div
                        key={counsellor.id}
                        className={`p-5 rounded-2xl border transition-all ${
                          isSelected
                            ? 'border-blue-600 bg-blue-50/40 ring-2 ring-blue-200 shadow-md'
                            : 'border-slate-200 bg-white hover:border-slate-300'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                          <div className="flex items-start gap-4">
                            <img
                              src={counsellor.photoUrl}
                              alt={counsellor.name}
                              className="w-16 h-16 rounded-xl object-cover border border-slate-200 shrink-0"
                            />
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="text-base font-bold text-slate-900">{counsellor.name}</h4>
                                {counsellor.isVerified && (
                                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                                    <ShieldCheck className="w-3 h-3" />
                                    Verified
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-slate-600 font-medium mt-0.5">
                                {counsellor.qualifications} • {counsellor.experienceYears} Years Experience
                              </p>
                              <div className="flex flex-wrap gap-1.5 mt-2">
                                {counsellor.examSpecialisations.map((spec) => (
                                  <span
                                    key={spec}
                                    className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium"
                                  >
                                    {spec}
                                  </span>
                                ))}
                              </div>
                              <p className="text-xs text-slate-500 mt-2">
                                <span className="font-semibold text-slate-700">Languages:</span>{' '}
                                {counsellor.languages.join(', ')}
                              </p>
                            </div>
                          </div>

                          <div className="sm:text-right shrink-0 w-full sm:w-auto flex sm:flex-col items-center sm:items-end justify-between border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
                            <div>
                              <span className="text-xs text-slate-400">Consultation Fee</span>
                              <p className="text-xl font-black text-slate-900">
                                ₹{editablePricing.oneToOne45Min}{' '}
                                <span className="text-xs font-normal text-slate-500">/ 45 min</span>
                              </p>
                              <span className="text-[11px] text-emerald-600 font-semibold block">
                                Slot: {counsellor.availableSlots[0]}
                              </span>
                            </div>

                            <div className="flex items-center gap-2 mt-3">
                              <button
                                type="button"
                                onClick={() => toggleExpertComparison(counsellor.id)}
                                className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-colors cursor-pointer flex items-center gap-1 ${
                                  isComparing
                                    ? 'bg-indigo-50 border-indigo-300 text-indigo-700'
                                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                                }`}
                              >
                                <Scale className="w-3.5 h-3.5" />
                                <span>{isComparing ? 'Comparing' : 'Compare'}</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  setOtoSelectedExpertId(counsellor.id);
                                  setOtoStep(6);
                                }}
                                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                  isSelected
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-slate-900 text-white hover:bg-slate-800'
                                }`}
                              >
                                Select This Counsellor
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => setOtoStep(4)}
                    className="py-2.5 px-4 rounded-xl border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50 flex items-center gap-1.5 cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>
                  <button
                    onClick={() => setOtoStep(6)}
                    className="py-3 px-6 rounded-xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <span>Proceed to Book Session</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 6: BOOK ONE-TO-ONE SESSION */}
            {otoStep === 6 && (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">
                    Step 6: Confirm Date, Time & Session Format
                  </h3>
                  <p className="text-slate-600 text-sm mt-1">
                    Book your one-to-one admission consultation with {getSelectedCounsellor().name}.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Duration Options */}
                  <div className="sm:col-span-3">
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                      Select Session Duration
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { min: 30 as const, price: editablePricing.oneToOne30Min, label: 'Focused Q&A' },
                        { min: 45 as const, price: editablePricing.oneToOne45Min, label: 'Standard Guidance' },
                        { min: 60 as const, price: editablePricing.oneToOne60Min, label: 'In-Depth Roadmap' },
                      ].map((item) => (
                        <button
                          key={item.min}
                          type="button"
                          onClick={() => setOtoDuration(item.min)}
                          className={`p-3.5 rounded-xl border text-center transition-all cursor-pointer ${
                            otoDuration === item.min
                              ? 'border-blue-600 bg-blue-50 text-blue-900 ring-2 ring-blue-200'
                              : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <span className="block font-bold text-base">{item.min} Minutes</span>
                          <span className="block text-xs font-semibold text-slate-500 mt-0.5">{item.label}</span>
                          <span className="block text-sm font-black text-slate-900 mt-2">₹{item.price}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Mode Option */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                      Consultation Format
                    </label>
                    <select
                      value={otoFormat}
                      onChange={(e) => setOtoFormat(e.target.value as 'online' | 'offline')}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-300 font-medium text-xs sm:text-sm text-slate-800"
                    >
                      <option value="online">Online Video Call (Google Meet / Zoom)</option>
                      <option value="offline">In-Person Consultation (City Centre / Centre Visit)</option>
                    </select>
                  </div>

                  {/* Date Option */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                      Preferred Date
                    </label>
                    <select
                      value={otoDate}
                      onChange={(e) => setOtoDate(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-300 font-medium text-xs sm:text-sm text-slate-800"
                    >
                      <option value="Today (Express)">Today (Express Slot)</option>
                      <option value="Tomorrow">Tomorrow</option>
                      <option value="This Weekend (Saturday)">This Weekend (Saturday)</option>
                      <option value="This Weekend (Sunday)">This Weekend (Sunday)</option>
                    </select>
                  </div>

                  {/* Time Slot Option */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                      Time Slot
                    </label>
                    <select
                      value={otoTimeSlot}
                      onChange={(e) => setOtoTimeSlot(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-300 font-medium text-xs sm:text-sm text-slate-800"
                    >
                      {getSelectedCounsellor().availableSlots.map((slot) => (
                        <option key={slot} value={slot}>
                          {slot}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Booking Order Summary Card */}
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                    Booking Summary
                  </h4>
                  <div className="space-y-2 text-xs sm:text-sm text-slate-700">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Student Name:</span>
                      <span className="font-semibold">{otoName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Selected Counsellor:</span>
                      <span className="font-semibold">{getSelectedCounsellor().name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Exams / Target:</span>
                      <span className="font-semibold">{otoSelectedExams.join(', ') || 'General Guidance'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Date & Slot:</span>
                      <span className="font-semibold">
                        {otoDate} ({otoTimeSlot}) • {otoDuration} min
                      </span>
                    </div>
                    <div className="pt-3 border-t border-slate-200 flex justify-between items-center text-base font-black text-slate-900">
                      <span>Total Consultation Fee:</span>
                      <span className="text-blue-600">₹{getSessionFee(otoDuration)}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => setOtoStep(5)}
                    className="py-2.5 px-4 rounded-xl border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50 flex items-center gap-1.5 cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>
                  <button
                    onClick={handleConfirmOtoBooking}
                    className="py-3.5 px-8 rounded-xl bg-blue-600 text-white font-bold text-sm sm:text-base hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg flex items-center gap-2 cursor-pointer"
                  >
                    <CheckCircle className="w-5 h-5" />
                    <span>Confirm & Book One-to-One Session</span>
                  </button>
                </div>
              </div>
            )}

            {/* STEP 7: AFTER THE SESSION SUMMARY REPORT */}
            {otoStep === 7 && otoBookingSuccess && (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
                <div className="text-center max-w-xl mx-auto">
                  <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3 border border-emerald-100">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900">Session Confirmed!</h3>
                  <p className="text-slate-600 text-sm mt-1">
                    Booking ID: <span className="font-bold text-slate-900">{otoBookingSuccess.id}</span>
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    A confirmation SMS and calendar invite has been dispatched. Below is your initial advisory dossier preview.
                  </p>
                </div>

                {/* Post-Session Summary Dossier Preview */}
                <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 space-y-5">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                    <div className="flex items-center gap-2">
                      <GraduationCap className="w-5 h-5 text-blue-600" />
                      <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                        Personalised Admission Guidance Dossier
                      </h4>
                    </div>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-100/60 px-2.5 py-1 rounded-full">
                      Ready for Student
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Recommended Pathways */}
                    <div className="bg-white p-4 rounded-xl border border-slate-200">
                      <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
                        <Award className="w-3.5 h-3.5 text-blue-600" />
                        Recommended Pathways
                      </h5>
                      <ul className="space-y-1.5 text-xs text-slate-700">
                        {otoBookingSuccess.postSessionSummary?.recommendedPathways.map((path, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <Check className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                            <span>{path}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Suitable Colleges & Cut-off Guidance */}
                    <div className="bg-white p-4 rounded-xl border border-slate-200">
                      <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-indigo-600" />
                        Suitable Colleges & Cut-Off Mapping
                      </h5>
                      <ul className="space-y-1.5 text-xs text-slate-700">
                        {otoBookingSuccess.postSessionSummary?.suitableColleges.map((col, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0"></span>
                            <span>{col}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Eligibility & Domicile Notes */}
                    <div className="bg-white p-4 rounded-xl border border-slate-200">
                      <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        Eligibility & Reservation Guidance
                      </h5>
                      <p className="text-xs text-slate-700 leading-relaxed">
                        {otoBookingSuccess.postSessionSummary?.eligibilityNotes}
                      </p>
                    </div>

                    {/* Upcoming Deadlines */}
                    <div className="bg-white p-4 rounded-xl border border-slate-200">
                      <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-amber-600" />
                        Upcoming Deadlines & Next Steps
                      </h5>
                      <ul className="space-y-1.5 text-xs text-slate-700">
                        {otoBookingSuccess.postSessionSummary?.upcomingDeadlines.map((dl, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                            <span>{dl}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Follow-up / Upgrade CTAs */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100">
                  <button
                    onClick={() => {
                      setActiveTab('dashboard');
                      setDashboardSubTab('one-to-one');
                    }}
                    className="w-full sm:w-auto py-2.5 px-5 rounded-xl border border-slate-300 text-slate-700 font-semibold text-xs sm:text-sm hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    View in Student Dashboard
                  </button>

                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <button
                      onClick={() => {
                        setActiveTab('service-post-exam');
                        setPostStep(1);
                      }}
                      className="w-full sm:w-auto py-2.5 px-5 rounded-xl bg-indigo-600 text-white font-bold text-xs sm:text-sm hover:bg-indigo-700 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <span>Upgrade to 15-Day Package</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* VIEW 3: SERVICE 2 — BEFORE EXAM FORM FILLING (SIMPLIFIED)  */}
        {/* ========================================================= */}
        {activeTab === 'service-pre-exam' && (
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                    Service 2: Multi-Exam Registration & Form Filling
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                    Apply With Confidence. Let Our Experts Handle the Process.
                  </h2>
                </div>
                <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                  Step {preStep} of 5
                </span>
              </div>

              {/* Progress Track */}
              <div className="grid grid-cols-5 gap-2">
                {[1, 2, 3, 4, 5].map((st) => (
                  <div
                    key={st}
                    className={`h-2 rounded-full transition-all ${
                      st === preStep ? 'bg-blue-600 ring-2 ring-blue-200' : st < preStep ? 'bg-emerald-500' : 'bg-slate-200'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* STEP 1: STUDENT DETAILS */}
            {preStep === 1 && (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
                <h3 className="text-lg font-bold text-slate-900">Step 1: Student Details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Student Name</label>
                    <input
                      type="text"
                      value={preStudentName}
                      onChange={(e) => setPreStudentName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Mobile Number</label>
                    <input
                      type="text"
                      value={preMobile}
                      onChange={(e) => setPreMobile(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Current Qualification</label>
                    <input
                      type="text"
                      value={preQualification}
                      onChange={(e) => setPreQualification(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Stream / Discipline</label>
                    <input
                      type="text"
                      value={preStream}
                      onChange={(e) => setPreStream(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Graduation Status (Where relevant)</label>
                    <input
                      type="text"
                      value={preGradStatus}
                      onChange={(e) => setPreGradStatus(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Target Examination Year</label>
                    <input
                      type="text"
                      value={preExamYear}
                      onChange={(e) => setPreExamYear(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-end">
                  <button
                    onClick={() => setPreStep(2)}
                    className="py-2.5 px-6 rounded-xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Proceed to Select Exams</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: SELECT MULTIPLE EXAMINATIONS */}
            {preStep === 2 && (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Step 2: Select Multiple Examinations</h3>
                  <p className="text-slate-600 text-xs sm:text-sm mt-1">
                    Select all examinations you wish our expert to coordinate in this request. Multiple selections allowed!
                  </p>
                </div>

                {/* Selected Exam Counter Badge */}
                <div className="p-3.5 bg-blue-50 rounded-xl border border-blue-200 flex items-center justify-between">
                  <span className="text-xs font-bold text-blue-900">
                    {preSelectedExams.length} Examination{preSelectedExams.length !== 1 ? 's' : ''} Selected:{' '}
                    <span className="text-blue-700 font-normal">{preSelectedExams.join(', ') || 'None selected'}</span>
                  </span>
                  <span className="text-xs font-semibold text-blue-600 bg-white px-2 py-0.5 rounded border border-blue-300">
                    One Unified Form
                  </span>
                </div>

                {/* Categories */}
                <div className="space-y-4">
                  {/* Management */}
                  <div>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
                      Management (MBA / PGDM)
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {['CAT', 'XAT', 'CMAT', 'NMAT', 'SNAP'].map((exam) => {
                        const isSel = preSelectedExams.includes(exam);
                        return (
                          <button
                            key={exam}
                            type="button"
                            onClick={() => {
                              if (isSel) setPreSelectedExams(preSelectedExams.filter((e) => e !== exam));
                              else setPreSelectedExams([...preSelectedExams, exam]);
                            }}
                            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                              isSel
                                ? 'bg-blue-600 text-white shadow-sm'
                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                            }`}
                          >
                            {isSel && <Check className="w-3.5 h-3.5" />}
                            <span>{exam}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Undergraduate */}
                  <div>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
                      Undergraduate Entrances
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {['CUET UG', 'JEE Main', 'NEET UG', 'CLAT', 'IPMAT'].map((exam) => {
                        const isSel = preSelectedExams.includes(exam);
                        return (
                          <button
                            key={exam}
                            type="button"
                            onClick={() => {
                              if (isSel) setPreSelectedExams(preSelectedExams.filter((e) => e !== exam));
                              else setPreSelectedExams([...preSelectedExams, exam]);
                            }}
                            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                              isSel
                                ? 'bg-blue-600 text-white shadow-sm'
                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                            }`}
                          >
                            {isSel && <Check className="w-3.5 h-3.5" />}
                            <span>{exam}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Government & Banking */}
                  <div>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
                      Government Recruitment Examinations
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {['SSC CGL', 'SSC CHSL', 'RBI Grade B', 'SBI PO'].map((exam) => {
                        const isSel = preSelectedExams.includes(exam);
                        return (
                          <button
                            key={exam}
                            type="button"
                            onClick={() => {
                              if (isSel) setPreSelectedExams(preSelectedExams.filter((e) => e !== exam));
                              else setPreSelectedExams([...preSelectedExams, exam]);
                            }}
                            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                              isSel
                                ? 'bg-blue-600 text-white shadow-sm'
                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                            }`}
                          >
                            {isSel && <Check className="w-3.5 h-3.5" />}
                            <span>{exam}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => setPreStep(1)}
                    className="py-2.5 px-4 rounded-xl border border-slate-200 text-slate-600 font-semibold text-xs sm:text-sm hover:bg-slate-50 flex items-center gap-1 cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>
                  <button
                    onClick={() => {
                      if (preSelectedExams.length === 0) {
                        alert('Please select at least one examination.');
                        return;
                      }
                      setPreStep(3);
                    }}
                    className="py-2.5 px-6 rounded-xl bg-blue-600 text-white font-bold text-xs sm:text-sm hover:bg-blue-700 transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Proceed to Documents</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: CONSOLIDATED DYNAMIC DOCUMENTS */}
            {preStep === 3 && (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Step 3: Consolidated Document Checklist
                  </h3>
                  <p className="text-slate-600 text-xs sm:text-sm mt-1">
                    Based on your selected examinations ({preSelectedExams.join(', ')}), here is your consolidated checklist.
                  </p>
                </div>

                <div className="space-y-3">
                  {[
                    { title: 'Passport Size Photograph', req: 'White background, 10–200 KB JPG' },
                    { title: 'Candidate Signature', req: 'Clear black ink on white paper, 10–50 KB JPG' },
                    { title: 'Identity Proof (Aadhaar / Passport / Voter ID)', req: 'Scanned PDF, under 300 KB' },
                    { title: 'Class 10 Marksheet / Birth Proof', req: 'Proof of candidate full name and date of birth' },
                    { title: 'Class 12 Marksheet', req: 'Mandatory for Undergraduate & Professional courses' },
                    { title: 'Graduation Degree / Marksheets', req: 'Required for CAT, XAT, CMAT, SSC CGL' },
                    { title: 'Category Certificate (SC/ST/OBC-NCL/EWS)', req: 'Only if claiming reservation quota' },
                  ].map((docItem, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 flex items-center justify-between gap-3"
                    >
                      <div>
                        <p className="text-xs sm:text-sm font-bold text-slate-900">{docItem.title}</p>
                        <p className="text-[11px] text-slate-500">{docItem.req}</p>
                      </div>
                      <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-1 rounded border border-emerald-200 flex items-center gap-1 shrink-0">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                        Ready
                      </span>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => setPreStep(2)}
                    className="py-2.5 px-4 rounded-xl border border-slate-200 text-slate-600 font-semibold text-xs sm:text-sm hover:bg-slate-50 flex items-center gap-1 cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>
                  <button
                    onClick={() => setPreStep(4)}
                    className="py-2.5 px-6 rounded-xl bg-blue-600 text-white font-bold text-xs sm:text-sm hover:bg-blue-700 transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Proceed to Select Expert</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: SELECT FORM-FILLING EXPERT */}
            {preStep === 4 && (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Step 4: Select Form-Filling Specialist</h3>
                  <p className="text-slate-600 text-xs sm:text-sm mt-1">
                    This verified expert will coordinate all selected examination forms ({preSelectedExams.join(', ')}) with you.
                  </p>
                </div>

                <div className="space-y-4">
                  {applicationExperts
                    .filter((e) => e.roleType === 'pre_exam' || e.roleType === 'both')
                    .map((expert) => {
                      const isSel = preSelectedExpertId === expert.id;
                      return (
                        <div
                          key={expert.id}
                          onClick={() => setPreSelectedExpertId(expert.id)}
                          className={`p-4 sm:p-5 rounded-2xl border cursor-pointer transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                            isSel
                              ? 'border-blue-600 bg-blue-50/50 ring-2 ring-blue-200 shadow-sm'
                              : 'border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-center gap-3.5">
                            <img
                              src={expert.photoUrl}
                              alt={expert.name}
                              className="w-14 h-14 rounded-xl object-cover border border-slate-200 shrink-0"
                            />
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="font-bold text-sm sm:text-base text-slate-900">{expert.name}</h4>
                                <span className="text-[10px] bg-blue-50 text-blue-700 font-bold px-1.5 py-0.5 rounded">
                                  {expert.experienceYears}+ Yrs Exp
                                </span>
                              </div>
                              <p className="text-xs text-slate-600 mt-0.5">{expert.qualification}</p>
                              <p className="text-xs text-slate-500 mt-1">
                                <span className="font-semibold text-slate-700">Examinations:</span>{' '}
                                {expert.examinationsHandled.join(', ')}
                              </p>
                            </div>
                          </div>

                          <div className="text-right shrink-0">
                            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                              Assigned Coordinator
                            </span>
                            <div className="mt-2">
                              <span
                                className={`px-4 py-1.5 rounded-lg text-xs font-bold ${
                                  isSel ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'
                                }`}
                              >
                                {isSel ? 'Selected' : 'Select Expert'}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => setPreStep(3)}
                    className="py-2.5 px-4 rounded-xl border border-slate-200 text-slate-600 font-semibold text-xs sm:text-sm hover:bg-slate-50 flex items-center gap-1 cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>
                  <button
                    onClick={() => setPreStep(5)}
                    className="py-2.5 px-6 rounded-xl bg-blue-600 text-white font-bold text-xs sm:text-sm hover:bg-blue-700 transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Proceed to Summary & Pay</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 5: BOOK CONSULTATION AND PAY */}
            {preStep === 5 && (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Step 5: Booking Summary & Payment</h3>
                  <p className="text-slate-600 text-xs sm:text-sm mt-1">
                    Review your application package details and confirmed consultation.
                  </p>
                </div>

                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="text-slate-500">Selected Examinations:</span>
                    <span className="font-bold text-slate-900">{preSelectedExams.join(', ')}</span>
                  </div>
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="text-slate-500">Total Form Applications:</span>
                    <span className="font-semibold">{preSelectedExams.length} Application(s)</span>
                  </div>
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="text-slate-500">QuickTeach Expert Form-Filling Service Fee:</span>
                    <span className="font-bold text-slate-900">
                      ₹{preSelectedExams.length > 1 ? editablePricing.preExamMulti : editablePricing.preExamSingle}
                    </span>
                  </div>
                  <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-900">
                    <span className="font-bold">Official Exam Body Notice:</span> Official exam registration fees (e.g. ₹2,400 for CAT, ₹1,750 for CUET) are paid directly on the official portal by you or via verified payment link. QuickTeach charges only for guidance & form preparation.
                  </div>
                  <div className="pt-3 border-t border-slate-200 flex justify-between text-base font-black text-slate-900">
                    <span>Total Service Fee:</span>
                    <span className="text-blue-600">
                      ₹{preSelectedExams.length > 1 ? editablePricing.preExamMulti : editablePricing.preExamSingle}
                    </span>
                  </div>
                </div>

                {preSuccessApp ? (
                  <div className="p-5 bg-emerald-50 rounded-xl border border-emerald-200 text-center space-y-3">
                    <CheckCircle className="w-8 h-8 text-emerald-600 mx-auto" />
                    <h4 className="font-bold text-slate-900">Request Registered Successfully!</h4>
                    <p className="text-xs text-slate-600">
                      Assigned specialist <span className="font-bold">{preSuccessApp.expertName}</span> has received your dossier. You will receive an official draft for review before submission.
                    </p>
                    <button
                      onClick={() => {
                        setActiveTab('dashboard');
                        setDashboardSubTab('pre-exam');
                      }}
                      className="py-2 px-4 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors"
                    >
                      Track in Student Dashboard
                    </button>
                  </div>
                ) : (
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <button
                      onClick={() => setPreStep(4)}
                      className="py-2.5 px-4 rounded-xl border border-slate-200 text-slate-600 font-semibold text-xs sm:text-sm hover:bg-slate-50 flex items-center gap-1 cursor-pointer"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Back</span>
                    </button>
                    <button
                      onClick={handleConfirmPreExam}
                      className="py-3 px-8 rounded-xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 transition-colors shadow-md flex items-center gap-2 cursor-pointer"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>Confirm & Book Assistance</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* VIEW 4: SERVICE 3 — AFTER EXAM ADMISSION ASSISTANCE        */}
        {/* ========================================================= */}
        {activeTab === 'service-post-exam' && (
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                    Service 3: Post-Examination Admission Guidance
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                    Your Score Is Just the Beginning. Find the Right College.
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1">
                    Understand your admission opportunities, compare colleges, track application deadlines and complete the admission process with an expert.
                  </p>
                </div>
                <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">
                  Step {postStep} of 6
                </span>
              </div>

              {/* Progress Track */}
              <div className="grid grid-cols-6 gap-2">
                {[1, 2, 3, 4, 5, 6].map((st) => (
                  <div
                    key={st}
                    className={`h-2 rounded-full transition-all ${
                      st === postStep ? 'bg-indigo-600 ring-2 ring-indigo-200' : st < postStep ? 'bg-emerald-500' : 'bg-slate-200'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* STEP 1: STUDENT DETAILS */}
            {postStep === 1 && (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
                <h3 className="text-lg font-bold text-slate-900">Step 1: Student Details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Student Name</label>
                    <input
                      type="text"
                      value={postStudentName}
                      onChange={(e) => setPostStudentName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Class / Qualification</label>
                    <input
                      type="text"
                      value={postQualification}
                      onChange={(e) => setPostQualification(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Stream</label>
                    <input
                      type="text"
                      value={postStream}
                      onChange={(e) => setPostStream(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Examination Appeared For</label>
                    <select
                      value={postExamAppeared}
                      onChange={(e) => setPostExamAppeared(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium"
                    >
                      <option value="CUET UG">CUET UG</option>
                      <option value="JEE Main">JEE Main</option>
                      <option value="JEE Advanced">JEE Advanced</option>
                      <option value="NEET UG">NEET UG</option>
                      <option value="CAT">CAT</option>
                      <option value="XAT">XAT</option>
                      <option value="CMAT">CMAT</option>
                      <option value="CLAT">CLAT</option>
                      <option value="SSC CGL">SSC CGL (Recruitment Next-Stage)</option>
                      <option value="UPSC Civil Services">UPSC Civil Services (DAF Next-Stage)</option>
                      <option value="Other">Other Examination</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Examination Year</label>
                    <input
                      type="text"
                      value={postExamYear}
                      onChange={(e) => setPostExamYear(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Result Status</label>
                    <select
                      value={postResultStatus}
                      onChange={(e) => setPostResultStatus(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium"
                    >
                      <option value="Score / Rank received">Score / Rank received</option>
                      <option value="Result declared">Result declared</option>
                      <option value="Waiting for official answer key">Waiting for official answer key</option>
                      <option value="Waiting for counselling notification">Waiting for counselling notification</option>
                    </select>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-end">
                  <button
                    onClick={() => setPostStep(2)}
                    className="py-2.5 px-6 rounded-xl bg-indigo-600 text-white font-bold text-sm hover:bg-indigo-700 transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Proceed to Exam Scores</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: EXAMINATION DETAILS */}
            {postStep === 2 && (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
                <h3 className="text-lg font-bold text-slate-900">Step 2: Examination Details & Metrics</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Score Obtained</label>
                    <input
                      type="text"
                      value={postScore}
                      onChange={(e) => setPostScore(e.target.value)}
                      placeholder="e.g. 618 / 720"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Rank (CRL / Category)</label>
                    <input
                      type="text"
                      value={postRank}
                      onChange={(e) => setPostRank(e.target.value)}
                      placeholder="e.g. AIR 14,890"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Percentile</label>
                    <input
                      type="text"
                      value={postPercentile}
                      onChange={(e) => setPostPercentile(e.target.value)}
                      placeholder="e.g. 98.4 %ile"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Category</label>
                    <select
                      value={postCategory}
                      onChange={(e) => setPostCategory(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium"
                    >
                      <option value="General">General / Open</option>
                      <option value="OBC-NCL">OBC-NCL</option>
                      <option value="EWS">EWS</option>
                      <option value="SC">SC</option>
                      <option value="ST">ST</option>
                      <option value="PwD">PwD</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">State Domicile</label>
                    <input
                      type="text"
                      value={postDomicile}
                      onChange={(e) => setPostDomicile(e.target.value)}
                      placeholder="e.g. Maharashtra, Delhi"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Target Course</label>
                    <input
                      type="text"
                      value={postTargetCourse}
                      onChange={(e) => setPostTargetCourse(e.target.value)}
                      placeholder="e.g. MBBS, B.Tech CSE, MBA"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => setPostStep(1)}
                    className="py-2.5 px-4 rounded-xl border border-slate-200 text-slate-600 font-semibold text-xs sm:text-sm hover:bg-slate-50 flex items-center gap-1 cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>
                  <button
                    onClick={() => setPostStep(3)}
                    className="py-2.5 px-6 rounded-xl bg-indigo-600 text-white font-bold text-xs sm:text-sm hover:bg-indigo-700 transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Proceed to Help Needs</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: WHAT HELP DO YOU NEED? */}
            {postStep === 3 && (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Step 3: What help do you need?</h3>
                  <p className="text-slate-600 text-xs sm:text-sm mt-1">
                    Select all admission assistance areas you need help with. Multiple selections allowed.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    'College prediction and shortlisting',
                    'Previous-year cut-off analysis',
                    'College application form filling',
                    'Counselling registration',
                    'College preference and choice filling',
                    'Document verification',
                    'Seat allotment and admission guidance',
                    'MBA college application assistance',
                    'Government recruitment next-stage assistance',
                  ].map((helpItem) => {
                    const isSel = postHelpSelected.includes(helpItem);
                    return (
                      <button
                        key={helpItem}
                        type="button"
                        onClick={() => {
                          if (isSel) setPostHelpSelected(postHelpSelected.filter((h) => h !== helpItem));
                          else setPostHelpSelected([...postHelpSelected, helpItem]);
                        }}
                        className={`p-3.5 rounded-xl border text-left text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-2.5 ${
                          isSel
                            ? 'border-indigo-600 bg-indigo-50 text-indigo-950 ring-2 ring-indigo-200'
                            : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                            isSel ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-300'
                          }`}
                        >
                          {isSel && <Check className="w-3 h-3" />}
                        </div>
                        <span>{helpItem}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => setPostStep(2)}
                    className="py-2.5 px-4 rounded-xl border border-slate-200 text-slate-600 font-semibold text-xs sm:text-sm hover:bg-slate-50 flex items-center gap-1 cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>
                  <button
                    onClick={() => setPostStep(4)}
                    className="py-2.5 px-6 rounded-xl bg-indigo-600 text-white font-bold text-xs sm:text-sm hover:bg-indigo-700 transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Proceed to Select Package</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: SELECT 15-DAY ASSISTANCE OR ONE-TO-ONE SESSION */}
            {postStep === 4 && (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Step 4: Select 15-Day Assistance or One-to-One Session
                  </h3>
                  <p className="text-slate-600 text-xs sm:text-sm mt-1">
                    Choose between a single focused consultation or complete dedicated 15-day guidance.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Option A: One-Time Session */}
                  <div
                    onClick={() => setPostServiceType('one_time')}
                    className={`p-6 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                      postServiceType === 'one_time'
                        ? 'border-indigo-600 bg-indigo-50/40 ring-2 ring-indigo-200'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div>
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                        Choice A
                      </span>
                      <h4 className="text-lg font-bold text-slate-900">One-Time Admission Counselling</h4>
                      <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                        A single dedicated 45-minute consultation to analyze your rank, predict safe colleges, and clear doubts.
                      </p>
                      <ul className="mt-4 space-y-2 text-xs text-slate-600">
                        <li className="flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5 text-indigo-600" />
                          <span>45 Minutes Video / In-Person Consultation</span>
                        </li>
                        <li className="flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5 text-indigo-600" />
                          <span>College shortlist & cut-off summary</span>
                        </li>
                      </ul>
                    </div>
                    <div className="mt-5 pt-4 border-t border-slate-200 flex justify-between items-center">
                      <span className="text-xs text-slate-400">One-time fee</span>
                      <span className="text-lg font-black text-slate-900">₹{editablePricing.oneToOne45Min}</span>
                    </div>
                  </div>

                  {/* Option B: Complete 15-Day Package */}
                  <div
                    onClick={() => setPostServiceType('15_day')}
                    className={`p-6 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between relative overflow-hidden ${
                      postServiceType === '15_day'
                        ? 'border-indigo-600 bg-indigo-50/70 ring-2 ring-indigo-200 shadow-md'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="absolute top-0 right-0 bg-indigo-600 text-white text-[10px] font-bold uppercase px-3 py-1 rounded-bl-lg">
                      Recommended
                    </div>
                    <div>
                      <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider block mb-1">
                        Choice B
                      </span>
                      <h4 className="text-lg font-bold text-slate-900">Complete 15-Day Admission Assistance</h4>
                      <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                        Dedicated mentor covers your entire choice filling window, tracking mock allotments, document verification, and seat locking.
                      </p>
                      <ul className="mt-4 space-y-2 text-xs text-slate-700 font-medium">
                        <li className="flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5 text-indigo-600" />
                          <span>One Dedicated Admission Expert</span>
                        </li>
                        <li className="flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5 text-indigo-600" />
                          <span>Application & Deadline Tracker</span>
                        </li>
                        <li className="flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5 text-indigo-600" />
                          <span>Choice-Filling Priority Matrix Optimization</span>
                        </li>
                        <li className="flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5 text-indigo-600" />
                          <span>Daily updates & final status report</span>
                        </li>
                      </ul>
                    </div>
                    <div className="mt-5 pt-4 border-t border-slate-200 flex justify-between items-center">
                      <span className="text-xs text-slate-400">15-Day Package Fee</span>
                      <span className="text-lg font-black text-indigo-700">₹{editablePricing.postExamUG15Day}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => setPostStep(3)}
                    className="py-2.5 px-4 rounded-xl border border-slate-200 text-slate-600 font-semibold text-xs sm:text-sm hover:bg-slate-50 flex items-center gap-1 cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>
                  <button
                    onClick={() => setPostStep(5)}
                    className="py-2.5 px-6 rounded-xl bg-indigo-600 text-white font-bold text-xs sm:text-sm hover:bg-indigo-700 transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Proceed to Expert Selection</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 5: EXPERT SELECTION */}
            {postStep === 5 && (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Step 5: Select Dedicated Admission Mentor</h3>
                  <p className="text-slate-600 text-xs sm:text-sm mt-1">
                    Specialists matching your examination ({postExamAppeared}) and target course ({postTargetCourse}).
                  </p>
                </div>

                <div className="space-y-4">
                  {applicationExperts
                    .filter((e) => e.roleType === 'post_exam' || e.roleType === 'both')
                    .map((expert) => {
                      const isSel = postSelectedExpertId === expert.id;
                      return (
                        <div
                          key={expert.id}
                          onClick={() => setPostSelectedExpertId(expert.id)}
                          className={`p-4 sm:p-5 rounded-2xl border cursor-pointer transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                            isSel
                              ? 'border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-200 shadow-sm'
                              : 'border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-center gap-3.5">
                            <img
                              src={expert.photoUrl}
                              alt={expert.name}
                              className="w-14 h-14 rounded-xl object-cover border border-slate-200 shrink-0"
                            />
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="font-bold text-sm sm:text-base text-slate-900">{expert.name}</h4>
                                <span className="text-[10px] bg-indigo-50 text-indigo-700 font-bold px-1.5 py-0.5 rounded">
                                  {expert.experienceYears}+ Yrs Exp
                                </span>
                              </div>
                              <p className="text-xs text-slate-600 mt-0.5">{expert.qualification}</p>
                              <p className="text-xs text-slate-500 mt-1">
                                <span className="font-semibold text-slate-700">Specialisation:</span>{' '}
                                {expert.specialisation}
                              </p>
                            </div>
                          </div>

                          <div className="text-right shrink-0">
                            <span className="text-xs font-semibold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded">
                              {postServiceType === '15_day' ? '15-Day Lead Mentor' : 'Consultant'}
                            </span>
                            <div className="mt-2">
                              <span
                                className={`px-4 py-1.5 rounded-lg text-xs font-bold ${
                                  isSel ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700'
                                }`}
                              >
                                {isSel ? 'Selected' : 'Select'}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => setPostStep(4)}
                    className="py-2.5 px-4 rounded-xl border border-slate-200 text-slate-600 font-semibold text-xs sm:text-sm hover:bg-slate-50 flex items-center gap-1 cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>
                  <button
                    onClick={() => setPostStep(6)}
                    className="py-2.5 px-6 rounded-xl bg-indigo-600 text-white font-bold text-xs sm:text-sm hover:bg-indigo-700 transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Proceed to Confirmation</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 6: PAYMENT AND CONFIRMATION */}
            {postStep === 6 && (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Step 6: Payment & Package Confirmation</h3>
                  <p className="text-slate-600 text-xs sm:text-sm mt-1">
                    Review your admission assistance package and start your 15-day coverage.
                  </p>
                </div>

                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="text-slate-500">Service Plan:</span>
                    <span className="font-bold text-slate-900">
                      {postServiceType === '15_day'
                        ? '15-Day Dedicated Admission Package'
                        : 'One-Time Admission Consultation'}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="text-slate-500">Examination & Target:</span>
                    <span className="font-semibold text-slate-900">
                      {postExamAppeared} ({postTargetCourse})
                    </span>
                  </div>
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="text-slate-500">Assigned Mentor:</span>
                    <span className="font-semibold text-slate-900">
                      {applicationExperts.find((e) => e.id === postSelectedExpertId)?.name || 'Lead Specialist'}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="text-slate-500">15-Day Package Duration:</span>
                    <span className="font-semibold text-indigo-700">
                      Starts on confirmation (15 Days Active Support)
                    </span>
                  </div>
                  <div className="pt-3 border-t border-slate-200 flex justify-between text-base font-black text-slate-900">
                    <span>Total Payable:</span>
                    <span className="text-indigo-600">
                      ₹{postServiceType === '15_day' ? editablePricing.postExamUG15Day : editablePricing.oneToOne45Min}
                    </span>
                  </div>
                </div>

                {postSuccessApp ? (
                  <div className="p-5 bg-emerald-50 rounded-xl border border-emerald-200 text-center space-y-3">
                    <CheckCircle className="w-8 h-8 text-emerald-600 mx-auto" />
                    <h4 className="font-bold text-slate-900">15-Day Support Activated!</h4>
                    <p className="text-xs text-slate-600">
                      Assigned mentor <span className="font-bold">{postSuccessApp.expertName}</span> is setting up your college tracker and cut-off matrix.
                    </p>
                    <button
                      onClick={() => {
                        setActiveTab('dashboard');
                        setDashboardSubTab('post-exam');
                      }}
                      className="py-2 px-4 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors"
                    >
                      Open 15-Day Tracker in Dashboard
                    </button>
                  </div>
                ) : (
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <button
                      onClick={() => setPostStep(5)}
                      className="py-2.5 px-4 rounded-xl border border-slate-200 text-slate-600 font-semibold text-xs sm:text-sm hover:bg-slate-50 flex items-center gap-1 cursor-pointer"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Back</span>
                    </button>
                    <button
                      onClick={handleConfirmPostExam}
                      className="py-3 px-8 rounded-xl bg-indigo-600 text-white font-bold text-sm hover:bg-indigo-700 transition-colors shadow-md flex items-center gap-2 cursor-pointer"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>Activate 15-Day Support</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* VIEW 5: STUDENT DASHBOARD (3 TABS)                         */}
        {/* ========================================================= */}
        {activeTab === 'dashboard' && (
          <div className="max-w-5xl mx-auto space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Student Application Dashboard</h2>
                  <p className="text-slate-600 text-xs sm:text-sm mt-1">
                    Track your booked 1-on-1 counselling sessions, pre-exam form applications, and 15-day post-exam packages.
                  </p>
                </div>

                {/* Sub Tab Switcher */}
                <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
                  <button
                    onClick={() => setDashboardSubTab('one-to-one')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      dashboardSubTab === 'one-to-one'
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    1-on-1 Sessions ({admissionBookings.length})
                  </button>
                  <button
                    onClick={() => setDashboardSubTab('pre-exam')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      dashboardSubTab === 'pre-exam'
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Pre-Exam ({preExamApplications.length})
                  </button>
                  <button
                    onClick={() => setDashboardSubTab('post-exam')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      dashboardSubTab === 'post-exam'
                        ? 'bg-white text-indigo-600 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Post-Exam 15-Day ({postExamApplications.length})
                  </button>
                </div>
              </div>
            </div>

            {/* TAB 1: 1-ON-1 ADMISSION SESSIONS */}
            {dashboardSubTab === 'one-to-one' && (
              <div className="space-y-4">
                {admissionBookings.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center">
                    <Users className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                    <p className="text-slate-500 text-sm">No 1-on-1 admission sessions booked yet.</p>
                    <button
                      onClick={() => {
                        setActiveTab('service-one-to-one');
                        setOtoStep(1);
                      }}
                      className="mt-3 px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl"
                    >
                      Book 1-on-1 Counsellor
                    </button>
                  </div>
                ) : (
                  admissionBookings.map((bkg) => (
                    <div
                      key={bkg.id}
                      className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                        <div className="flex items-center gap-3">
                          <img
                            src={bkg.counsellorPhoto}
                            alt={bkg.counsellorName}
                            className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-bold text-slate-900 text-base">{bkg.counsellorName}</h4>
                              <span
                                className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                                  bkg.status === 'completed'
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                    : 'bg-blue-50 text-blue-700 border border-blue-200'
                                }`}
                              >
                                {bkg.status === 'completed' ? 'Completed & Dossier Ready' : 'Confirmed Upcoming'}
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 mt-0.5">
                              Student: <span className="font-semibold text-slate-800">{bkg.studentName}</span> ({bkg.grade}, {bkg.stream})
                            </p>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="text-xs font-bold text-slate-700 block">
                            {bkg.date} • {bkg.timeSlot}
                          </span>
                          <span className="text-xs text-slate-400 capitalize">
                            Format: {bkg.format} • {bkg.durationMinutes} mins
                          </span>
                        </div>
                      </div>

                      <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                        <div className="flex flex-wrap gap-1.5">
                          {bkg.examDetails.selectedExams?.map((ex) => (
                            <span key={ex} className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium">
                              {ex}
                            </span>
                          ))}
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setInspectedBooking(bkg)}
                            className="px-3.5 py-1.5 rounded-xl bg-blue-50 text-blue-700 font-bold hover:bg-blue-100 transition-colors cursor-pointer flex items-center gap-1.5"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>View Guidance Dossier</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* TAB 2: PRE-EXAM FORM APPLICATIONS */}
            {dashboardSubTab === 'pre-exam' && (
              <div className="space-y-4">
                {preExamApplications.map((app) => (
                  <div
                    key={app.id}
                    className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-slate-900 text-base">{app.studentName}</h4>
                          <span className="text-xs text-slate-400 font-mono">({app.id})</span>
                          <span
                            className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full ${
                              app.status === 'awaiting_student_approval'
                                ? 'bg-amber-100 text-amber-800'
                                : app.status === 'confirmation_received' || app.status === 'submitted'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {app.status.replace(/_/g, ' ')}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 mt-1">
                          Examinations: <span className="font-bold text-slate-900">{app.targetExams.join(', ')}</span>
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="text-xs text-slate-500">Assigned Coordinator:</span>
                        <p className="text-sm font-bold text-slate-800">{app.expertName}</p>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200">
                      <span className="font-semibold text-slate-700">Status Update:</span> {app.notes}
                    </p>

                    {/* Action Row */}
                    <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2">
                        {app.registrationNumber && (
                          <span className="bg-emerald-50 text-emerald-800 font-bold px-2 py-1 rounded border border-emerald-200">
                            Reg: {app.registrationNumber}
                          </span>
                        )}
                        {app.confirmationReceipt && (
                          <span className="bg-slate-100 text-slate-700 font-medium px-2 py-1 rounded flex items-center gap-1">
                            <Download className="w-3 h-3 text-slate-500" />
                            {app.confirmationReceipt}
                          </span>
                        )}
                      </div>

                      {app.status === 'awaiting_student_approval' && (
                        <button
                          onClick={() => setReviewAppModal(app)}
                          className="px-4 py-2 rounded-xl bg-amber-500 text-white font-bold hover:bg-amber-600 transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Review Draft & Authorize Submission</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* TAB 3: POST-EXAM 15-DAY ADMISSION PACKAGES */}
            {dashboardSubTab === 'post-exam' && (
              <div className="space-y-4">
                {postExamApplications.map((postApp) => (
                  <div
                    key={postApp.id}
                    className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-slate-900 text-base">{postApp.packageTitle}</h4>
                          <span className="text-xs bg-indigo-50 text-indigo-700 font-bold px-2 py-0.5 rounded border border-indigo-200">
                            {postApp.daysRemaining} Days Left
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">
                          Candidate: <span className="font-semibold text-slate-800">{postApp.studentName}</span> • Exam:{' '}
                          <span className="font-bold text-slate-900">{postApp.examName}</span> ({postApp.score || postApp.percentile})
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="text-xs text-slate-400">Dedicated Mentor</span>
                        <p className="text-sm font-bold text-slate-900">{postApp.expertName}</p>
                      </div>
                    </div>

                    {/* Timeline Preview */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
                      {postApp.timelineEvents.map((event, idx) => (
                        <div
                          key={idx}
                          className={`p-2.5 rounded-xl border text-xs ${
                            event.isCompleted
                              ? 'bg-emerald-50/60 border-emerald-200 text-emerald-900'
                              : 'bg-slate-50 border-slate-200 text-slate-600'
                          }`}
                        >
                          <span className="font-bold text-[10px] uppercase block text-slate-400">
                            {event.dayRange}
                          </span>
                          <span className="font-bold block mt-0.5">{event.title}</span>
                        </div>
                      ))}
                    </div>

                    {/* Tracked Colleges */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-slate-500 font-medium">
                        Tracked Choices: {postApp.trackedColleges.map((c) => c.institutionName).join(' | ')}
                      </span>
                      <button
                        onClick={() => alert(`Your mentor ${postApp.expertName} has logged daily updates. All deadlines are actively tracked.`)}
                        className="text-indigo-600 font-bold hover:underline cursor-pointer"
                      >
                        Request Priority Call
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* VIEW 6: ADMIN PRICING & FEE CONFIGURATION                  */}
        {/* ========================================================= */}
        {activeTab === 'admin-pricing' && (
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Admission Counselling Pricing Manager</h2>
                  <p className="text-slate-600 text-xs sm:text-sm mt-1">
                    Configure official parent-facing rates across all three admission counselling tiers.
                  </p>
                </div>
                {pricingSavedToast && (
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" />
                    Rates Updated!
                  </span>
                )}
              </div>

              <div className="space-y-6">
                {/* 1-on-1 Rates */}
                <div>
                  <h4 className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-3">
                    1. One-to-One Admission Session Rates (INR)
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">30 Minutes Fee</label>
                      <input
                        type="number"
                        value={editablePricing.oneToOne30Min}
                        onChange={(e) =>
                          setEditablePricing({ ...editablePricing, oneToOne30Min: Number(e.target.value) })
                        }
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">45 Minutes Fee</label>
                      <input
                        type="number"
                        value={editablePricing.oneToOne45Min}
                        onChange={(e) =>
                          setEditablePricing({ ...editablePricing, oneToOne45Min: Number(e.target.value) })
                        }
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">60 Minutes Fee</label>
                      <input
                        type="number"
                        value={editablePricing.oneToOne60Min}
                        onChange={(e) =>
                          setEditablePricing({ ...editablePricing, oneToOne60Min: Number(e.target.value) })
                        }
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold text-slate-900"
                      />
                    </div>
                  </div>
                </div>

                {/* Pre-Exam Rates */}
                <div>
                  <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-3">
                    2. Before Exam Form Filling Rates (INR)
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Single Exam Application Fee</label>
                      <input
                        type="number"
                        value={editablePricing.preExamSingle}
                        onChange={(e) =>
                          setEditablePricing({ ...editablePricing, preExamSingle: Number(e.target.value) })
                        }
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Multi-Exam Bundle Fee</label>
                      <input
                        type="number"
                        value={editablePricing.preExamMulti}
                        onChange={(e) =>
                          setEditablePricing({ ...editablePricing, preExamMulti: Number(e.target.value) })
                        }
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold text-slate-900"
                      />
                    </div>
                  </div>
                </div>

                {/* Post-Exam Rates */}
                <div>
                  <h4 className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-3">
                    3. After Exam 15-Day Packages (INR)
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">UG 15-Day Package</label>
                      <input
                        type="number"
                        value={editablePricing.postExamUG15Day}
                        onChange={(e) =>
                          setEditablePricing({ ...editablePricing, postExamUG15Day: Number(e.target.value) })
                        }
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">MBA 15-Day Package</label>
                      <input
                        type="number"
                        value={editablePricing.postExamMBA15Day}
                        onChange={(e) =>
                          setEditablePricing({ ...editablePricing, postExamMBA15Day: Number(e.target.value) })
                        }
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Govt 15-Day Package</label>
                      <input
                        type="number"
                        value={editablePricing.postExamGovt15Day}
                        onChange={(e) =>
                          setEditablePricing({ ...editablePricing, postExamGovt15Day: Number(e.target.value) })
                        }
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold text-slate-900"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-end">
                  <button
                    onClick={handleSavePricing}
                    className="py-3 px-6 rounded-xl bg-slate-900 text-white font-bold text-sm hover:bg-slate-800 transition-colors cursor-pointer flex items-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Save & Publish Rates</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================= */}
      {/* MODAL: COMPARE UP TO 3 COUNSELLORS SIDE-BY-SIDE           */}
      {/* ========================================================= */}
      {showComparisonModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Compare Selected Admission Counsellors</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Side-by-side evaluation of qualifications, fees, and examination specialisation.
                </p>
              </div>
              <button
                onClick={() => setShowComparisonModal(false)}
                className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {admissionCounsellors
                .filter((c) => selectedExpertsForComparison.includes(c.id))
                .map((expert) => (
                  <div key={expert.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
                    <img
                      src={expert.photoUrl}
                      alt={expert.name}
                      className="w-16 h-16 rounded-xl object-cover border border-slate-200 mx-auto"
                    />
                    <div className="text-center">
                      <h4 className="font-bold text-slate-900 text-sm">{expert.name}</h4>
                      <p className="text-xs text-slate-500">{expert.qualifications}</p>
                    </div>

                    <div className="text-xs space-y-1.5 pt-2 border-t border-slate-200">
                      <div>
                        <span className="text-slate-400 block font-medium">Experience:</span>
                        <span className="font-bold text-slate-800">{expert.experienceYears} Years</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block font-medium">Exam Specialisations:</span>
                        <span className="font-semibold text-slate-700">{expert.examSpecialisations.join(', ')}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block font-medium">Languages:</span>
                        <span className="font-semibold text-slate-700">{expert.languages.join(', ')}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block font-medium">45-min Session Fee:</span>
                        <span className="font-black text-blue-600 text-sm">₹{editablePricing.oneToOne45Min}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setOtoSelectedExpertId(expert.id);
                        setShowComparisonModal(false);
                        setOtoStep(6);
                      }}
                      className="w-full py-2 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Book With {expert.name.split(' ')[0]}
                    </button>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: STUDENT DRAFT REVIEW & EXPLICIT SUBMISSION APPROVAL */}
      {/* ========================================================= */}
      {reviewAppModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Student Verification & Official Submission Approval
                </h3>
                <p className="text-xs text-slate-500">
                  Application ID: <span className="font-mono font-bold text-slate-800">{reviewAppModal.id}</span>
                </p>
              </div>
              <button
                onClick={() => setReviewAppModal(null)}
                className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Student Name:</span>
                <span className="font-bold text-slate-900">{reviewAppModal.studentName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Target Examinations:</span>
                <span className="font-bold text-blue-600">{reviewAppModal.targetExams.join(', ')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Assigned Form Specialist:</span>
                <span className="font-bold text-slate-800">{reviewAppModal.expertName}</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1.5">
              <p className="font-bold">Mandatory QuickTeach Protocol:</p>
              <p>
                Our experts never share your passwords, OTPs, or private credentials. Before any registration is finalized on the official portal, you must inspect the preview draft and grant explicit authorization below.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={studentDraftAgreement}
                  onChange={(e) => setStudentDraftAgreement(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                />
                <span className="text-xs text-slate-700 leading-relaxed">
                  I have thoroughly reviewed the uploaded academic documents, personal details, category selections, and exam centre preferences. I hereby authorize the official submission of my application.
                </span>
              </label>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
              <button
                onClick={() => setReviewAppModal(null)}
                className="py-2 px-4 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                disabled={!studentDraftAgreement}
                onClick={() => handleApproveDraft(reviewAppModal.id)}
                className={`py-2 px-5 rounded-xl text-xs font-bold text-white transition-all ${
                  studentDraftAgreement
                    ? 'bg-emerald-600 hover:bg-emerald-700 shadow-md cursor-pointer'
                    : 'bg-slate-300 cursor-not-allowed'
                }`}
              >
                Authorize & Confirm Official Submission
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: VIEW FULL POST-SESSION GUIDANCE DOSSIER             */}
      {/* ========================================================= */}
      {inspectedBooking && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Personalised Admission Guidance Dossier
                </h3>
                <p className="text-xs text-slate-500">
                  Session ID: <span className="font-mono font-bold text-slate-800">{inspectedBooking.id}</span> • Counsellor: {inspectedBooking.counsellorName}
                </p>
              </div>
              <button
                onClick={() => setInspectedBooking(null)}
                className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200">
                <h5 className="font-bold text-blue-900 uppercase tracking-wider mb-2">Recommended Pathways</h5>
                <ul className="space-y-1.5 text-slate-700">
                  {inspectedBooking.postSessionSummary?.recommendedPathways.map((p, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <Check className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-indigo-50/60 border border-indigo-200">
                <h5 className="font-bold text-indigo-900 uppercase tracking-wider mb-2">Suitable Colleges & Cut-Offs</h5>
                <ul className="space-y-1.5 text-slate-700">
                  {inspectedBooking.postSessionSummary?.suitableColleges.map((c, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 mt-1.5 shrink-0"></span>
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200 md:col-span-2">
                <h5 className="font-bold text-emerald-900 uppercase tracking-wider mb-2">Eligibility Guidance & Reservation Notes</h5>
                <p className="text-slate-700 leading-relaxed">
                  {inspectedBooking.postSessionSummary?.eligibilityNotes}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200 md:col-span-2">
                <h5 className="font-bold text-amber-900 uppercase tracking-wider mb-2">Upcoming Deadlines & Next Steps</h5>
                <ul className="space-y-1.5 text-slate-700">
                  {inspectedBooking.postSessionSummary?.upcomingDeadlines.map((d, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-200">
              <button
                onClick={() => setInspectedBooking(null)}
                className="py-2 px-5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
