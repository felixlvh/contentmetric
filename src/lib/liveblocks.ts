import { createClient } from "@liveblocks/client";
import { createRoomContext } from "@liveblocks/react";

// Define the shape of our Presence - the state synced with all users in the room
export type Presence = {
  // cursor position, avatar, name, etc.
  cursor: { x: number; y: number } | null;
  name?: string;
  color?: string;
};

// Define the shape of our Storage - the persisted state synced with all users
export type Storage = {
  // Document content, etc.
  content: string;
  version: number;
  lastSavedAt?: string;
  title?: string;
  metadata?: {
    createdBy?: string;
    lastEditedBy?: string;
    status?: 'draft' | 'published';
  };
};

// Define custom events that can be broadcasted to all users in the room
export type UserMeta = {
  id: string;
  info: {
    name?: string;
    color?: string;
    avatar?: string;
  };
};

export type RoomEvent = {
  type: "NOTIFICATION";
  message: string;
} | {
  type: "SAVE_COMPLETE";
  timestamp: string;
};

// Create a Liveblocks client with enhanced error handling
const client = createClient({
  authEndpoint: "/api/liveblocks-auth",
  throttle: 100,
});

// Create a Liveblocks room context with all available hooks
export const {
  RoomProvider,
  useRoom,
  useMyPresence,
  useUpdateMyPresence,
  useSelf,
  useOthers,
  useOthersMapped,
  useOthersConnectionIds,
  useOther,
  useBroadcastEvent,
  useEventListener,
  useErrorListener,
  useStorage,
  useMutation,
  useHistory,
  useUndo,
  useRedo,
  useCanUndo,
  useCanRedo,
  useBatch,
} = createRoomContext<Presence, Storage, UserMeta, RoomEvent>(client); 