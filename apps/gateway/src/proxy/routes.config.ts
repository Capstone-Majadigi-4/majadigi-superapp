export interface RouteConfig {
  path: string;
  target: string;
  requiresAuth: boolean;
}

export const getRoutes = (env: NodeJS.ProcessEnv): RouteConfig[] => [
  {
    path: '/api/v1/auth',
    target: env.AUTH_SERVICE_URL as string,
    requiresAuth: false,
  },
  // Bapenda —  JWT
  {
    path: '/api/v1/bapenda',
    target: env.BAPENDA_SERVICE_URL ?? 'http://localhost:3002',
    requiresAuth: true,
  },

  // Bapok — sebagian public, sebagian JWT (cek per-endpoint di service)
  {
    path: '/api/v1/bapok',
    target: env.BAPOK_SERVICE_URL ?? 'http://localhost:3003',
    requiresAuth: false,
  },
  // Islamic Center — kondisional
  {
    path: '/api/v1/islamic',
    target: env.ISLAMIC_SERVICE_URL ?? 'http://localhost:3004',
    requiresAuth: false,
  },
  // RSUD — kondisional
  {
    path: '/api/v1/rsud',
    target: env.RSUD_SERVICE_URL ?? 'http://localhost:3005',
    requiresAuth: false,
  },
  // Emergency — selalu butuh JWT
  {
    path: '/api/v1/darurat',
    target: env.EMERGENCY_SERVICE_URL ?? 'http://localhost:3006',
    requiresAuth: true,
  },

  // Wisata — kondisional
  {
    path: '/api/v1/wisata',
    target: env.TOURISM_SERVICE_URL ?? 'http://localhost:3007',
    requiresAuth: false,
  },

  // Bansos — kondisional
  {
    path: '/api/v1/bansos',
    target: env.BANSOS_SERVICE_URL ?? 'http://localhost:3008',
    requiresAuth: false,
  },

  // E-Tibi — selalu JWT
  {
    path: '/api/v1/etibi',
    target: env.ETIBI_SERVICE_URL ?? 'http://localhost:3009',
    requiresAuth: true,
  },

  // Sinaker — kondisional
  {
    path: '/api/v1/sinaker',
    target: env.SINAKER_SERVICE_URL ?? 'http://localhost:3010',
    requiresAuth: false,
  },

  // Transjatim — kondisional
  {
    path: '/api/v1/transjatim',
    target: env.TRANSJATIM_SERVICE_URL ?? 'http://localhost:3011',
    requiresAuth: false,
  },
];

export const FORCE_AUTH_PATHS = [
  '/api/v1/auth/logout',
  '/api/v1/auth/me',
  '/api/v1/bapok/price-alert',
  '/api/v1/sinaker/profil',
  '/api/v1/sinaker/lowongan',
  '/api/v1/sinaker/lamaran',
  '/api/v1/transjatim/tiket',
  '/api/v1/wisata', 
  '/api/v1/bansos/status-saya',
  '/api/v1/rsud/antrean',
];