// src/app/api/users/[userId]/decks/route.ts
// COMPLETE VERSION: Has both sorting AND card counts

import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-sever";
import { DeckWithCards, DeckWithCardsModel } from "@/lib/models/DeckModel";

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  const { userId } = params;
  const { searchParams } = new URL(request.url);

  // sorting options
  const sortBy = searchParams.get("sort_by") || "last_modified"; // last_modified, last_studied, created_at, title
  const sortOrder = searchParams.get("sort_order") || "desc"; // asc or desc
  const limit = parseInt(searchParams.get("limit") || "20"); // 20 decks per page
  const offset = parseInt(searchParams.get("offset") || "0"); // deck ofset (i.e., 1-20 cards, 21-40, etc.)

  // Validate sort_by field (add card_count as new option)
  const validSortFields = [
    "last_modified",
    "last_studied",
    "created_at",
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

  try {
    const { data, error } = await supabaseServer.rpc(
      "get_decks_with_card_count",
      {
        p_user_id: userId,
        p_limit: limit,
        p_offset: offset,
        p_sort_by: sortBy,
        p_sort_order: sortOrder,
      }
    );

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Validate the data
    const validatedDecks = data.map((deck: DeckWithCards) =>
      DeckWithCardsModel.parse(deck)
    );

    return NextResponse.json({
      decks: validatedDecks,
      count: data.length,
      limit,
      offset,
      user_id: userId,
      sort_by: sortBy,
      sort_order: sortOrder,
    });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
