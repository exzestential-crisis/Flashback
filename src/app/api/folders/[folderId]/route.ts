// src/app/api/folders/[folderId]/route.ts

import { NextRequest, NextResponse } from "next/server";
import {
  FolderWithDecks,
  FolderWithDecksModel,
} from "@/lib/models/FolderModel";
import { withAuth } from "@/lib/supabase/server";

// GET - Fetch a specific folder by ID
export const GET = withAuth(
  async (request, supabase, user, actualUserId, params) => {
    try {
      const { folderId } = await params;

      if (!folderId) {
        return NextResponse.json(
          { error: "Folder ID is required" },
          { status: 400 }
        );
      }

      console.log("Fetching folder:", {
        folderId,
        userId: actualUserId,
      });

      // First, let's check if there are any decks for this user at all
      const { data: allDecks } = await supabase
        .from("decks")
        .select("deck_id, name, folder_id")
        .eq("user_id", actualUserId);

      console.log("All decks for user:", allDecks);

      // Query the specific folder with deck count
      const { data, error } = await supabase
        .from("folders")
        .select(
          `
          *,
          deck_count:decks(count),
          decks (
            deck_id,
            name,
            description,
            created_at,
            last_modified,
            last_studied,
            is_favorite,
            card_count:cards(count)
          )
        `
        )
        .eq("folder_id", folderId)
        .eq("user_id", actualUserId)
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          return NextResponse.json(
            { error: "Folder not found" },
            { status: 404 }
          );
        }
        console.error("Supabase query error:", error);
        return NextResponse.json(
          { error: "Failed to fetch folder", details: error.message },
          { status: 500 }
        );
      }

      console.log(
        "Raw folder data from Supabase:",
        JSON.stringify(data, null, 2)
      );

      // Transform the data - FIXED: Include decks in the response
      const transformedData = {
        ...data,
        deck_count: data.deck_count?.[0]?.count || 0,
        decks:
          data.decks?.map((deck: any) => ({
            ...deck,
            card_count: deck.card_count?.[0]?.count || 0,
          })) || [],
      };

      // Validate the data
      let validatedFolder;
      try {
        validatedFolder = FolderWithDecksModel.parse(transformedData);
      } catch (validationError) {
        console.error("Validation error:", validationError);
        console.log("Raw data that failed validation:", transformedData);
        validatedFolder = transformedData;
      }

      console.log("Returning folder with decks:", {
        folderId: validatedFolder.folder_id,
        deckCount: validatedFolder.decks?.length || 0,
      });

      return NextResponse.json({
        folder: validatedFolder,
      });
    } catch (error) {
      console.error("API error:", error);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  }
);
