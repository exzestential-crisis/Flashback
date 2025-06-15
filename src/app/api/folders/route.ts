//src\app\api\folders\route.ts

import { NextResponse, NextRequest } from "next/server";
import {
  FolderWithDecks,
  FolderWithDecksModel,
} from "@/lib/models/FolderModel";
import { withAuth } from "@/lib/supabase/server";

export const GET = withAuth(async (request, supabase, user, actualUserId) => {
  try {
    // query parameters
    const { searchParams } = new URL(request.url);
    const sortBy = searchParams.get("sort_by") || "last_modified";
    const sortOrder = searchParams.get("sort_order") || "desc";
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = parseInt(searchParams.get("offset") || "0");

    const validSortFields = [
      "last_modified",
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

    if (!["asc", "desc"].includes(sortOrder)) {
      return NextResponse.json(
        { error: "Invalid sort_order. Use 'asc' or 'desc'" },
        { status: 400 }
      );
    }

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

    const { data, error } = await supabase.rpc("get_folders_with_deck_count", {
      p_user_id: actualUserId,
      p_limit: limit,
      p_offset: offset,
      p_sort_by: sortBy,
      p_sort_order: sortOrder,
    });

    if (error) {
      console.error("Supabase RPC error:", error);
      return NextResponse.json(
        { error: "Failed to fetch decks", details: error.message },
        { status: 500 }
      );
    }

    let validatedFolders;
    try {
      validatedFolders = data.map((folder: FolderWithDecks) =>
        FolderWithDecksModel.parse(folder)
      );
    } catch (validationError) {
      console.error("Validation error:", validationError);
      console.log("Raw data that failed validation:", data);
      validatedFolders = data;
    }
    return NextResponse.json({
      folders: validatedFolders,
      count: data.length,
      limit,
      offset,
      sort_by: sortBy,
      sort_order: sortOrder,
      // debug: {
      //   auth_user_id: user.id,
      //   actual_user_id: actualUserId,
      //   total_decks_in_db: allDecks?.length || 0,
      //   rpc_returned: data?.length || 0,
      // },
    });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
});
