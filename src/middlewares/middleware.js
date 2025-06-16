import { NextRequest, NextResponse } from "next/server";

export function middleware(request) {
  const origin = request.headers.get("origin") || "*";
  const response = NextResponse.next();

  // Set CORS headers
  response.headers.set(
    "Access-Control-Allow-Origin",
    process.env.ALLOWED_URL || origin
  );
  response.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );
  response.headers.set("Access-Control-Allow-Credentials", "true");

  if (request.method === "OPTIONS") {
    return new NextResponse(null, { status: 204, headers: response.headers });
  }

  return response;
}

export const config = {
  matcher: "/api/:path*",
};
