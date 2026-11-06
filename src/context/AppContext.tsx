/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Tutor,
  Booking,
  DoubtSession,
  PricingConfig,
  ParentAccount,
  TutorApplication,
  BookingStatus,
  CareerCounsellor,
  CareerCounsellingBooking,
  AdmissionCounsellor,
  AdmissionCounsellingBooking,
  TrackedCollegeApplication,
  CommunityQuestion,
  CommunityAnswer,
  PreExamApplication,
  PostExamApplication,
  ApplicationExpert,
  AdmissionPackagesPricing,
} from '../types';
import {
  INITIAL_TUTORS,
  INITIAL_BOOKINGS,
  INITIAL_DOUBTS,
  INITIAL_PRICING,
  INITIAL_PARENT_ACCOUNT,
  INITIAL_APPLICATIONS,
  INITIAL_CAREER_COUNSELLORS,
  INITIAL_ADMISSION_COUNSELLORS,
  INITIAL_ADMISSION_BOOKINGS,
  INITIAL_TRACKED_APPLICATIONS,
  INITIAL_COMMUNITY_QUESTIONS,
  INITIAL_APPLICATION_EXPERTS,
  INITIAL_PRE_EXAM_APPLICATIONS,
  INITIAL_POST_EXAM_PACKAGES,
  INITIAL_ADMISSION_PACKAGES_PRICING,
} from '../data/mockData';
import { EDUCATOR_PORTRAITS, sanitizeImageUrl } from '../utils/imageUtils';

export type PageView =
  | 'home'
  | 'instant-tutor'
  | 'book-later'
  | 'doubt-solver'
  | 'live-call'
  | 'career-counselling'
  | 'admission-counselling'
  | 'become-tutor'
  | 'admin'
  | 'parent-portal';

interface AppContextType {
  currentPage: PageView;
  setCurrentPage: (page: PageView) => void;
  tutors: Tutor[];
  bookings: Booking[];
  doubtSessions: DoubtSession[];
  pricingConfig: PricingConfig;
  parentAccount: ParentAccount;
  tutorApplications: TutorApplication[];
  activeDoubtSession: DoubtSession | null;
  setActiveDoubtSession: (session: DoubtSession | null) => void;
  savedTutorIds: string[];
  toggleSaveTutor: (tutorId: string) => void;
  
  // Doubt Tab selector (Instant Expert vs Free Community)
  activeDoubtTab: 'instant_expert' | 'free_community';
  setActiveDoubtTab: (tab: 'instant_expert' | 'free_community') => void;

  // Booking actions
  createInstantBooking: (bookingData: Omit<Booking, 'id' | 'createdAt'>) => Booking;
  createScheduledBooking: (bookingData: Omit<Booking, 'id' | 'createdAt'>) => Booking;
  updateBookingStatus: (bookingId: string, status: BookingStatus) => void;
  
  // Doubt actions
  startDoubtSession: (sessionData: Omit<DoubtSession, 'id' | 'durationSeconds' | 'totalCost' | 'status' | 'timestamp'>) => DoubtSession;
  completeDoubtSession: (id: string, durationSeconds: number, totalCost: number, rating?: number, feedback?: string, studentNotes?: string) => void;
  cancelDoubtSession: (id: string) => void;
  
  // Tutor application actions
  submitTutorApplication: (appData: Omit<TutorApplication, 'id' | 'status' | 'submittedAt'>) => void;
  updateTutorApplicationStatus: (appId: string, status: 'approved' | 'rejected') => void;
  
  // Admin actions
  updatePricingConfig: (newPricing: Partial<PricingConfig>) => void;
  updateTutor: (tutorId: string, updates: Partial<Tutor>) => void;
  
  // Parent actions
  addChildProfile: (child: { name: string; age: number; grade: string; board: string; schoolName?: string }) => void;
  selectChildProfile: (childId: string) => void;

  // Career Counselling
  careerCounsellors: CareerCounsellor[];
  careerBookings: CareerCounsellingBooking[];
  createCareerBooking: (bookingData: Omit<CareerCounsellingBooking, 'id' | 'createdAt'>) => CareerCounsellingBooking;

  // Admission Counselling & Tracker
  admissionCounsellors: AdmissionCounsellor[];
  admissionBookings: AdmissionCounsellingBooking[];
  createAdmissionBooking: (bookingData: Omit<AdmissionCounsellingBooking, 'id' | 'createdAt'>) => AdmissionCounsellingBooking;
  trackedApplications: TrackedCollegeApplication[];
  updateTrackedApplication: (id: string, updates: Partial<TrackedCollegeApplication>) => void;
  addTrackedApplication: (app: Omit<TrackedCollegeApplication, 'id'>) => void;

