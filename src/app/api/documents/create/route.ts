import { Liveblocks } from "@liveblocks/node";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from '@/utils/supabase/server';

const liveblocks = new Liveblocks({
  secret: process.env.LIVEBLOCKS_SECRET_KEY!,
});

export async function POST(request: NextRequest) {
  try {
    // Get the current user from Supabase auth
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { title } = await request.json();
    const userId = session.user.id;
    const roomId = `doc-${Date.now()}-${userId}`;

    // Create a new room in Liveblocks
    const room = await liveblocks.createRoom("default", roomId, {
      defaultAccesses: ['room:write'],
      usersAccesses: {
        [userId]: ['room:write'],
      },
      metadata: {
        title,
        status: 'draft',
        createdAt: new Date().toISOString(),
        createdBy: userId,
        lastEditedBy: userId,
      },
    });

    return NextResponse.json({ roomId: room.id });
  } catch (error) {
    console.error('Error creating room:', error);
    return NextResponse.json(
      { error: 'Failed to create document' },
      { status: 500 }
    );
  }
} 