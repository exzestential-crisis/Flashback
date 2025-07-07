// src/app/api/decks/route.ts

import { NextRequest, NextResponse } from "next/server";
import { DeckWithCards, DeckWithCardsModel } from "@/lib/models/DeckModel";
import { withAuth } from "@/lib/supabase/server";

export const GET = withAuth(async (request, supabase, user, actualUserId) => {
  try {
    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const sortBy = searchParams.get("sort_by") || "last_modified";
    const sortOrder = searchParams.get("sort_order") || "desc";
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = parseInt(searchParams.get("offset") || "0");

    // Validate sort_by field
    const validSortFields = [
      "last_modified",
      "last_studied",
      "created_at",
      "is_favourite",
      "title",
      "card_count", // Note: This will need special handling
    ];
    if (!validSortFields.includes(sortBy)) {
      return NextResponse.json(
        { error: "Invalid sort_by field" },
        { status: 400 }
      );
    }

    // Validate sort_order
    if (!["asc", "desc"].includes(sortOrder)) {
      return NextResponse.json(
        { error: "Invalid sort_order. Use 'asc' or 'desc'" },
        { status: 400 }
      );
    }

    // Validate limit and offset
    if (limit < 1 || limit > 100) {
      return NextResponse.json(
        { error: "Limit must be between 1 and 100" },
        { status: 400 }
      );
    }

    if (offset < 0) {
      return NextResponse.json(
        { error: "Offset must be non-negative" },
        { status: 400 }
      );
    }

    console.log("Fetching decks with params:", {
      userId: actualUserId,
      limit,
      offset,
      sortBy,
      sortOrder,
    });

    // Build the query
    let query = supabase
      .from("decks")
      .select(
        `
        *,
        folder:folders(color_id, name),
        card_count:cards(count)
      `
      )
      .eq("user_id", actualUserId);

    // Handle sorting - card_count needs special treatment
    if (sortBy === "card_count") {
      // For card_count, we might need to handle this differently
      // Supabase might not sort aggregated fields directly
      query = query.order("created_at", { ascending: sortOrder === "asc" });
    } else {
      query = query.order(sortBy, { ascending: sortOrder === "asc" });
    }

    // Apply pagination
    const { data, error } = await query.range(offset, offset + limit - 1);

    console.log("Query response - data:", data);
    console.log("Query response - error:", error);

    if (error) {
      console.error("Supabase query error:", error);
      return NextResponse.json(
        { error: "Failed to fetch decks", details: error.message },
        { status: 500 }
      );
    }

    // Transform the data to match your expected format
    const transformedData =
      data?.map((deck: { card_count: { count: any }[] }) => ({
        ...deck,
        card_count: deck.card_count?.[0]?.count || 0,
      })) || [];

    // If sorting by card_count, sort in JavaScript
    if (sortBy === "card_count") {
      transformedData.sort(
        (a: { card_count: number }, b: { card_count: number }) => {
          const diff = a.card_count - b.card_count;
          return sortOrder === "asc" ? diff : -diff;
        }
      );
    }

    // Validate the data
    let validatedDecks;
    try {
      validatedDecks = transformedData.map((deck: DeckWithCards) =>
        DeckWithCardsModel.parse(deck)
      );
    } catch (validationError) {
      console.error("Validation error:", validationError);
      console.log("Raw data that failed validation:", transformedData);
      validatedDecks = transformedData;
    }

    return NextResponse.json({
      decks: validatedDecks,
      count: transformedData.length,
      limit,
      offset,
      sort_by: sortBy,
      sort_order: sortOrder,
    });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
});
