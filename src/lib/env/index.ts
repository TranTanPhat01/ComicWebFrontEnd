/**
 * Typed environment variable validation.
 * All env access in the app should go through this module.
 */

function getEnv(key: string, defaultValue: string): string {
  return process.env[key] ?? defaultValue;
}

// ─── Public (available in both server and client) ─────────────────────────────

export const env = {
  /**
   * Backend API base URL.
   * Priority: API_BASE_URL (server), NEXT_PUBLIC_API_BASE_URL (client/server fallback).
   */
  apiBaseUrl: getEnv("API_BASE_URL", getEnv("NEXT_PUBLIC_API_BASE_URL", "http://localhost:8080")),

  /**
   * Frontend Application URL.
   */
  appUrl: getEnv("NEXT_PUBLIC_APP_URL", "http://localhost:3000"),

  /**
   * Current environment.
   */
  nodeEnv: getEnv("NODE_ENV", "development"),

  /**
   * Whether the app is in development mode.
   */
  get isDevelopment() {
    return this.nodeEnv === "development";
  },

  /**
   * Whether the app is in production mode.
   */
  get isProduction() {
    return this.nodeEnv === "production";
  },
} as const;

// ─── Server-only env variables ─────────────────────────────────────────────────
// These should only be imported from server components / route handlers.

export const serverEnv = {
  /**
   * Secret used for signing auth cookies.
   * Never exposed to the client.
   */
  authSecret: getEnv("AUTH_SECRET", ""),
} as const;
