import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export default function sendToken(user, statusCode) {
  try {
    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined in environment variables");
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, {
      expiresIn: "7d",
    });

    const response = NextResponse.json(
      {
        success: true,
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          // Do NOT include password in the response
        },
      },
      { status: statusCode }
    );

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: true, // Must be true for SameSite=None
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict", // Use "none" in production for cross-origin
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: "/", // Ensure cookie is available for all paths
    });

    return response;
  } catch (error) {
    console.error("sendToken error:", {
      message: error.message,
      stack: error.stack,
    });
    throw error;
  }
}
