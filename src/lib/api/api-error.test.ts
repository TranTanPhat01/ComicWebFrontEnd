import { describe, it, expect } from "vitest";
import { parseResponseError, ApiClientError } from "./api-error";

describe("ApiClientError", () => {
  it("should construct and convert to standard ApiError shape", () => {
    const problem = { title: "Error Title", detail: "Error Detail" };
    const err = new ApiClientError("Error Detail", 400, problem, false);

    expect(err.message).toBe("Error Detail");
    expect(err.status).toBe(400);
    expect(err.problemDetails).toEqual(problem);

    const apiErr = err.toApiError();
    expect(apiErr.message).toBe("Error Detail");
    expect(apiErr.status).toBe(400);
    expect(apiErr.isNetworkError).toBe(false);
  });
});

describe("parseResponseError", () => {
  it("should parse standard application/problem+json response details", async () => {
    const mockProblem = {
      type: "https://tools.ietf.org/html/rfc7231#section-6.5.1",
      title: "Bad Request",
      status: 400,
      detail: "Invalid parameters specified",
    };

    const response = new Response(JSON.stringify(mockProblem), {
      status: 400,
      statusText: "Bad Request",
      headers: { "Content-Type": "application/problem+json; charset=utf-8" },
    });

    const parsed = await parseResponseError(response);
    expect(parsed.status).toBe(400);
    expect(parsed.message).toBe("Invalid parameters specified");
    expect(parsed.problemDetails).toEqual(mockProblem);
  });

  it("should fall back to status text when content type is not JSON", async () => {
    const response = new Response("<html>Internal Server Error</html>", {
      status: 500,
      statusText: "Internal Server Error",
      headers: { "Content-Type": "text/html" },
    });

    const parsed = await parseResponseError(response);
    expect(parsed.status).toBe(500);
    expect(parsed.message).toBe("HTTP 500: Internal Server Error");
    expect(parsed.problemDetails).toBeUndefined();
  });
});
