import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-sever";
import {
  FolderModel,
  FolderWithDecks,
  FolderWithDecksModel,
} from "@/lib/models/FolderModel";
import { count } from "console";

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  const userId = request.nextUrl.pathname.match(/\/users\/([^/]+)/)?.[1];
  const { searchParams } = new URL(request.url);

  // sorting options
  const sortBy = searchParams.get("sort_by") || "last_modified"; // last_modified, created_at, title
  const sortOrder = searchParams.get("sort_order") || "desc"; // asc or desc
  const limit = parseInt(searchParams.get("limit") || "20"); // 20 decks per page
  const offset = parseInt(searchParams.get("offset") || "0"); // deck ofset (i.e., 1-20 cards, 21-40, etc.)}

  const validSortFields = [
    "deck_count",
    "last_modified",
    "created_at",
    "is_favourite",
    "name",
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

  try {
    const { data, error } = await supabaseServer.rpc(
      "get_folders_with_deck_count",
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
    const validatedFolders = data.map((folder: FolderWithDecks) =>
      FolderWithDecksModel.parse(folder)
    );

    return NextResponse.json({
      folders: validatedFolders,
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