  // Free Community Q&A
  communityQuestions: CommunityQuestion[];
  askCommunityQuestion: (questionData: Omit<CommunityQuestion, 'id' | 'status' | 'answers' | 'createdAt' | 'upvotes'>) => CommunityQuestion;
  answerCommunityQuestion: (questionId: string, answer: Omit<CommunityAnswer, 'id' | 'createdAt'>) => void;
  addCommunityFollowUp: (questionId: string, answerId: string, text: string, author: string, isFaculty?: boolean) => void;
  upvoteQuestion: (questionId: string) => void;

  // Pre-Exam & Post-Exam Form Filling Services
  preExamApplications: PreExamApplication[];
  addPreExamApplication: (appData: Omit<PreExamApplication, 'id' | 'createdAt'>) => PreExamApplication;
  updatePreExamApplication: (id: string, updates: Partial<PreExamApplication>) => void;
  postExamApplications: PostExamApplication[];
  addPostExamApplication: (appData: Omit<PostExamApplication, 'id' | 'createdAt'>) => PostExamApplication;
  updatePostExamApplication: (id: string, updates: Partial<PostExamApplication>) => void;
  applicationExperts: ApplicationExpert[];
  admissionPricing: AdmissionPackagesPricing;
  updateAdmissionPricing: (updates: Partial<AdmissionPackagesPricing>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentPage, setCurrentPage] = useState<PageView>('home');
  const [activeDoubtTab, setActiveDoubtTab] = useState<'instant_expert' | 'free_community'>('instant_expert');

  // Load from localStorage or defaults
  const [tutors, setTutors] = useState<Tutor[]>(() => {
    try {
      const saved = localStorage.getItem('qt_tutors_v4') || localStorage.getItem('qt_tutors_v3');
      if (saved) {
        const parsed: Tutor[] = JSON.parse(saved);
        return parsed.map((t) => ({
          ...t,
          photoUrl: sanitizeImageUrl(t.photoUrl, t.name),
        }));
      }
      return INITIAL_TUTORS;
    } catch {
      return INITIAL_TUTORS;
    }
  });

  const [bookings, setBookings] = useState<Booking[]>(() => {
    try {
      const saved = localStorage.getItem('qt_bookings');
      if (saved) {
        const parsed: Booking[] = JSON.parse(saved);
        return parsed.map((b) => ({
          ...b,
          tutorPhoto: sanitizeImageUrl(b.tutorPhoto, b.tutorName),
        }));
      }
      return INITIAL_BOOKINGS;
    } catch {
      return INITIAL_BOOKINGS;
    }
  });

  const [doubtSessions, setDoubtSessions] = useState<DoubtSession[]>(() => {
    try {
      const saved = localStorage.getItem('qt_doubts');
      if (saved) {
        const parsed: DoubtSession[] = JSON.parse(saved);
        return parsed.map((d) => ({
          ...d,
          tutorPhoto: sanitizeImageUrl(d.tutorPhoto, d.tutorName),
        }));
      }
      return INITIAL_DOUBTS;
    } catch {
      return INITIAL_DOUBTS;
    }
  });

  const [pricingConfig, setPricingConfig] = useState<PricingConfig>(() => {
    try {
      const saved = localStorage.getItem('qt_pricing_v3');
      return saved ? JSON.parse(saved) : INITIAL_PRICING;
    } catch {
      return INITIAL_PRICING;
    }
  });

  const [parentAccount, setParentAccount] = useState<ParentAccount>(() => {
    try {
      const saved = localStorage.getItem('qt_parent_account');
      return saved ? JSON.parse(saved) : INITIAL_PARENT_ACCOUNT;
    } catch {
      return INITIAL_PARENT_ACCOUNT;
    }
  });

  const [tutorApplications, setTutorApplications] = useState<TutorApplication[]>(() => {
    try {
      const saved = localStorage.getItem('qt_tutor_apps');
      return saved ? JSON.parse(saved) : INITIAL_APPLICATIONS;
    } catch {
      return INITIAL_APPLICATIONS;
    }
  });

