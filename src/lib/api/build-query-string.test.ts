import { describe, it, expect } from "vitest";
import { buildQueryString, buildUrl } from "./build-query-string";

describe("buildQueryString", () => {
  it("should convert simple parameters into a query string", () => {
    const result = buildQueryString({ page: 1, size: 10, search: "hello" });
    expect(result).toBe("?page=1&size=10&search=hello");
  });

  it("should skip keys with undefined or null values", () => {
    const result = buildQueryString({ page: 2, filter: null, search: undefined });
    expect(result).toBe("?page=2");
  });

  it("should return empty string if no parameters", () => {
    const result = buildQueryString({});
    expect(result).toBe("");
  });
});

describe("buildUrl", () => {
  it("should append query parameters to base URL", () => {
    const result = buildUrl("/api/stories", { page: 1 });
    expect(result).toBe("/api/stories?page=1");
  });

  it("should return path unmodified if no parameters provided", () => {
    const result = buildUrl("/api/stories", undefined);
    expect(result).toBe("/api/stories");
  });
});
