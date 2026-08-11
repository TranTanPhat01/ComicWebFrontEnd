import { NextResponse } from "next/server";
import { getAccessToken } from "@/lib/auth/auth-cookies";
import { refreshSession } from "@/lib/auth/refresh-session";

const BACKEND_URL = process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

async function proxyRequest(method: string, request: Request, pathSegments: string[]) {
  let token = await getAccessToken();

  // If no access token in cookie, try to refresh silently
  if (!token) {
    token = (await refreshSession()) ?? undefined;
  }

  const path = pathSegments.join("/");
  
  // Extract query parameters from request URL
  const { search } = new URL(request.url);
  
  // Build target URL to backend (e.g. https://comicweb-backend.onrender.com/api/v1/me/follows)
  const targetUrl = `${BACKEND_URL}/api/v1/me/${path}${search}`;
  
  const buildHeaders = (t: string | undefined) => {
    const h = new Headers();
    h.set("Content-Type", "application/json");
    h.set("Accept", "application/json");
    if (t) h.set("Authorization", `Bearer ${t}`);
    return h;
  };

  let body: string | undefined = undefined;
  if (method !== "GET" && method !== "HEAD") {
    try {
      body = await request.text();
    } catch {}
  }
  
  try {
    let response = await fetch(targetUrl, {
      method,
      headers: buildHeaders(token),
      body,
    });

    // If 401, try once more with a fresh token
    if (response.status === 401) {
      const newToken = await refreshSession();
      if (newToken) {
        response = await fetch(targetUrl, {
          method,
          headers: buildHeaders(newToken),
          // body is already consumed, but for GET it is undefined so this is fine
          body,
        });
      }
    }
    
    if (response.status === 204) {
      return new Response(null, { status: 204 });
    }
    
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    return NextResponse.json({ error: "Proxy connection failed" }, { status: 500 });
  }
}

export async function GET(request: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const resolvedParams = await params;
  return proxyRequest("GET", request, resolvedParams.path);
}

export async function POST(request: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const resolvedParams = await params;
  return proxyRequest("POST", request, resolvedParams.path);
}

export async function PUT(request: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const resolvedParams = await params;
  return proxyRequest("PUT", request, resolvedParams.path);
}

export async function DELETE(request: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const resolvedParams = await params;
  return proxyRequest("DELETE", request, resolvedParams.path);
}
