import { type ProblemDetails, isProblemDetails } from "./problem-details";
import { type ApiError } from "./api-response";
import { env } from "@/lib/env";

/**
 * Custom error class for API errors.
 * Wraps HTTP errors with structured data from the backend.
 */
export class ApiClientError extends Error {
  public readonly status: number;
  public readonly problemDetails?: ProblemDetails;
  public readonly isNetworkError: boolean;

  constructor(
    message: string,
    status: number,
    problemDetails?: ProblemDetails,
    isNetworkError = false
  ) {
    super(message);
    this.name = "ApiClientError";
    this.status = status;
    this.problemDetails = problemDetails;
    this.isNetworkError = isNetworkError;
  }

  /**
   * Convert to the plain ApiError shape used in ApiResponse.
   */
  toApiError(): ApiError {
    return {
      message: this.message,
      status: this.status,
      problemDetails: this.problemDetails,
      isNetworkError: this.isNetworkError,
    };
  }
}

/**
 * Parse an error from a fetch Response into a structured ApiClientError.
 */
export async function parseResponseError(
  response: Response
): Promise<ApiClientError> {
  let problemDetails: ProblemDetails | undefined;
  let message = `HTTP ${response.status}: ${response.statusText}`;

  try {
    const contentType = response.headers.get("content-type") ?? "";
    if (
      contentType.includes("application/problem+json") ||
      contentType.includes("application/json")
    ) {
      const body: unknown = await response.json();
      if (isProblemDetails(body)) {
        problemDetails = body;
        message = body.detail ?? body.title ?? message;
      }
    }
  } catch {
    // If parsing fails, use the default message
  }

  return new ApiClientError(message, response.status, problemDetails, false);
}

/**
 * Parse a network/connection error (fetch threw before getting a response).
 */
export function parseNetworkError(error: unknown): ApiClientError {
  let message = `Không thể kết nối tới ComicWeb API tại ${env.apiBaseUrl}. Vui lòng đảm bảo Backend đang chạy hoặc kiểm tra cổng kết nối.`;
  
  if (error instanceof Error) {
    // If it's another network error than connection refusal, display its details
    if (!error.message.includes("fetch failed") && !error.message.includes("connect ECONNREFUSED")) {
      message = `${error.message} (khi kết nối tới ${env.apiBaseUrl})`;
    }
  }
  
  return new ApiClientError(message, 0, undefined, true);
}