  const [savedTutorIds, setSavedTutorIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('qt_saved_tutors');
      return saved ? JSON.parse(saved) : ['tut-1', 'tut-2'];
    } catch {
      return ['tut-1', 'tut-2'];
    }
  });

  const [activeDoubtSession, setActiveDoubtSession] = useState<DoubtSession | null>(null);

  // Career Counselling State
  const [careerCounsellors] = useState<CareerCounsellor[]>(INITIAL_CAREER_COUNSELLORS);
  const [careerBookings, setCareerBookings] = useState<CareerCounsellingBooking[]>(() => {
    try {
      const saved = localStorage.getItem('qt_career_bookings');
      if (saved) {
        const parsed: CareerCounsellingBooking[] = JSON.parse(saved);
        return parsed.map((c) => ({
          ...c,
          counsellorPhoto: sanitizeImageUrl(c.counsellorPhoto, c.counsellorName),
        }));
      }
      return [];
    } catch {
      return [];
    }
  });

  // Admission Counselling State
  const [admissionCounsellors] = useState<AdmissionCounsellor[]>(INITIAL_ADMISSION_COUNSELLORS);
  const [admissionBookings, setAdmissionBookings] = useState<AdmissionCounsellingBooking[]>(() => {
    try {
      const saved = localStorage.getItem('qt_admission_bookings');
      if (saved && JSON.parse(saved).length > 0) {
        const parsed: AdmissionCounsellingBooking[] = JSON.parse(saved);
        return parsed.map((a) => ({
          ...a,
          counsellorPhoto: sanitizeImageUrl(a.counsellorPhoto, a.counsellorName),
        }));
      }
      return INITIAL_ADMISSION_BOOKINGS;
    } catch {
      return INITIAL_ADMISSION_BOOKINGS;
    }
  });
  const [trackedApplications, setTrackedApplications] = useState<TrackedCollegeApplication[]>(() => {
    try {
      const saved = localStorage.getItem('qt_tracked_apps');
      return saved ? JSON.parse(saved) : INITIAL_TRACKED_APPLICATIONS;
    } catch {
      return INITIAL_TRACKED_APPLICATIONS;
    }
  });

  // Free Doubt Community State
  const [communityQuestions, setCommunityQuestions] = useState<CommunityQuestion[]>(() => {
    try {
      const saved = localStorage.getItem('qt_community_questions');
      return saved ? JSON.parse(saved) : INITIAL_COMMUNITY_QUESTIONS;
    } catch {
      return INITIAL_COMMUNITY_QUESTIONS;
    }
  });

  // Pre-Exam and Post-Exam State
  const [preExamApplications, setPreExamApplications] = useState<PreExamApplication[]>(() => {
    try {
      const saved = localStorage.getItem('qt_pre_exam_apps');
      if (saved) {
        const parsed: PreExamApplication[] = JSON.parse(saved);
        return parsed.map((p) => ({
          ...p,
          expertPhoto: p.expertPhoto ? sanitizeImageUrl(p.expertPhoto, p.expertName) : undefined,
        }));
      }
      return INITIAL_PRE_EXAM_APPLICATIONS;
    } catch {
      return INITIAL_PRE_EXAM_APPLICATIONS;
    }
  });

  const [postExamApplications, setPostExamApplications] = useState<PostExamApplication[]>(() => {
    try {
      const saved = localStorage.getItem('qt_post_exam_apps');
      if (saved) {
        const parsed: PostExamApplication[] = JSON.parse(saved);
        return parsed.map((p) => ({
          ...p,
          expertPhoto: sanitizeImageUrl(p.expertPhoto, p.expertName),
        }));
      }
      return INITIAL_POST_EXAM_PACKAGES;
    } catch {
      return INITIAL_POST_EXAM_PACKAGES;
    }
  });

  const [applicationExperts] = useState<ApplicationExpert[]>(INITIAL_APPLICATION_EXPERTS);

  const [admissionPricing, setAdmissionPricing] = useState<AdmissionPackagesPricing>(() => {
    try {
      const saved = localStorage.getItem('qt_admission_pricing');
      return saved ? JSON.parse(saved) : INITIAL_ADMISSION_PACKAGES_PRICING;
    } catch {
      return INITIAL_ADMISSION_PACKAGES_PRICING;
    }
  });

  // Persistence effects
  useEffect(() => {
    localStorage.setItem('qt_pre_exam_apps', JSON.stringify(preExamApplications));
  }, [preExamApplications]);

  useEffect(() => {
    localStorage.setItem('qt_post_exam_apps', JSON.stringify(postExamApplications));
  }, [postExamApplications]);

  useEffect(() => {
    localStorage.setItem('qt_admission_pricing', JSON.stringify(admissionPricing));
  }, [admissionPricing]);
  useEffect(() => {
    localStorage.setItem('qt_tutors_v4', JSON.stringify(tutors));
  }, [tutors]);

  useEffect(() => {
    localStorage.setItem('qt_bookings', JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem('qt_doubts', JSON.stringify(doubtSessions));
  }, [doubtSessions]);

  useEffect(() => {
    localStorage.setItem('qt_pricing_v3', JSON.stringify(pricingConfig));
  }, [pricingConfig]);

  useEffect(() => {
    localStorage.setItem('qt_parent_account', JSON.stringify(parentAccount));
  }, [parentAccount]);

  useEffect(() => {
    localStorage.setItem('qt_tutor_apps', JSON.stringify(tutorApplications));
  }, [tutorApplications]);

  useEffect(() => {
    localStorage.setItem('qt_saved_tutors', JSON.stringify(savedTutorIds));
  }, [savedTutorIds]);

  useEffect(() => {
    localStorage.setItem('qt_career_bookings', JSON.stringify(careerBookings));
  }, [careerBookings]);

  useEffect(() => {
    localStorage.setItem('qt_admission_bookings', JSON.stringify(admissionBookings));
  }, [admissionBookings]);

  useEffect(() => {
    localStorage.setItem('qt_tracked_apps', JSON.stringify(trackedApplications));
  }, [trackedApplications]);

  useEffect(() => {
    localStorage.setItem('qt_community_questions', JSON.stringify(communityQuestions));
  }, [communityQuestions]);

  const toggleSaveTutor = (tutorId: string) => {
    setSavedTutorIds((prev) =>
      prev.includes(tutorId) ? prev.filter((id) => id !== tutorId) : [...prev, tutorId]
    );
  };

  const createInstantBooking = (bookingData: Omit<Booking, 'id' | 'createdAt'>): Booking => {
    const id = `QT-INST-${Math.floor(1000 + Math.random() * 9000)}`;
    const newBooking: Booking = {
      ...bookingData,
      id,
      createdAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
    };
    setBookings((prev) => [newBooking, ...prev]);
    return newBooking;
  };

  const createScheduledBooking = (bookingData: Omit<Booking, 'id' | 'createdAt'>): Booking => {
    const id = `QT-SCH-${Math.floor(1000 + Math.random() * 9000)}`;
    const newBooking: Booking = {
      ...bookingData,
      id,
      createdAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
    };
    setBookings((prev) => [newBooking, ...prev]);
    return newBooking;
  };

  const updateBookingStatus = (bookingId: string, status: BookingStatus) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status } : b))
    );
  };

  const startDoubtSession = (
    sessionData: Omit<DoubtSession, 'id' | 'durationSeconds' | 'totalCost' | 'status' | 'timestamp'>
  ): DoubtSession => {
    const id = `QT-DB-${Math.floor(100 + Math.random() * 900)}`;
    const newSession: DoubtSession = {
      ...sessionData,
      id,
      durationSeconds: 0,
      totalCost: 0,
      status: 'active',
      timestamp: new Date().toISOString().slice(0, 16).replace('T', ' '),
    };
    setActiveDoubtSession(newSession);
    setDoubtSessions((prev) => [newSession, ...prev]);
    return newSession;
  };

  const completeDoubtSession = (
    id: string,
    durationSeconds: number,
    totalCost: number,
    rating?: number,
    feedback?: string,
    studentNotes?: string
  ) => {
    setDoubtSessions((prev) =>
      prev.map((session) =>
        session.id === id
          ? {
              ...session,
              durationSeconds,
              totalCost,
              status: 'completed',
              rating,
              feedback,
              studentNotes,
            }
          : session
      )
    );
    if (activeDoubtSession?.id === id) {
      setActiveDoubtSession(null);
    }
  };

  const cancelDoubtSession = (id: string) => {
    setDoubtSessions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: 'cancelled' } : s))
    );
    if (activeDoubtSession?.id === id) {
      setActiveDoubtSession(null);
    }
  };

  const submitTutorApplication = (
    appData: Omit<TutorApplication, 'id' | 'status' | 'submittedAt'>
  ) => {
    const id = `tut-app-${Date.now()}`;
    const newApp: TutorApplication = {
      ...appData,
      id,
      status: 'pending',
      submittedAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
    };
    setTutorApplications((prev) => [newApp, ...prev]);
  };

  const updateTutorApplicationStatus = (appId: string, status: 'approved' | 'rejected') => {
    setTutorApplications((prev) =>
      prev.map((app) => (app.id === appId ? { ...app, status } : app))
    );

    if (status === 'approved') {
      const app = tutorApplications.find((a) => a.id === appId);
      if (app) {
        const newTutor: Tutor = {
          id: `tut-gen-${Date.now()}`,
          name: app.fullName,
          photoUrl: EDUCATOR_PORTRAITS.ananyaDas,
          qualifications: app.qualification,
          university: app.university,
          experienceYears: app.experienceYears,
          subjects: app.subjects,
          boards: app.boards,
          classesTaught: app.classes,
          languages: app.languages,
          format: app.formatPreference,
          gender: 'female',
          rating: 5.0,
          reviewsCount: 1,
          hourlyRate: app.expectedHourlyRate || 700,
          perMinuteRate: Math.round((app.expectedHourlyRate || 700) / 45),
          bio: `Verified educator from ${app.university} specializing in ${app.subjects.join(', ')}.`,
          methodology: 'Structured problem sets, concept deconstruction, and regular performance review.',
          demoAvailable: true,
          cancellationPolicy: 'Free cancellation up to 4 hours prior.',
          addressServed: [app.citiesServiced || 'Online Worldwide'],
          isVerified: true,
          availableSlots: ['11:00 AM – 12:00 PM', '4:00 PM – 5:00 PM', '6:00 PM – 7:00 PM'],
        };
        setTutors((prev) => [...prev, newTutor]);
      }
    }
  };

  const updatePricingConfig = (newPricing: Partial<PricingConfig>) => {
    setPricingConfig((prev) => ({ ...prev, ...newPricing }));
  };

  const updateTutor = (tutorId: string, updates: Partial<Tutor>) => {
    setTutors((prev) =>
      prev.map((t) => (t.id === tutorId ? { ...t, ...updates } : t))
    );
  };

  const addChildProfile = (child: {
    name: string;
    age: number;
    grade: string;
    board: string;
    schoolName?: string;
  }) => {
    const id = `child-${Date.now()}`;
    const newChild = { ...child, id };
    setParentAccount((prev) => ({
      ...prev,
      children: [...prev.children, newChild],
      selectedChildId: id,
    }));
  };

  const selectChildProfile = (childId: string) => {
    setParentAccount((prev) => ({ ...prev, selectedChildId: childId }));
  };

  // Career Counselling Booking
  const createCareerBooking = (
    bookingData: Omit<CareerCounsellingBooking, 'id' | 'createdAt'>
  ): CareerCounsellingBooking => {
    const id = `QT-CC-${Math.floor(1000 + Math.random() * 9000)}`;
    const newBooking: CareerCounsellingBooking = {
      ...bookingData,
      id,
      createdAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
    };
    setCareerBookings((prev) => [newBooking, ...prev]);
    return newBooking;
  };

  // Admission Counselling Booking
  const createAdmissionBooking = (
    bookingData: Omit<AdmissionCounsellingBooking, 'id' | 'createdAt'>
  ): AdmissionCounsellingBooking => {
    const id = `QT-AC-${Math.floor(1000 + Math.random() * 9000)}`;
    const newBooking: AdmissionCounsellingBooking = {
      ...bookingData,
      id,
      createdAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
    };
    setAdmissionBookings((prev) => [newBooking, ...prev]);
    return newBooking;
  };

  const updateTrackedApplication = (id: string, updates: Partial<TrackedCollegeApplication>) => {
    setTrackedApplications((prev) =>
      prev.map((app) => (app.id === id ? { ...app, ...updates } : app))
    );
  };

  const addTrackedApplication = (app: Omit<TrackedCollegeApplication, 'id'>) => {
    const id = `col-app-${Date.now()}`;
    setTrackedApplications((prev) => [{ ...app, id }, ...prev]);
  };

  // Free Community Q&A Actions
  const askCommunityQuestion = (
    questionData: Omit<CommunityQuestion, 'id' | 'status' | 'answers' | 'createdAt' | 'upvotes'>
  ): CommunityQuestion => {
    const id = `CQ-${Math.floor(100 + Math.random() * 900)}`;
    const newQuestion: CommunityQuestion = {
      ...questionData,
      id,
      status: 'new',
      answers: [],
      createdAt: 'Just now',
      upvotes: 1,
    };
    setCommunityQuestions((prev) => [newQuestion, ...prev]);
    return newQuestion;
  };

  const answerCommunityQuestion = (
    questionId: string,
    answer: Omit<CommunityAnswer, 'id' | 'createdAt'>
  ) => {
    const newAns: CommunityAnswer = {
      ...answer,
      id: `ans-${Date.now()}`,
      createdAt: 'Just now',
      followUps: [],
    };
    setCommunityQuestions((prev) =>
      prev.map((q) =>
        q.id === questionId
          ? {
              ...q,
              status: 'answered',
              assignedFacultyName: answer.facultyName,
              answers: [...q.answers, newAns],
            }
          : q
      )
    );
  };

  const addCommunityFollowUp = (
    questionId: string,
    answerId: string,
    text: string,
    author: string,
    isFaculty?: boolean
  ) => {
    const newFollowUp = {
      id: `f-${Date.now()}`,
      author,
      text,
      createdAt: 'Just now',
      isFaculty,
    };
    setCommunityQuestions((prev) =>
      prev.map((q) => {
        if (q.id !== questionId) return q;
        return {
          ...q,
          answers: q.answers.map((a) => {
            if (a.id !== answerId) return a;
            return {
              ...a,
              followUps: [...(a.followUps || []), newFollowUp],
            };
          }),
        };
      })
    );
  };

  const upvoteQuestion = (questionId: string) => {
    setCommunityQuestions((prev) =>
      prev.map((q) => (q.id === questionId ? { ...q, upvotes: q.upvotes + 1 } : q))
    );
  };

  const addPreExamApplication = (
    appData: Omit<PreExamApplication, 'id' | 'createdAt'>
  ): PreExamApplication => {
    const id = `PRE-APP-${Math.floor(800 + Math.random() * 200)}`;
    const newApp: PreExamApplication = {
      ...appData,
      id,
      createdAt: new Date().toISOString().slice(0, 10),
    };
    setPreExamApplications((prev) => [newApp, ...prev]);
    return newApp;
  };

  const updatePreExamApplication = (id: string, updates: Partial<PreExamApplication>) => {
    setPreExamApplications((prev) =>
      prev.map((app) => (app.id === id ? { ...app, ...updates } : app))
    );
  };

  const addPostExamApplication = (
    appData: Omit<PostExamApplication, 'id' | 'createdAt'>
  ): PostExamApplication => {
    const id = `POST-PKG-${Math.floor(900 + Math.random() * 100)}`;
    const newApp: PostExamApplication = {
      ...appData,
      id,
      createdAt: new Date().toISOString().slice(0, 10),
    };
    setPostExamApplications((prev) => [newApp, ...prev]);
    return newApp;
  };

  const updatePostExamApplication = (id: string, updates: Partial<PostExamApplication>) => {
    setPostExamApplications((prev) =>
      prev.map((app) => (app.id === id ? { ...app, ...updates } : app))
    );
  };

  const updateAdmissionPricing = (updates: Partial<AdmissionPackagesPricing>) => {
    setAdmissionPricing((prev) => ({ ...prev, ...updates }));
  };

  return (
    <AppContext.Provider
      value={{
        currentPage,
        setCurrentPage,
        tutors,
        bookings,
        doubtSessions,
        pricingConfig,
        parentAccount,
        tutorApplications,
        activeDoubtSession,
        setActiveDoubtSession,
        savedTutorIds,
        toggleSaveTutor,
        activeDoubtTab,
        setActiveDoubtTab,
        createInstantBooking,
        createScheduledBooking,
        updateBookingStatus,
        startDoubtSession,
        completeDoubtSession,
        cancelDoubtSession,
        submitTutorApplication,
        updateTutorApplicationStatus,
        updatePricingConfig,
        updateTutor,
        addChildProfile,
        selectChildProfile,
        // Career Counselling
        careerCounsellors,
        careerBookings,
        createCareerBooking,
        // Admission Counselling
        admissionCounsellors,
        admissionBookings,
        createAdmissionBooking,
        trackedApplications,
        updateTrackedApplication,
        addTrackedApplication,
        // Community Q&A
        communityQuestions,
        askCommunityQuestion,
        answerCommunityQuestion,
        addCommunityFollowUp,
        upvoteQuestion,
        // Pre-Exam & Post-Exam Form Filling
        preExamApplications,
        addPreExamApplication,
        updatePreExamApplication,
        postExamApplications,
        addPostExamApplication,
        updatePostExamApplication,
        applicationExperts,
        admissionPricing,
        updateAdmissionPricing,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
