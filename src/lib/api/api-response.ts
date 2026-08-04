import { type ProblemDetails } from "./problem-details";

/**
 * Represents a successful or failed API response in a discriminated union.
 * Consumers always check `success` before accessing `data` or `error`.
 */
export type ApiResponse<T> =
  | { success: true; data: T; status: number }
  | { success: false; error: ApiError; status: number };

/**
 * Structured API error carrying the original ProblemDetails from the backend.
 */
export interface ApiError {
  /** Short error code or message. */
  message: string;
  /** HTTP status code. */
  status: number;
  /** Full RFC 7807 problem details from backend (if available). */
  problemDetails?: ProblemDetails;
  /** Whether the error is a network/connection error. */
  isNetworkError: boolean;
}

/**
 * Creates a success response wrapper.
 */
export function createSuccessResponse<T>(
  data: T,
  status: number
): ApiResponse<T> {
  return { success: true, data, status };
}

/**
 * Creates a failure response wrapper.
 */
export function createErrorResponse<T>(
  error: ApiError,
  status: number
): ApiResponse<T> {
  return { success: false, error, status };
}
