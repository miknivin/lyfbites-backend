import { NextResponse } from "next/server";
import dbConnect from "@/lib/db/connection";
import Products from "@/models/Products"; // Fixed typo in import
import APIFilters from "../../utils/apiFilters";

export async function GET(req) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const resPerPage = parseInt(searchParams.get("resPerPage")) || 50;
    const queryParams = Object.fromEntries(searchParams.entries());

    const apiFilters = new APIFilters(Products, queryParams).search().filter();

    // Get total count of filtered products
    let filteredProducts = await apiFilters.query;
    const filteredProductsCount = filteredProducts.length;

    // Apply pagination
    apiFilters.pagination(resPerPage);
    filteredProducts = await apiFilters.query
      .clone()
      .skip((page - 1) * resPerPage)
      .limit(resPerPage);

    return NextResponse.json(
      {
        success: true,
        resPerPage,
        filteredProductsCount,
        filteredProducts,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in GET /products:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
