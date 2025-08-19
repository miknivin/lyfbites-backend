import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json(
    { message: "Logged Out" },
    { status: 200 }
  );
  console.log("Logging out...-1");
  // response.cookies.set("token", "", {
  //   expires: new Date(Date.now()), // Expire immediately
  //   httpOnly: true,
  // }); 

   response.cookies.set("token", "", {
     expires: new Date(0),
     httpOnly: true,
     secure: true,
     sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    path: "/",
   });

// // Log the cookie for debugging
  return response;
}
