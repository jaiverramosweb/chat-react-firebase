import { create } from "zustand";

export interface Friend {
  uid: string;
  displayName: string;
  photoURL: string;
  lastMessage: string;
  roomId: string;
}

interface ChatState {
  friend: Friend | null;
  setFriend: (friend: Friend) => void;
  resetfriend: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  friend: null,
  setFriend: (friend: Friend) =>
    set(() => ({
      friend,
    })),

  resetfriend: () =>
    set(() => ({
      friend: null,
    })),
}));
