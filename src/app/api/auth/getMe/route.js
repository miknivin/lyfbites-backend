import dbConnect from "@/lib/db/connection";
import { isAuthenticatedUser } from "@/middlewares/auth";
import { NextResponse } from "next/server";
import User from "@/models/User";

export async function GET(req) {
  try {
    await dbConnect();
    const user = await isAuthenticatedUser(req);

    // Create the response
    const response = NextResponse.json(
      {
        success: true,
        data: {
          _id: user._id,
          name: user.name || "",
          email: user.email,
          phone: user?.phone || "",
        },
      },
      { status: 200 }
    );

    // Disable caching
    response.headers.set(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, proxy-revalidate"
    );
    response.headers.set("Pragma", "no-cache");
    response.headers.set("Expires", "0");

    return response;
  } catch (error) {
    console.error("getMe error:", {
      message: error?.message,
      // stack: error.stack,
      name: error?.name,
    });
    return NextResponse.json(
      { success: false, message: error.message || "Internal Server Error" },
      { status: 401 }
    );
  }
}
