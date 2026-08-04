import { serverGet } from "@/lib/api/server-api-client";
import { API_ROUTES } from "@/constants/api-routes";
import { getAccessToken } from "./auth-cookies";
import type { MeResponseDto, AuthSession } from "@/features/authentication/types/auth.types";

interface BackendApiEnvelope<T> {
  data: T;
  requestId: string;
}

/**
 * Retrieves the current session (user information and password-change requirement)
 * by fetching the user's profile from the backend using the access token cookie.
 * Returns null if the user is unauthenticated or the token is invalid.
 */
export async function getSession(): Promise<AuthSession | null> {
  const token = await getAccessToken();
  if (!token) {
    return null;
  }

  const response = await serverGet<BackendApiEnvelope<MeResponseDto>>(
    API_ROUTES.auth.me,
    undefined,
    { accessToken: token }
  );

  if (!response.success || !response.data) {
    return null;
  }

  const meData = response.data.data;
  if (!meData) {
    return null;
  }

  return {
    user: {
      id: meData.id,
      username: meData.username,
      email: meData.email,
      role: meData.role,
    },
    mustChangePassword: meData.mustChangePassword,
    permissions: meData.permissions,
  };
}
