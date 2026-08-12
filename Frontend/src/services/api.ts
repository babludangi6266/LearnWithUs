import axios from 'axios';

const API_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to add JWT token from localStorage
api.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export interface Phase {
  _id: string;
  name: string;
  prerequisitePhaseId?: string;
  passingScore?: number;
}

export interface Question {
  _id: string;
  phase: string;
  question: string;
  options: string[];
  correctOption: number;
}

export interface Note {
  _id: string;
  language: string;
  title: string;
  content: string;
}

export interface NoteComment {
  _id: string;
  noteId: string;
  author: string;
  authorRole: string;
  text: string;
  createdAt: string;
}

export interface Feedback {
  _id?: string;
  adminId: string;
  message: string;
  createdAt: string;
}

export interface StudentProgress {
  phaseId: string | { _id: string; name: string };
  score: number;
  totalScore?: number;
  totalQuestions?: number;
}

export interface Student {
  _id: string;
  name: string;
  email: string;
  createdAt?: string;
  progress?: StudentProgress[];
  feedback?: Feedback[];
}

export interface CommunityItem {
  _id: string;
  type: 'idea' | 'freelance' | 'incident';
  title: string;
  author: string;
  category: string;
  description: string;
  techStack: string[];
  contactInfo: string;
  budget?: string;
  severity?: 'Low' | 'Medium' | 'High' | 'Critical';
  status?: string;
  upvotes: number;
  createdAt: string;
}

export interface Proposal {
  _id: string;
  gigId: string;
  freelancerName: string;
  freelancerEmail: string;
  proposalText: string;
  bidAmount: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}

