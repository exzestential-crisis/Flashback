// src/app/api/decks/route.ts - Using withAuth wrapper

import { NextRequest, NextResponse } from "next/server";
import { DeckWithCards, DeckWithCardsModel } from "@/lib/models/DeckModel";
import { withAuth } from "@/lib/supabase/server";

// Using the withAuth wrapper (cleanest approach)
export const GET = withAuth(async (request, supabase, user, actualUserId) => {
  try {
    console.log("Authenticated user ID (auth):", user.id);
    console.log("Actual user ID from users table:", actualUserId);

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const sortBy = searchParams.get("sort_by") || "last_modified";
    const sortOrder = searchParams.get("sort_order") || "desc";
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = parseInt(searchParams.get("offset") || "0");

    console.log("Query parameters:", { sortBy, sortOrder, limit, offset });

    // Validate sort_by field
    const validSortFields = [
      "last_modified",
      "last_studied",
      "created_at",
      "is_favourite",
      "title",
      "card_count",
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

    console.log("About to call RPC with params:", {
      p_user_id: actualUserId,
      p_limit: limit,
      p_offset: offset,
      p_sort_by: sortBy,
      p_sort_order: sortOrder,
    });

    // Call the RPC function
    const { data, error } = await supabase.rpc("get_decks_with_card_count", {
      p_user_id: actualUserId,
      p_limit: limit,
      p_offset: offset,
      p_sort_by: sortBy,
      p_sort_order: sortOrder,
    });

    console.log("RPC response - data:", data);
    console.log("RPC response - error:", error);

    if (error) {
      console.error("Supabase RPC error:", error);
      return NextResponse.json(
        { error: "Failed to fetch decks", details: error.message },
        { status: 500 }
      );
    }

    // Debug query
    const { data: allDecks, error: allDecksError } = await supabase
      .from("decks")
      .select("*")
      .eq("user_id", actualUserId);

    console.log("All decks for user:", allDecks);
    console.log("All decks error:", allDecksError);

    // Validate the data
    let validatedDecks;
    try {
      validatedDecks = data.map((deck: DeckWithCards) =>
        DeckWithCardsModel.parse(deck)
      );
    } catch (validationError) {
      console.error("Validation error:", validationError);
      console.log("Raw data that failed validation:", data);
      validatedDecks = data;
    }

    return NextResponse.json({
      decks: validatedDecks,
      count: data.length,
      limit,
      offset,
      sort_by: sortBy,
      sort_order: sortOrder,
      debug: {
        auth_user_id: user.id,
        actual_user_id: actualUserId,
        total_decks_in_db: allDecks?.length || 0,
        rpc_returned: data?.length || 0,
      },
    });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
});
