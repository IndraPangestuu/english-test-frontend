import {
  LayoutDashboard,
  Users,
  ClipboardList,
  FileText,
  History,
  Award,
  Settings,
} from 'lucide-react';

// Struktur tipe route
export interface AppRoute {
  path: string;
  element: React.ReactNode;
  label: string;
  icon: React.ElementType;
  allowedRoles: string[]; // "admin" | "tutor" | "student"
}

// Import halaman
import AdminDashboard from '../pages/admin/Dashboard';
import AdminUsers from '../pages/admin/Users';
import AdminTests from '../pages/admin/Tests';
import AdminQuestionBank from '../pages/admin/QuestionBank';
import AdminAuditLogs from '../pages/admin/AuditLogs';
import AdminSettings from '../pages/admin/Settings';

import TutorDashboard from '../pages/tutor/Dashboard';
import TutorQuestions from '../pages/tutor/Questions';
import TutorCreateTest from '../pages/tutor/CreateTest';
import TutorReviews from '../pages/tutor/Reviews';
import TutorReports from '../pages/tutor/Reports';

import StudentDashboard from '../pages/student/Dashboard';
import StudentTests from '../pages/student/Tests';
import StudentHistory from '../pages/student/History';
import StudentAchievements from '../pages/student/Achievements';

// Semua route di sini
export const routesConfig: AppRoute[] = [
  // ===== Admin =====
  {
    path: '/admin/dashboard',
    element: <AdminDashboard />,
    label: 'Dashboard',
    icon: LayoutDashboard,
    allowedRoles: ['admin'],
  },
  {
    path: '/admin/users',
    element: <AdminUsers />,
    label: 'Users',
    icon: Users,
    allowedRoles: ['admin'],
  },
  {
    path: '/admin/tests',
    element: <AdminTests />,
    label: 'Tests',
    icon: ClipboardList,
    allowedRoles: ['admin'],
  },
  {
    path: '/admin/question-bank',
    element: <AdminQuestionBank />,
    label: 'Question Bank',
    icon: FileText,
    allowedRoles: ['admin'],
  },
  {
    path: '/admin/audit-logs',
    element: <AdminAuditLogs />,
    label: 'Audit Logs',
    icon: History,
    allowedRoles: ['admin'],
  },
  {
    path: '/admin/settings',
    element: <AdminSettings />,
    label: 'Settings',
    icon: Settings,
    allowedRoles: ['admin'],
  },

  // ===== Tutor =====
  {
    path: '/tutor/dashboard',
    element: <TutorDashboard />,
    label: 'Dashboard',
    icon: LayoutDashboard,
    allowedRoles: ['tutor'],
  },
  {
    path: '/tutor/questions',
    element: <TutorQuestions />,
    label: 'Questions',
    icon: FileText,
    allowedRoles: ['tutor'],
  },
  {
    path: '/tutor/create-test',
    element: <TutorCreateTest />,
    label: 'Create Test',
    icon: ClipboardList,
    allowedRoles: ['tutor'],
  },
  {
    path: '/tutor/reviews',
    element: <TutorReviews />,
    label: 'Reviews',
    icon: Users,
    allowedRoles: ['tutor'],
  },
  {
    path: '/tutor/reports',
    element: <TutorReports />,
    label: 'Reports',
    icon: Settings,
    allowedRoles: ['tutor'],
  },

  // ===== Student =====
  {
    path: '/student/dashboard',
    element: <StudentDashboard />,
    label: 'Dashboard',
    icon: LayoutDashboard,
    allowedRoles: ['student'],
  },
  {
    path: '/student/tests',
    element: <StudentTests />,
    label: 'My Tests',
    icon: ClipboardList,
    allowedRoles: ['student'],
  },
  {
    path: '/student/history',
    element: <StudentHistory />,
    label: 'History',
    icon: History,
    allowedRoles: ['student'],
  },
  {
    path: '/student/achievements',
    element: <StudentAchievements />,
    label: 'Achievements',
    icon: Award,
    allowedRoles: ['student'],
  },
];
