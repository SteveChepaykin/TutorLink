// src/app/conference/components/conference-page__types.tsx

export interface Message {
  sender: string;
  text: string;
  timestamp: number;
}

export interface Participant {
  id: string;
  name: string;
  avatar: string;
  isMuted: boolean;
  isVideoOff: boolean;
}
