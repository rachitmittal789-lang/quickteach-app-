/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type TeachingFormat = 'online' | 'offline' | 'both';
export type GenderPreference = 'male' | 'female' | 'no_preference';
export type CallMode = 'voice' | 'video';

export type BookingStatus = 
  | 'new_request'
  | 'matching'
  | 'tutor_accepted'
  | 'payment_pending'
  | 'confirmed'
  | 'in_progress'
  | 'completed'
  | 'cancelled';

export type TutorCategory =
  | 'Junior / General School Tutor'
  | 'Standard Subject Specialist'
  | 'Experienced School Faculty'
  | 'Higher Specialist Faculty';

export interface Tutor {
  id: string;
  name: string;
  photoUrl: string;
  qualifications: string;
  university: string;
  experienceYears: number;
  subjects: string[];
  boards: string[];
  classesTaught: string[];
  languages: string[];
  format: TeachingFormat;
  gender: 'male' | 'female';
  rating: number;
  reviewsCount: number;
  hourlyRate: number;
  perMinuteRate: number;
  bio: string;
  methodology: string;
  demoAvailable: boolean;
  cancellationPolicy: string;
  addressServed: string[];
  isVerified: boolean;
  availableSlots: string[];
  category?: TutorCategory;
  etaMinutes?: number;
  isAvailableNow?: boolean;
  travelCharge?: number;
  customQuoteAvailable?: boolean;
}

export interface Booking {
  id: string;
  serviceType: 'instant' | 'scheduled';
  studentName: string;
  age: number;
  grade: string;
  board: string;
  subject: string;
  additionalSubjects?: string[];
  additionalHelp?: string;
  format: 'online' | 'offline';
  address?: string;
  landmark?: string;
  pincode?: string;
  durationHours: number;
  preferredLanguage: string;
  scheduledDate?: string;
  scheduledTimeSlot?: string;
  tutorId?: string;
  tutorName?: string;
  tutorPhoto?: string;
  tutorRate: number;
  platformFee: number;
  travelFee?: number;
  taxes: number;
  totalAmount: number;
  status: BookingStatus;
  paymentMethod?: string;
  paymentId?: string;
  createdAt: string;
  etaMinutes?: number;
}

export interface DoubtSession {
  id: string;
  studentName: string;
  grade: string;
  board: string;
  subject: string;
  language: string;
  doubtType: 'upload' | 'text';
  doubtText: string;
  doubtImageUrl?: string;
  mode: CallMode;
  tutorId: string;
  tutorName: string;
  tutorPhoto: string;
  perMinuteRate: number;
  durationSeconds: number;
  totalCost: number;
  status: 'active' | 'completed' | 'cancelled';
  rating?: number;
  feedback?: string;
  studentNotes?: string;
  timestamp: string;
}

export interface PricingConfig {
  platformFeeFixed: number;
  gstPercent: number;
  baseDoubtPerMinute: number;
  instantMatchingSurcharge: number;
  travelFeeFixed?: number;
  tierRates?: {
    junior: number;
    standard: number;
    experienced: number;
  };
}

export interface StudentChild {
  id: string;
  name: string;
  age: number;
  grade: string;
  board: string;
  schoolName?: string;
}

export interface ParentAccount {
  name: string;
  phone: string;
  email: string;
  children: StudentChild[];
  selectedChildId: string;
}

export interface TutorApplication {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  qualification: string;
  university: string;
  experienceYears: number;
  subjects: string[];
  boards: string[];
  classes: string[];
  languages: string[];
  formatPreference: TeachingFormat;
  citiesServiced: string;
  expectedHourlyRate: number;
  idDocumentName: string;
  degreeDocumentName: string;
  childSafeguardingAccepted: boolean;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
}

export interface CareerCounsellor {
  id: string;
  name: string;
  photoUrl: string;
  qualifications: string;
  experienceYears: number;
  specialisations: string[];
  languages: string[];
  prices: { 30: number; 45: number; 60: number };
  availableSlots: string[];
  isVerified: boolean;
  bio: string;
  formatAvailable: 'online' | 'offline' | 'both';
}

