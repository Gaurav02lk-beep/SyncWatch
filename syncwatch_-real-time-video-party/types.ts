export interface User {
  id: string;
  name: string;
  isHost?: boolean;
}

export interface Message {
  id: string;
  user: User;
  text: string;
  timestamp: number;
}

export enum VideoSourceType {
  YOUTUBE = 'YOUTUBE',
  URL = 'URL',
  UPLOAD = 'UPLOAD',
}

export interface VideoSource {
  type: VideoSourceType;
  url: string;
}

export interface PollOption {
  id: string;
  text: string;
  votes: number;
}

export interface Poll {
  id: string;
  question: string;
  options: PollOption[];
  isOpen: boolean;
}

export interface Reaction {
  id: string;
  emoji: string;
  x: number;
  y: number;
}

export interface RoomState {
  id: string;
  name: string;
  participants: User[];
  messages: Message[];
  videoSource: VideoSource | null;
  isPlaying: boolean;
  playbackTime: number;
  lastSyncTime: number;
  poll: Poll | null;
  reactions: Reaction[];
}