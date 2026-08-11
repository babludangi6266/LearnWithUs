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
  progress: StudentProgress[];
  feedback: Feedback[];
  createdAt: string;
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

// Fallback Initial / Demo Data
export const DEMO_PHASES: Phase[] = [
  { _id: 'p1', name: 'Phase 1: Java Fundamentals, JVM Architecture & OOPS' },
  { _id: 'p2', name: 'Phase 2: Java Multithreading & Memory Management' },
  { _id: 'p3', name: 'Phase 3: Spring Boot Core, IoC & Dependency Injection' },
  { _id: 'p4', name: 'Phase 4: Spring Data JPA, REST APIs & Security' },
];

export const DEMO_QUESTIONS: Record<string, Question[]> = {
  p1: [
    {
      _id: 'q1',
      phase: 'p1',
      question: 'What is the primary role of the Java Virtual Machine (JVM)?',
      options: [
        'To compile source code into .java files',
        'To execute Java bytecode (.class files) on target operating systems',
        'To replace database SQL engines',
        'To format HTML templates on the client'
      ],
      correctOption: 1,
    },
    {
      _id: 'q2',
      phase: 'p1',
      question: 'Which OOPS principle allows derived classes to override methods of parent classes at runtime?',
      options: [
        'Encapsulation',
        'Polymorphism',
        'Abstraction',
        'Aggregation'
      ],
      correctOption: 1,
    }
  ],
  p2: [
    {
      _id: 'q3',
      phase: 'p2',
      question: 'Where are objects and class instances stored in Java JVM Memory?',
      options: [
        'Call Stack Memory',
        'Heap Memory',
        'PC Register',
        'Native Method Stack'
      ],
      correctOption: 1,
    }
  ]
};

export const DEMO_NOTES: Note[] = [
  {
    _id: 'n1',
    language: 'Java',
    title: '1. Fundamentals of Java & JVM / JRE Architecture',
    content: `### Java Architecture & Runtime Infrastructure
Java is a compiled and interpreted programming language.
#### Key Components:
- **JDK**: Compilers & debugging tools.
- **JRE**: Class libraries + JVM.
- **JVM**: Executes Java bytecode (.class files).`
  },
  {
    _id: 'n2',
    language: 'Spring Boot',
    title: '1. Spring Boot Core Architecture & Dependency Injection (IoC)',
    content: `### Spring Inversion of Control & Beans Management
Spring Boot automatically configures applications with opinionated defaults.
#### Essential Annotations:
- \`@SpringBootApplication\`
- \`@Service\`, \`@Repository\`, \`@RestController\``
  }
];

