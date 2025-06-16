import dbConnect from "@/lib/db/connection";
import { isAuthenticatedUser } from "@/middlewares/auth";
import Order from "@/models/Order";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await dbConnect();
    const user = await isAuthenticatedUser(req);

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const {
      orderItems,
      shippingInfo,
      itemsPrice,
      taxAmount,
      shippingAmount,
      totalAmount,
      paymentMethod,
      paymentInfo,
      orderNotes,
    } = body;

    // Validate orderItems.image
    for (const item of orderItems) {
      if (!item.image) {
        return NextResponse.json(
          {
            success: false,
            message: `Image is required for product ${item.name}`,
          },
          { status: 400 }
        );
      }
    }

    const order = await Order.create({
      orderItems: orderItems.map((item) => ({
        name: item.name,
        quantity: item.quantity,
        image: item.image,
        price: item.price.toString(), // Convert Number to String
        product: item.product, // Valid ObjectId string
      })),
      shippingInfo: {
        fullName: shippingInfo.name,
        address: shippingInfo.address,
        email: shippingInfo.email || "",
        state: shippingInfo.state || "",
        city: shippingInfo.city,
        phoneNo: shippingInfo.phoneNo,
        zipCode: shippingInfo.pinCode,
        country: shippingInfo.country || "India",
      },
      itemsPrice,
      taxAmount,
      shippingAmount,
      totalAmount,
      paymentMethod,
      paymentInfo,
      orderNotes,
      user: user._id,
    });

    return NextResponse.json({ success: true, order }, { status: 200 });
  } catch (error) {
    console.error("Order creation failed:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to create order" },
      { status: 400 }
    );
  }
}
