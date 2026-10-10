/**
 * Application Configuration
 * Only reads from import.meta.env.VITE_* variables.
 * Safe defaults are provided for demo and development mode.
 * Note: Any variable exposed with VITE_* is public in client bundles.
 */
export const config = {
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL || '',
  supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
  // Demo login feature flag - controls visibility and activation of one-click mock logins
  enableDemoLogin: import.meta.env.VITE_ENABLE_DEMO_LOGIN !== 'false',
  isProduction: import.meta.env.PROD || false,
  appName: 'VitalSync',
  appVersion: '1.0.0',
};

export default config;
