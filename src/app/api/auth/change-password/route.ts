import { NextResponse } from "next/server";
import { env } from "@/lib/env";
import { getAccessToken, clearAuthCookies } from "@/lib/auth/auth-cookies";
import type { ChangePasswordRequestDto } from "@/features/authentication/types/auth.types";

export async function POST(request: Request) {
  try {
    const accessToken = await getAccessToken();

    if (!accessToken) {
      return NextResponse.json(
        {
          title: "Yêu cầu đăng nhập",
          detail: "Bạn phải đăng nhập để thực hiện chức năng này.",
          status: 401,
        },
        { status: 401 }
      );
    }

    const body = (await request.json()) as ChangePasswordRequestDto;

    if (!body.newPassword || !body.confirmPassword) {
      return NextResponse.json(
        {
          title: "Dữ liệu không hợp lệ",
          detail: "Mật khẩu mới và xác nhận mật khẩu không được trống.",
          status: 400,
        },
        { status: 400 }
      );
    }

    const response = await fetch(`${env.apiBaseUrl}/api/v1/auth/change-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        currentPassword: body.currentPassword || "",
        newPassword: body.newPassword,
        confirmPassword: body.confirmPassword,
      }),
    });

    if (!response.ok) {
      try {
        const errorData = await response.json();
        return NextResponse.json(errorData, { status: response.status });
      } catch {
        return NextResponse.json(
          {
            title: "Lỗi đổi mật khẩu",
            detail: "Không thể đổi mật khẩu. Vui lòng kiểm tra lại thông tin.",
            status: response.status,
          },
          { status: response.status }
        );
      }
    }

    // Success! Clear cookies since backend invalidates the session
    await clearAuthCookies();

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return NextResponse.json(
      {
        title: "Lỗi hệ thống",
        detail: "Có lỗi xảy ra khi đổi mật khẩu.",
        status: 500,
      },
      { status: 500 }
    );
  }
}