export const DEMO_COMMUNITY_ITEMS: CommunityItem[] = [
  // IDEAS
  {
    _id: 'c1',
    type: 'idea',
    title: 'AI-Powered Code Reviewer for Spring Boot Microservices',
    author: 'David Vance',
    category: 'AI / Backend',
    description: 'A developer platform tool that automatically inspects Java Spring Boot PRs for memory leaks, N+1 JPA query inefficiencies, and unhandled exception safety.',
    techStack: ['Java 21', 'Spring Boot', 'Python', 'OpenAI API'],
    contactInfo: 'david.vance.dev@gmail.com',
    status: 'In Review',
    upvotes: 42,
    createdAt: new Date().toISOString()
  },
  {
    _id: 'c2',
    type: 'idea',
    title: 'Real-Time WebGL Architecture Diagram Visualizer',
    author: 'Elena Rostova',
    category: 'Frontend / WebGL',
    description: 'An interactive 3D browser canvas canvas tool to map microservices topologies, Docker containers, and API gateway routes dynamically.',
    techStack: ['React', 'Three.js', 'TypeScript', 'Tailwind CSS'],
    contactInfo: 'elena.tech@dev.io',
    status: 'Building MVP',
    upvotes: 28,
    createdAt: new Date().toISOString()
  },

  // FREELANCE PROJECTS
  {
    _id: 'c3',
    type: 'freelance',
    title: 'Senior Spring Security & OAuth2 Integration Freelancer Needed',
    author: 'Nexus Fintech Corp',
    category: 'Backend Security',
    description: 'Looking for an experienced Spring Boot freelancer to implement Multi-Tenant OAuth2 JWT Authentication, Redis session caching, and rate-limiting filters.',
    techStack: ['Spring Boot 3', 'Spring Security', 'Redis', 'PostgreSQL'],
    budget: '$2,500 - $4,000 USD',
    contactInfo: 'gigs@nexusfintech.io (Discord: nexus_hiring#4921)',
    status: 'Hiring Open',
    upvotes: 19,
    createdAt: new Date().toISOString()
  },
  {
    _id: 'c4',
    type: 'freelance',
    title: 'Frontend React + Tailwind UI Engineer for EdTech Dashboard',
    author: 'LearnWithUs Team',
    category: 'Frontend Development',
    description: 'Seeking a freelance UI specialist to build interactive student progress charts, dark mode glassmorphism components, and Framer Motion micro-animations.',
    techStack: ['React', 'TypeScript', 'Tailwind CSS', 'Framer Motion'],
    budget: '$1,800 - $3,000 USD',
    contactInfo: 'careers@learnwithus.io',
    status: 'Hiring Open',
    upvotes: 35,
    createdAt: new Date().toISOString()
  },

  // INCIDENTS & TECH ALERTS
  {
    _id: 'c5',
    type: 'incident',
    title: 'Spring Data JPA @OneToMany FetchType.EAGER N+1 Query Memory Spike Alert',
    author: 'Senior Systems Architect',
    category: 'Database / ORM',
    description: 'Discovered high memory consumption when fetching nested entities with default EAGER fetch strategy. Recommended workaround: Use @EntityGraph or JOIN FETCH query hints.',
    techStack: ['Spring Data JPA', 'Hibernate', 'PostgreSQL'],
    contactInfo: 'dev-alerts@learnwithus.io',
    severity: 'High',
    status: 'Mitigated',
    upvotes: 56,
    createdAt: new Date().toISOString()
  },
  {
    _id: 'c6',
    type: 'incident',
    title: 'Node.js v24 ES Module CommonJS PostCSS Resolver Warning',
    author: 'DevOps Engineer',
    category: 'Build Systems',
    description: 'When running Vite dev server on Node v24, ensure postcss.config.cjs is explicitly named with CommonJS module.exports to avoid ES module import warnings.',
    techStack: ['Vite', 'Node.js', 'PostCSS'],
    contactInfo: 'ops@devwatch.net',
    severity: 'Medium',
    status: 'Resolved',
    upvotes: 23,
    createdAt: new Date().toISOString()
  }
];

