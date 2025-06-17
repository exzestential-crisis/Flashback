// src/app/api/folders/route.ts

import { NextResponse, NextRequest } from "next/server";
import {
  FolderWithDecks,
  FolderWithDecksModel,
} from "@/lib/models/FolderModel";
import { withAuth } from "@/lib/supabase/server";

export const GET = withAuth(async (request, supabase, user, actualUserId) => {
  try {
    // Query parameters
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
      "deck_count", // Note: This will need special handling
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

    console.log("Fetching folders with params:", {
      userId: actualUserId,
      limit,
      offset,
      sortBy,
      sortOrder,
    });

    // Build the query
    let query = supabase
      .from("folders")
      .select(
        `
        *,
        deck_count:decks(count)
      `
      )
      .eq("user_id", actualUserId);

    // Handle sorting - deck_count needs special treatment
    if (sortBy === "deck_count") {
      query = query.order("created_at", { ascending: sortOrder === "asc" });
    } else {
      query = query.order(sortBy, { ascending: sortOrder === "asc" });
    }

    // Apply pagination
    const { data, error } = await query.range(offset, offset + limit - 1);

    if (error) {
      console.error("Supabase query error:", error);
      return NextResponse.json(
        { error: "Failed to fetch folders", details: error.message },
        { status: 500 }
      );
    }

    // Transform the data to match your expected format
    const transformedData =
      data?.map((folder: { deck_count: { count: any }[] }) => ({
        ...folder,
        deck_count: folder.deck_count?.[0]?.count || 0,
      })) || [];

    // If sorting by deck_count, sort in JavaScript
    if (sortBy === "deck_count") {
      transformedData.sort(
        (a: { deck_count: number }, b: { deck_count: number }) => {
          const diff = a.deck_count - b.deck_count;
          return sortOrder === "asc" ? diff : -diff;
        }
      );
    }

    let validatedFolders;
    try {
      validatedFolders = transformedData.map((folder: FolderWithDecks) =>
        FolderWithDecksModel.parse(folder)
      );
    } catch (validationError) {
      console.error("Validation error:", validationError);
      console.log("Raw data that failed validation:", transformedData);
      validatedFolders = transformedData;
    }

    return NextResponse.json({
      folders: validatedFolders,
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
