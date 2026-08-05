import { NextResponse } from "next/server";
import { getAccessToken } from "@/lib/auth/auth-cookies";

const BACKEND_URL = process.env.API_BASE_URL || "http://localhost:8080";

async function proxyRequest(method: string, request: Request, pathSegments: string[]) {
  const token = await getAccessToken();
  const path = pathSegments.join("/");
  
  // Extract query parameters from request URL
  const { search } = new URL(request.url);
  
  // Build target URL to backend (e.g. https://comicweb-backend.onrender.com/api/admin/stats)
  const targetUrl = `${BACKEND_URL}/api/admin/${path}${search}`;
  
  const headers = new Headers();
  headers.set("Content-Type", "application/json");
  headers.set("Accept", "application/json");
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  
  let body: any = undefined;
  if (method !== "GET" && method !== "HEAD") {
    try {
      body = await request.text();
    } catch {}
  }
  
  try {
    const response = await fetch(targetUrl, {
      method,
      headers,
      body,
    });
    
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
