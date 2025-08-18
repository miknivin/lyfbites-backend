import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json(
    { message: "Logged Out" },
    { status: 200 }
  );
<<<<<<< HEAD
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


  console.log(new Date(Date.now()));
  console.log(response.cookies.get("token")); // Log the cookie for debugging
=======

  response.cookies.set("token", "", {
    expires: new Date(Date.now()), // Expire immediately
    httpOnly: true,
  });

>>>>>>> c6852e18bc90484457ba3cca87652f786a9db977
  return response;
}
