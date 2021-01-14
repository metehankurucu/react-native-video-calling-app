import {MediaStream} from 'react-native-webrtc';

export interface User {
  username: string;
  peerId: string;
}

export interface MainContext {
  username: string;
  setUsername: React.Dispatch<React.SetStateAction<string>>;
  peerId: string;
  setPeerId?: React.Dispatch<React.SetStateAction<string>>;
  users: User[];
  setUsers?: React.Dispatch<React.SetStateAction<User[]>>;
  localStream: MediaStream | null;
  setLocalStream?: React.Dispatch<React.SetStateAction<MediaStream | null>>;
  remoteStream: MediaStream | null;
  setRemoteStream?: React.Dispatch<React.SetStateAction<MediaStream | null>>;
  initialize: () => void;
  call: (user: User) => void;
  switchCamera: () => void;
  toggleMute: () => void;
  isMuted: boolean;
  closeCall: () => void;
  reset: () => void;
  remoteUser: User | null;
  activeCall: any;
}
