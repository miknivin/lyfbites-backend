import { NextResponse } from "next/server";
import dbConnect from "@/lib/db/connection";
import { isAuthenticatedUser } from "@/middlewares/auth";
import SessionStartedOrder from "@/models/SessionStartedOrder";

export async function DELETE(req, { params }) {
  try {
    await dbConnect();
    const user = await isAuthenticatedUser(req);
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { sessionOrderId } = await params;
    if (!sessionOrderId) {
      return NextResponse.json(
        { success: false, error: "Session order ID is required" },
        { status: 400 }
      );
    }

    const deletedOrder = await SessionStartedOrder.findByIdAndDelete(
      sessionOrderId
    );
    if (!deletedOrder) {
      return NextResponse.json(
        { success: false, error: "Session order not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Session order deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting session order:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete session order" },
      { status: 500 }
    );
  }
}
