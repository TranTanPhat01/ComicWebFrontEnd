import { NextResponse } from "next/server";
import { env } from "@/lib/env";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.username || !body.email || !body.password) {
      return NextResponse.json(
        {
          success: false,
          error: "Tên đăng nhập, email và mật khẩu không được để trống.",
        },
        { status: 400 }
      );
    }

    const response = await fetch(`${env.apiBaseUrl}/api/v1/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: body.username.trim(),
        email: body.email.trim(),
        password: body.password,
      }),
    });

    if (!response.ok) {
      try {
        const errorData = await response.json();
        return NextResponse.json(errorData, { status: response.status });
      } catch {
        return NextResponse.json(
          {
            title: "Đăng ký thất bại",
            detail: "Hệ thống không thể xử lý đăng ký lúc này.",
            status: response.status,
          },
          { status: response.status }
        );
      }
    }

    const resData = await response.json();
    return NextResponse.json(resData);
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
