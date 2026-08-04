import { NextResponse } from "next/server";
import { env } from "@/lib/env";
import { setAuthCookies } from "@/lib/auth/auth-cookies";
import type { LoginRequestDto, LoginResponseDto } from "@/features/authentication/types/auth.types";

interface BackendApiEnvelope<T> {
  data: T;
  requestId: string;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as LoginRequestDto;

    if (!body.usernameOrEmail || !body.password) {
      return NextResponse.json(
        {
          success: false,
          error: "Username/Email và mật khẩu không được để trống.",
        },
        { status: 400 }
      );
    }

    const response = await fetch(`${env.apiBaseUrl}/api/v1/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        usernameOrEmail: body.usernameOrEmail,
        password: body.password,
      }),
    });

    if (!response.ok) {
      // Forward the backend's RFC 7807 ProblemDetails
      try {
        const errorData = await response.json();
        return NextResponse.json(errorData, { status: response.status });
      } catch {
        return NextResponse.json(
          {
            title: "Đăng nhập thất bại",
            detail: "Tài khoản hoặc mật khẩu không chính xác.",
            status: response.status,
          },
          { status: response.status }
        );
      }
    }

    const envelope = (await response.json()) as BackendApiEnvelope<LoginResponseDto>;
    const loginData = envelope.data;

    if (!loginData || !loginData.accessToken) {
      return NextResponse.json(
        {
          title: "Đăng nhập thất bại",
          detail: "Dữ liệu trả về từ hệ thống không hợp lệ.",
          status: 500,
        },
        { status: 500 }
      );
    }

    // Extract backend's refresh token from cookies
    let refreshToken = "";
    const setCookieHeader = response.headers.get("set-cookie");
    if (setCookieHeader) {
      const match = setCookieHeader.match(/comicweb_refresh=([^;]+)/);
      if (match) {
        refreshToken = match[1];
      }
    }

    if (!refreshToken) {
      return NextResponse.json(
        {
          title: "Đăng nhập thất bại",
          detail: "Không nhận được phiên làm việc mới từ hệ thống.",
          status: 500,
        },
        { status: 500 }
      );
    }

    // Set browser HttpOnly cookies
    await setAuthCookies({
      accessToken: loginData.accessToken,
      refreshToken,
      expiresIn: loginData.expiresIn,
      mustChangePassword: loginData.mustChangePassword,
    });

    // Return safe user information only (no tokens)
    return NextResponse.json({
      user: {
        id: loginData.user.id,
        username: loginData.user.username,
        email: loginData.user.email,
        role: loginData.user.role,
      },
      mustChangePassword: loginData.mustChangePassword,
    });
  } catch (error) {
    return NextResponse.json(
      {
        title: "Lỗi kết nối",
        detail: "Không thể kết nối đến máy chủ xác thực.",
        status: 500,
      },
      { status: 500 }
    );
  }
}
