// src/app/api/decks/[deckId]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { DeckWithCards, DeckWithCardsModel } from "@/lib/models/DeckModel";
import { withAuth } from "@/lib/supabase/server";
import { z } from "zod";

// Validation schema for deck updates
const UpdateDeckSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  description: z.string().max(1000).optional(),
  folder_id: z.number().int().optional(),
  is_favorite: z.boolean().optional(),
  is_public: z.boolean().optional(),
});

// GET single deck
export const GET = withAuth(
  async (request, supabase, user, actualUserId, { params }) => {
    try {
      const deckId = parseInt(params.deckId);

      if (isNaN(deckId)) {
        return NextResponse.json({ error: "Invalid deck ID" }, { status: 400 });
      }

      console.log("Fetching deck:", { deckId, userId: actualUserId });

      // Query the deck with related data
      const { data, error } = await supabase
        .from("decks")
        .select(
          `
        *,
        folder:folders(color_id, name),
        card_count:cards(count)
      `
        )
        .eq("deck_id", deckId)
        .eq("user_id", actualUserId)
        .eq("is_deleted", false)
        .single();

      if (error) {
        console.error("Supabase query error:", error);

        if (error.code === "PGRST116") {
          return NextResponse.json(
            { error: "Deck not found" },
            { status: 404 }
          );
        }

        return NextResponse.json(
          { error: "Failed to fetch deck", details: error.message },
          { status: 500 }
        );
      }

      // Transform the data to match expected format
      const transformedData = {
        ...data,
        card_count: data.card_count?.[0]?.count || 0,
      };

      // Validate the data
      let validatedDeck;
      try {
        validatedDeck = DeckWithCardsModel.parse(transformedData);
      } catch (validationError) {
        console.error("Validation error:", validationError);
        console.log("Raw data that failed validation:", transformedData);
        validatedDeck = transformedData;
      }

      return NextResponse.json({
        deck: validatedDeck,
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

// PUT update deck
export const PUT = withAuth(
  async (request, supabase, user, actualUserId, { params }) => {
    try {
      const deckId = parseInt(params.deckId);

      if (isNaN(deckId)) {
        return NextResponse.json({ error: "Invalid deck ID" }, { status: 400 });
      }

      // Parse request body
      const body = await request.json();

      // Validate the request body
      const validationResult = UpdateDeckSchema.safeParse(body);
      if (!validationResult.success) {
        return NextResponse.json(
          {
            error: "Invalid request data",
            details: validationResult.error.issues,
          },
          { status: 400 }
        );
      }

      const updateData = validationResult.data;

      console.log("Updating deck:", {
        deckId,
        userId: actualUserId,
        updateData,
      });

      // Check if deck exists and belongs to user
      const { data: existingDeck, error: checkError } = await supabase
        .from("decks")
        .select("deck_id")
        .eq("deck_id", deckId)
        .eq("user_id", actualUserId)
        .eq("is_deleted", false)
        .single();

      if (checkError) {
        if (checkError.code === "PGRST116") {
          return NextResponse.json(
            { error: "Deck not found" },
            { status: 404 }
          );
        }

        return NextResponse.json(
          {
            error: "Failed to verify deck ownership",
            details: checkError.message,
          },
          { status: 500 }
        );
      }

      // If folder_id is being updated, verify the folder exists and belongs to user
      if (updateData.folder_id) {
        const { data: folder, error: folderError } = await supabase
          .from("folders")
          .select("folder_id")
          .eq("folder_id", updateData.folder_id)
          .eq("user_id", actualUserId)
          .single();

        if (folderError || !folder) {
          return NextResponse.json(
            { error: "Folder not found or not accessible" },
            { status: 400 }
          );
        }
      }

      // Update the deck
      const { data, error } = await supabase
        .from("decks")
        .update({
          ...updateData,
          last_modified: new Date().toISOString(),
        })
        .eq("deck_id", deckId)
        .eq("user_id", actualUserId)
        .select(
          `
        *,
        folder:folders(color_id, name),
        card_count:cards(count)
      `
        )
        .single();

      if (error) {
        console.error("Supabase update error:", error);
        return NextResponse.json(
          { error: "Failed to update deck", details: error.message },
          { status: 500 }
        );
      }

      // Transform the data to match expected format
      const transformedData = {
        ...data,
        card_count: data.card_count?.[0]?.count || 0,
      };

      // Validate the data
      let validatedDeck;
      try {
        validatedDeck = DeckWithCardsModel.parse(transformedData);
      } catch (validationError) {
        console.error("Validation error:", validationError);
        console.log("Raw data that failed validation:", transformedData);
        validatedDeck = transformedData;
      }

      return NextResponse.json({
        deck: validatedDeck,
        message: "Deck updated successfully",
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

// DELETE deck (soft delete)
export const DELETE = withAuth(
  async (request, supabase, user, actualUserId, { params }) => {
    try {
      const deckId = parseInt(params.deckId);

      if (isNaN(deckId)) {
        return NextResponse.json({ error: "Invalid deck ID" }, { status: 400 });
      }

      console.log("Deleting deck:", { deckId, userId: actualUserId });

      // Check if deck exists and belongs to user
      const { data: existingDeck, error: checkError } = await supabase
        .from("decks")
        .select("deck_id, name")
        .eq("deck_id", deckId)
        .eq("user_id", actualUserId)
        .eq("is_deleted", false)
        .single();

      if (checkError) {
        if (checkError.code === "PGRST116") {
          return NextResponse.json(
            { error: "Deck not found" },
            { status: 404 }
          );
        }

        return NextResponse.json(
          {
            error: "Failed to verify deck ownership",
            details: checkError.message,
          },
          { status: 500 }
        );
      }

      // Soft delete the deck
      const { error } = await supabase
        .from("decks")
        .update({
          is_deleted: true,
          deleted_at: new Date().toISOString(),
          last_modified: new Date().toISOString(),
        })
        .eq("deck_id", deckId)
        .eq("user_id", actualUserId);

      if (error) {
        console.error("Supabase delete error:", error);
        return NextResponse.json(
          { error: "Failed to delete deck", details: error.message },
          { status: 500 }
        );
      }

      return NextResponse.json({
        message: "Deck deleted successfully",
        deck_id: deckId,
        deck_name: existingDeck.name,
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
