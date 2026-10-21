/**
 * Application Configuration
 * Only reads from import.meta.env.VITE_* variables.
 * Safe defaults are provided for demo and development mode.
 * Note: Any variable exposed with VITE_* is public in client bundles.
 */


let rawUrl = (import.meta.env.VITE_SUPABASE_URL || '').trim();
// Strip accidental wrapping quotes if present
if ((rawUrl.startsWith('"') && rawUrl.endsWith('"')) || (rawUrl.startsWith("'") && rawUrl.endsWith("'"))) {
  rawUrl = rawUrl.slice(1, -1).trim();
}
// If the user provided bare project ID (e.g. ldwmpanawgcyhpaigsog) or domain without protocol
if (rawUrl && !rawUrl.includes('.') && !rawUrl.includes('/')) {
  rawUrl = `https://${rawUrl}.supabase.co`;
} else if (rawUrl && !rawUrl.startsWith('http://') && !rawUrl.startsWith('https://')) {
  rawUrl = 'https://' + rawUrl;
}

let validUrl = '';
try {
  if (rawUrl) {
    const parsed = new URL(rawUrl);
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
      validUrl = parsed.origin;
    }
  }
} catch {
  validUrl = '';
}

const rawKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim();

export const config = {
  supabaseUrl: validUrl || rawUrl,
  supabaseAnonKey: rawKey,
  // Demo login feature flag - shown only when VITE_ENABLE_DEMO_LOGIN === 'true'
  enableDemoLogin: import.meta.env.VITE_ENABLE_DEMO_LOGIN === 'true',
  // Helper to check if Supabase connection credentials are provided and valid
  isSupabaseConfigured: Boolean(validUrl && rawKey),
  isProduction: import.meta.env.PROD || false,
  appName: 'VitalSync',
  appVersion: '1.0.0',
};

export default config;