export interface CareerCounsellingBooking {
  id: string;
  studentName: string;
  age: number;
  grade: string;
  board: string;
  stream: string;
  location: string;
  language: string;
  interests: string[];
  biggestConfusion: string;
  counsellorId: string;
  counsellorName: string;
  counsellorPhoto: string;
  date: string;
  timeSlot: string;
  durationMinutes: number;
  sessionPrice: number;
  format: 'online' | 'offline';
  status: 'confirmed' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface AdmissionCounsellor {
  id: string;
  name: string;
  photoUrl: string;
  qualifications: string;
  experienceYears: number;
  examSpecialisations: string[];
  previousExperience: string;
  languages: string[];
  prices: { 30: number; 45: number; 60: number };
  availableSlots: string[];
  isVerified: boolean;
  formatAvailable: 'online' | 'offline' | 'both';
}

export interface AdmissionCounsellingBooking {
  id: string;
  studentName: string;
  age?: number;
  grade: string;
  board: string;
  stream: string;
  targetCourse?: string;
  preferredLocation?: string;
  examDetails: {
    examName?: string;
    selectedExams?: string[];
    score?: string;
    rank?: string;
    percentile?: string;
    category?: string;
    domicile?: string;
    boardMarks?: string;
    year?: string;
    resultStatus?: string;
  };
  selectedServices: string[];
  guidanceNeeds?: string[];
  userNotes?: string;
  counsellorId: string;
  counsellorName: string;
  counsellorPhoto: string;
  format: 'online' | 'offline';
  date: string;
  timeSlot: string;
  durationMinutes: number;
  sessionFee: number;
  status: 'confirmed' | 'completed' | 'cancelled';
  postSessionSummary?: {
    recommendedPathways: string[];
    suitableColleges: string[];
    eligibilityNotes: string;
    upcomingDeadlines: string[];
    recommendedNextSteps: string[];
  };
  createdAt: string;
}

export interface TrackedCollegeApplication {
  id: string;
  collegeName: string;
  course: string;
  formDeadline: string;
  status: 'Pending' | 'Submitted' | 'Shortlisted' | 'Under Review' | 'Admitted';
  nextStep: string;
  categoryQuota?: string;
  cutOffNotes?: string;
}

export type PreExamStatus =
  | 'consultation_pending'
  | 'documents_pending'
  | 'form_in_progress'
  | 'awaiting_student_approval'
  | 'ready_for_submission'
  | 'submitted'
  | 'confirmation_received';

export interface PreExamUploadedDoc {
  id: string;
  docType: string;
  fileName: string;
  fileSize?: string;
  status: 'uploaded' | 'pending' | 'verified';
  uploadDate: string;
}

export interface PreExamApplication {
  id: string;
  studentName: string;
  mobile: string;
  email: string;
  currentQualification: string;
  graduationStatus?: string;
  educationalBackground: string;
  targetExams: string[];
  examYear: string;
  selectedServices: string[];
  documents: PreExamUploadedDoc[];
  expertId?: string;
  expertName?: string;
  expertPhoto?: string;
  expertQualification?: string;
  consultationFee: number;
  scheduledDate?: string;
  scheduledSlot?: string;
  status: PreExamStatus;
  registrationNumber?: string;
  confirmationReceipt?: string;
  studentApproved: boolean;
  notes?: string;
  submissionPortal?: string;
  examDate?: string;
  createdAt: string;
}

export type PostExamCategory = 'undergraduate' | 'mba' | 'government_recruitment';

export interface PostExamTrackedCollege {
  id: string;
  institutionName: string;
  course: string;
  deadline: string;
  status:
    | 'Shortlisted'
    | 'Form In Progress'
    | 'Awaiting Approval'
    | 'Submitted'
    | 'Document Verification'
    | 'Seat Allotted'
    | 'Admitted';
  confirmationReceipt?: string;
  notes?: string;
}

export interface PostExamTimelineEvent {
  dayRange: string;
  title: string;
  description: string;
  isCompleted: boolean;
}

export interface PostExamApplication {
  id: string;
  studentName: string;
  mobile: string;
  email: string;
  categoryType: PostExamCategory;
  examName: string;
  examYear: string;
  score?: string;
  rank?: string;
  percentile?: string;
  categoryQuota?: string;
  domicileState?: string;
  qualification: string;
  targetColleges: string[];
  preferredCourse: string;
  preferredLocation: string;
  selectedHelp: string[];
  packageType: '15_day_ug' | '15_day_mba' | '15_day_govt' | 'custom_multi';
  packageTitle: string;
  packageFee: number;
  startDate: string;
  endDate: string;
  daysRemaining: number;
  expertId: string;
  expertName: string;
  expertPhoto: string;
  expertSpecialisation: string;
  status:
    | 'consultation_booked'
    | 'active_15_day'
    | 'preference_filling'
    | 'allotment_tracking'
    | 'completed';
  trackedColleges: PostExamTrackedCollege[];
  timelineEvents: PostExamTimelineEvent[];
  createdAt: string;
}

export interface ApplicationExpert {
  id: string;
  name: string;
  photoUrl: string;
  experienceYears: number;
  examinationsHandled: string[];
  languages: string[];
  qualification: string;
  consultationFee: number;
  availableSlots: string[];
  rating: number;
  reviewsCount: number;
  specialisation: string;
  isVerified: boolean;
  roleType: 'pre_exam' | 'post_exam' | 'both';
}

export interface AdmissionPackagesPricing {
  oneToOne30Min: number;
  oneToOne45Min: number;
  oneToOne60Min: number;
  preExamSingle: number;
  preExamMulti: number;
  preExamPersonalized: number;
  postExamUG15Day: number;
  postExamMBA15Day: number;
  postExamGovt15Day: number;
  postExamCustomMulti: number;
}

export interface CommunityFollowUp {
  id: string;
  author: string;
  text: string;
  createdAt: string;
  isFaculty?: boolean;
}

export interface CommunityAnswer {
  id: string;
  facultyName: string;
  facultyDesignation: string;
  facultyPhoto?: string;
  isVerifiedFaculty: boolean;
  answerExplanation: string;
  example?: string;
  conclusion?: string;
  diagramUrl?: string;
  createdAt: string;
  followUps?: CommunityFollowUp[];
}

export interface CommunityQuestion {
  id: string;
  studentDisplayName: string;
  grade: string;
  board: string;
  subject: string;
  chapter: string;
  questionText: string;
  questionImageUrl?: string;
  hasAttachment?: boolean;
  status: 'new' | 'assigned' | 'answered' | 'verified' | 'closed';
  answers: CommunityAnswer[];
  createdAt: string;
  upvotes: number;
  assignedFacultyName?: string;
}