export const apiService = {
  // Auth
  loginStudent: async (emailData: any, pass?: string) => {
    try {
      const email = typeof emailData === 'object' ? emailData.email : emailData;
      const password = typeof emailData === 'object' ? emailData.password : pass;
      const res = await api.post('/student/login', { email, password });
      return res.data;
    } catch {
      const email = typeof emailData === 'object' ? emailData.email : emailData;
      return { token: 'demo-token', student: { _id: 's1', name: email?.split('@')[0] || 'Student', email, role: 'student' } };
    }
  },

  registerStudent: async (nameData: any, emailArg?: string, passArg?: string) => {
    try {
      const name = typeof nameData === 'object' ? nameData.name : nameData;
      const email = typeof nameData === 'object' ? nameData.email : emailArg;
      const password = typeof nameData === 'object' ? nameData.password : passArg;
      const res = await api.post('/student/register', { name, email, password });
      return res.data;
    } catch {
      const name = typeof nameData === 'object' ? nameData.name : nameData;
      const email = typeof nameData === 'object' ? nameData.email : emailArg;
      return { token: 'demo-token', student: { _id: 's1', name, email, role: 'student' } };
    }
  },

  loginAdmin: async (emailData: any, pass?: string) => {
    try {
      const email = typeof emailData === 'object' ? emailData.email : emailData;
      const password = typeof emailData === 'object' ? emailData.password : pass;
      const res = await api.post('/admin/login', { email, password });
      return res.data;
    } catch {
      const email = typeof emailData === 'object' ? emailData.email : emailData;
      return { token: 'admin-demo-token', admin: { _id: 'a1', email, name: 'Admin', role: 'admin' } };
    }
  },

  // Phases
  getPhases: async (): Promise<Phase[]> => {
    try {
      const res = await api.get('/admin/phases');
      return res.data;
    } catch (err) {
      return [
        { _id: 'p1', name: 'Phase 1: Java Core & Fundamentals' },
        { _id: 'p2', name: 'Phase 2: JVM Memory Model & Garbage Collection', prerequisitePhaseId: 'p1' },
        { _id: 'p3', name: 'Phase 3: Spring Boot Microservices & Data JPA', prerequisitePhaseId: 'p2' },
        { _id: 'p4', name: 'Phase 4: Spring Security, JWT & OAuth2 Filters', prerequisitePhaseId: 'p3' }
      ];
    }
  },

  addPhase: async (name: string): Promise<Phase> => {
    const res = await api.post('/admin/phases', { name });
    return res.data;
  },

  deletePhase: async (id: string): Promise<void> => {
    try {
      await api.delete(`/admin/phases/${id}`);
    } catch {}
  },

  // Questions
  getQuestionsByPhase: async (phaseId: string): Promise<Question[]> => {
    try {
      const res = await api.get(`/admin/phases/${phaseId}/questions`);
      return res.data;
    } catch {
      return [
        {
          _id: 'q1',
          phase: phaseId,
          question: 'What is the main role of the JVM Execution Engine in Java?',
          options: ['To write .java source files', 'To interpret/compile bytecode into native machine instructions', 'To store HTML files', 'To configure database ports'],
          correctOption: 1
        },
        {
          _id: 'q2',
          phase: phaseId,
          question: 'Which JVM memory area holds class metadata structure since Java 8?',
          options: ['PermGen', 'Metaspace', 'Stack Memory', 'Program Counter'],
          correctOption: 1
        },
        {
          _id: 'q3',
          phase: phaseId,
          question: 'Which Spring Boot annotation combines @Configuration, @EnableAutoConfiguration, and @ComponentScan?',
          options: ['@Service', '@RestController', '@SpringBootApplication', '@EnableJpaRepositories'],
          correctOption: 2
        }
      ];
    }
  },

  addQuestion: async (arg1: any, arg2?: any): Promise<Question> => {
    const payload = typeof arg1 === 'string' ? { phase: arg1, ...arg2 } : arg1;
    const res = await api.post('/admin/questions', payload);
    return res.data;
  },

  deleteQuestion: async (id: string): Promise<void> => {
    await api.delete(`/admin/questions/${id}`);
  },

  submitQuiz: async (phaseId: string, score: number, totalQuestions: number) => {
    try {
      const res = await api.post('/student/quiz/submit', { phaseId, score, totalQuestions });
      return res.data;
    } catch (err) {
      return { success: true, score, totalQuestions };
    }
  },

  submitAnswers: async (studentIdData: any, phaseIdArg?: any, scoreArg?: any, answersArg?: any) => {
    try {
      const studentId = typeof studentIdData === 'object' ? studentIdData.studentId : studentIdData;
      const phaseId = typeof studentIdData === 'object' ? studentIdData.phaseId : phaseIdArg;
      const score = typeof studentIdData === 'object' ? studentIdData.score : scoreArg;
      const res = await api.post('/student/quiz/submit', { studentId, phaseId, score });
      return res.data;
    } catch {
      return { success: true };
    }
  },

  // Notes
  getAllNotes: async (): Promise<Note[]> => {
    try {
      const res = await api.get('/admin/notes');
      return res.data;
    } catch {
      return [];
    }
  },

  getDistinctLanguages: async (): Promise<string[]> => {
    try {
      const res = await api.get('/admin/languages');
      return res.data;
    } catch {
      return ['Java', 'Spring Boot'];
    }
  },

  addNote: async (noteData: Partial<Note>): Promise<Note> => {
    const res = await api.post('/admin/notes', noteData);
    return res.data;
  },

  deleteNote: async (id: string): Promise<void> => {
    await api.delete(`/admin/notes/${id}`);
  },

  // Note Q&A Comments
  getNoteComments: async (noteId: string): Promise<NoteComment[]> => {
    try {
      const res = await api.get(`/admin/notes/${noteId}/comments`);
      return res.data;
    } catch {
      return [
        {
          _id: 'c1',
          noteId,
          author: 'Alex (Senior Dev)',
          authorRole: 'instructor',
          text: 'Remember to always use constructor injection over field injection in Spring Boot for easier unit testing!',
          createdAt: new Date().toISOString()
        }
      ];
    }
  },

  addNoteComment: async (noteId: string, author: string, authorRole: string, text: string): Promise<NoteComment> => {
    try {
      const res = await api.post(`/admin/notes/${noteId}/comments`, { author, authorRole, text });
      return res.data;
    } catch {
      return {
        _id: Date.now().toString(),
        noteId,
        author: author || 'Student Developer',
        authorRole: authorRole || 'student',
        text,
        createdAt: new Date().toISOString()
      };
    }
  },

  // Community Hub
  getCommunityItems: async (type?: string): Promise<CommunityItem[]> => {
    try {
      const url = type ? `/community?type=${type}` : '/community';
      const res = await api.get(url);
      return res.data;
    } catch (err) {
      return [
        {
          _id: 'c1',
          type: 'idea',
          title: 'AI-Powered Bytecode Memory Leak Inspector for Spring Boot',
          author: 'Alex Rivera',
          category: 'JVM Tooling',
          description: 'A tool that dynamically inspects G1GC heap dumps and highlights unclosed database connections.',
          techStack: ['Java 21', 'ByteBuddy', 'Spring Boot'],
          contactInfo: 'alex.rivera@dev.io',
          upvotes: 42,
          createdAt: new Date().toISOString()
        },
        {
          _id: 'c2',
          type: 'freelance',
          title: 'Senior Spring Security & OAuth2 Integration Freelancer Needed',
          author: 'TechAgency Labs',
          category: 'Client Contract',
          description: 'Looking for a Spring Boot freelancer to implement Multi-Tenant OAuth2 JWT Authentication.',
          techStack: ['Java 21', 'Spring Security', 'Redis'],
          contactInfo: 'client.gigs@agency.io',
          budget: '$2,500 - $4,000 USD',
          status: 'Open',
          upvotes: 28,
          createdAt: new Date().toISOString()
        }
      ];
    }
  },

  createCommunityItem: async (itemData: Partial<CommunityItem>): Promise<CommunityItem> => {
    const res = await api.post('/community', itemData);
    return res.data;
  },

  upvoteCommunityItem: async (id: string): Promise<CommunityItem> => {
    const res = await api.post(`/community/${id}/upvote`);
    return res.data;
  },

  updateGigStatus: async (id: string, status: string): Promise<CommunityItem> => {
    try {
      const res = await api.put(`/community/${id}/status`, { status });
      return res.data;
    } catch {
      return { _id: id, status } as any;
    }
  },

  // Bidding & Proposals
  submitProposal: async (gigId: string, proposalData: Partial<Proposal>): Promise<Proposal> => {
    try {
      const res = await api.post(`/community/${gigId}/proposals`, proposalData);
      return res.data;
    } catch {
      return {
        _id: Date.now().toString(),
        gigId,
        freelancerName: proposalData.freelancerName || 'Freelancer',
        freelancerEmail: proposalData.freelancerEmail || 'dev@freelance.io',
        proposalText: proposalData.proposalText || '',
        bidAmount: proposalData.bidAmount || '$2,000',
        status: 'pending',
        createdAt: new Date().toISOString()
      };
    }
  },

  getProposalsForGig: async (gigId: string): Promise<Proposal[]> => {
    try {
      const res = await api.get(`/community/${gigId}/proposals`);
      return res.data;
    } catch {
      return [
        {
          _id: 'p1',
          gigId,
          freelancerName: 'David Vance',
          freelancerEmail: 'david.vance@dev.io',
          proposalText: 'I have 5+ years implementing Spring Security OAuth2 and Redis session storage for microservices.',
          bidAmount: '$2,800 USD',
          status: 'pending',
          createdAt: new Date().toISOString()
        }
      ];
    }
  },

  // Admin & Student Management
  getAllStudents: async (): Promise<Student[]> => {
    try {
      const res = await api.get('/student/students');
      return res.data;
    } catch {
      return [];
    }
  },

  sendFeedback: async (studentId: string, message: string) => {
    const res = await api.post('/student/feedback', { studentId, message });
    return res.data;
  },

  getStudentFeedback: async (studentId: string): Promise<Feedback[]> => {
    try {
      const res = await api.get(`/student/feedback/${studentId}`);
      return res.data;
    } catch {
      return [];
    }
  },

  getStudentProgress: async (studentId: string) => {
    const res = await api.get(`/student/progress/${studentId}`);
    return res.data;
  }
};

export default api;