// API Methods
export const apiService = {
  // Auth
  registerStudent: async (data: { name: string; email: string; password: string }) => {
    try {
      const res = await api.post('/auth/register', data);
      return res.data;
    } catch (err: any) {
      if (err.response?.data?.msg) throw new Error(err.response.data.msg);
      throw err;
    }
  },

  loginStudent: async (data: { email: string; password: string }) => {
    try {
      const res = await api.post('/auth/login', data);
      return res.data;
    } catch (err: any) {
      if (err.response?.data?.msg) throw new Error(err.response.data.msg);
      throw err;
    }
  },

  loginAdmin: async (data: { email: string; password: string }) => {
    try {
      const res = await api.post('/admin/login', data);
      return res.data;
    } catch (err: any) {
      if (err.response?.data?.msg) throw new Error(err.response.data.msg);
      throw err;
    }
  },

  // Phases
  getPhases: async (): Promise<Phase[]> => {
    try {
      const res = await api.get('/admin/phases');
      return res.data && res.data.length ? res.data : DEMO_PHASES;
    } catch {
      return DEMO_PHASES;
    }
  },

  addPhase: async (name: string): Promise<Phase> => {
    const res = await api.post('/admin/phases', { name });
    return res.data;
  },

  updatePhase: async (id: string, name: string): Promise<Phase> => {
    const res = await api.put(`/admin/phases/${id}`, { name });
    return res.data;
  },

  deletePhase: async (id: string) => {
    const res = await api.delete(`/admin/phases/${id}`);
    return res.data;
  },

  // Questions
  getQuestionsByPhase: async (phaseId: string): Promise<Question[]> => {
    try {
      const res = await api.get(`/admin/phases/${phaseId}/questions`);
      return res.data && res.data.length ? res.data : (DEMO_QUESTIONS[phaseId] || []);
    } catch {
      return DEMO_QUESTIONS[phaseId] || [];
    }
  },

  addQuestion: async (phaseId: string, questionData: { question: string; options: string[]; correctOption: number }): Promise<Question> => {
    const res = await api.post(`/admin/phases/${phaseId}/questions`, questionData);
    return res.data;
  },

  deleteQuestion: async (id: string) => {
    const res = await api.delete(`/admin/questions/${id}`);
    return res.data;
  },

  // Notes
  getAllNotes: async (): Promise<Note[]> => {
    try {
      const res = await api.get('/admin/notes/notes');
      return res.data && res.data.length ? res.data : DEMO_NOTES;
    } catch {
      return DEMO_NOTES;
    }
  },

  getDistinctLanguages: async (): Promise<string[]> => {
    try {
      const res = await api.get('/admin/notes/languages');
      return res.data && res.data.length ? res.data : Array.from(new Set(DEMO_NOTES.map(n => n.language)));
    } catch {
      return Array.from(new Set(DEMO_NOTES.map(n => n.language)));
    }
  },

  addNote: async (noteData: { language: string; title: string; content: string }): Promise<Note> => {
    const res = await api.post('/admin/notes/notes', noteData);
    return res.data;
  },

  deleteNote: async (id: string) => {
    const res = await api.delete(`/admin/notes/notes/${id}`);
    return res.data;
  },

  // Developer Community Hub Methods
  getCommunityItems: async (type?: 'idea' | 'freelance' | 'incident'): Promise<CommunityItem[]> => {
    try {
      const url = type ? `/community?type=${type}` : '/community';
      const res = await api.get(url);
      if (res.data && res.data.length) return res.data;
      return type ? DEMO_COMMUNITY_ITEMS.filter(i => i.type === type) : DEMO_COMMUNITY_ITEMS;
    } catch {
      return type ? DEMO_COMMUNITY_ITEMS.filter(i => i.type === type) : DEMO_COMMUNITY_ITEMS;
    }
  },

  createCommunityItem: async (data: Partial<CommunityItem>): Promise<CommunityItem> => {
    try {
      const res = await api.post('/community', data);
      return res.data;
    } catch (err: any) {
      if (err.response?.data?.message) throw new Error(err.response.data.message);
      throw err;
    }
  },

  upvoteCommunityItem: async (id: string): Promise<CommunityItem> => {
    try {
      const res = await api.post(`/community/${id}/upvote`);
      return res.data;
    } catch {
      const item = DEMO_COMMUNITY_ITEMS.find(i => i._id === id);
      if (item) item.upvotes += 1;
      return item || ({} as any);
    }
  },

  deleteCommunityItem: async (id: string) => {
    try {
      const res = await api.delete(`/community/${id}`);
      return res.data;
    } catch (err: any) {
      throw err;
    }
  },

  // Student Progress & Feedback
  submitAnswers: async (phaseId: string, answers: Record<string, number>) => {
    const res = await api.post('/student/submit-answers', { phaseId, answers });
    return res.data;
  },

  getAllStudents: async (): Promise<Student[]> => {
    try {
      const res = await api.get('/student/students');
      return res.data;
    } catch {
      return [
        {
          _id: 's1',
          name: 'Alex Johnson',
          email: 'alex.johnson@example.com',
          createdAt: new Date().toISOString(),
          progress: [{ phaseId: 'p1', score: 3, totalScore: 3 }],
          feedback: [{ adminId: 'babludangi2000@gmail.com', message: 'Great job completing Phase 1 with full marks!', createdAt: new Date().toISOString() }]
        }
      ];
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
