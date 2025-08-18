import { NextRequest, NextResponse } from "next/server";
import User from "@/models/User";
import { isAuthenticatedUser } from "@/middlewares/auth";
import mongoose from "mongoose";

export async function PATCH(req) {
  try {
    console.log("update called inside patch");

    // Authenticate user
    const user = await isAuthenticatedUser(req);
    if (!user || !user._id) {
      return NextResponse.json(
        { success: false, error: "Please log in to update your profile" },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await req.json();
    const { name, email, phone } = body;

    // Validate input
    if (!name && !email && !phone) {
      return NextResponse.json(
        { success: false, error: "At least one field is required" },
        { status: 400 }
      );
    }

    // Update user in MongoDB
    const updatedUser = await User.findByIdAndUpdate(
      new mongoose.Types.ObjectId(user._id),
      {
        name,
        email,
        phone,
      },
      {
        new: true,
        runValidators: true,
        select: "name email phone",
      }
    );

    if (!updatedUser) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        user: {
          id: updatedUser._id.toString(),
          name: updatedUser.name,
          email: updatedUser.email,
          phone: updatedUser.phone,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Update user error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update profile" },
      { status: 500 }
    );
  }
}
