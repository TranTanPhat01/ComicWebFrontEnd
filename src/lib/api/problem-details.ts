/**
 * RFC 7807 Problem Details for HTTP APIs.
 * Used by the backend to describe errors in a standard format.
 * @see https://tools.ietf.org/html/rfc7807
 */
export interface ProblemDetails {
  /** A URI reference that identifies the problem type. */
  type?: string;
  /** A short, human-readable summary of the problem type. */
  title?: string;
  /** The HTTP status code. */
  status?: number;
  /** A human-readable explanation specific to this occurrence. */
  detail?: string;
  /** A URI reference that identifies the specific occurrence. */
  instance?: string;
  /** Extension fields: field-level validation errors. */
  errors?: Record<string, string[]>;
  /** Extension: trace ID for debugging. */
  traceId?: string;
}

/**
 * Type guard for ProblemDetails objects.
 */
export function isProblemDetails(value: unknown): value is ProblemDetails {
  return (
    typeof value === "object" &&
    value !== null &&
    ("title" in value || "status" in value || "detail" in value)
  );
}
