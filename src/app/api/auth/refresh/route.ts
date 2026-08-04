import { NextResponse } from "next/server";
import { refreshSession } from "@/lib/auth/refresh-session";

export async function POST() {
  const newAccessToken = await refreshSession();

  if (!newAccessToken) {
    return NextResponse.json(
      {
        success: false,
        error: "Phiên đăng nhập hết hạn hoặc không hợp lệ.",
      },
      { status: 401 }
    );
  }

  return NextResponse.json({ success: true });
}
