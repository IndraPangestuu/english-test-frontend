src/
│
├── api/                          # API wrappers Supabase
│   ├── auth.ts                   # Auth & profile functions
│   ├── users.ts                  # User management (Admin)
│   ├── questions.ts              # Question bank CRUD
│   ├── tests.ts                  # Test engine, assignment, results
│   ├── achievements.ts           # Badge & reward system
│   ├── analytics.ts              # Skill heatmap & stats
│   ├── audit.ts                  # Audit logs untuk admin
│   └── settings.ts               # System & theme settings
│
├── components/                   # Komponen reusable
│   ├── Layouts/                   # Layout per role
│   │   ├── AdminLayout.tsx
│   │   ├── TutorLayout.tsx
│   │   └── StudentLayout.tsx
│   │
│   ├── Navbar.tsx
│   ├── Sidebar.tsx
│   ├── Loader.tsx
│   ├── ProtectedRoute.tsx
│   ├── BadgeCard.tsx
│   ├── HeatmapChart.tsx
│   ├── AuditTimeline.tsx
│   ├── ThemeToggle.tsx
│   └── StudentSelector.tsx
│
├── hooks/                         # Custom hooks
│   ├── useFullscreenLock.ts       # Anti-cheating fullscreen
│   ├── usePreventCopyPaste.ts     # Anti-cheating copy-paste
│   └── useTheme.ts                # Dark/High contrast mode
│
├── lib/
│   └── supabase.ts                # Supabase client config
│
├── pages/                         # Halaman utama
│   ├── auth/
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   └── ForgotPassword.tsx
│   │
│   ├── admin/
│   │   ├── Dashboard.tsx
│   │   ├── Users.tsx
│   │   ├── Tests.tsx
│   │   ├── QuestionBank.tsx
│   │   ├── AuditLogs.tsx
│   │   └── Settings.tsx
│   │
│   ├── tutor/
│   │   ├── Dashboard.tsx
│   │   ├── Questions.tsx
│   │   ├── CreateTest.tsx
│   │   ├── Reviews.tsx
│   │   └── Reports.tsx
│   │
│   ├── student/
│   │   ├── Dashboard.tsx
│   │   ├── Tests.tsx
│   │   ├── History.tsx
│   │   └── Achievements.tsx
│   │
│   └── test/
│       ├── TestPage.tsx           # Test engine + anti-cheating
│       └── ResultPage.tsx
│
├── store/
│   ├── useAuthStore.ts            # State user & profile
│   ├── useThemeStore.ts           # State tema
│   └── useTestStore.ts            # State pengerjaan tes
│
├── styles/
│   └── globals.css                # Tailwind base styles
│
├── App.tsx
├── main.tsx
└── vite-env.d.ts
