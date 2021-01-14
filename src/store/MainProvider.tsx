import React, {useState} from 'react';
import {Alert} from 'react-native';
import {
  mediaDevices,
  MediaStream,
  MediaStreamConstraints,
} from 'react-native-webrtc';
import socketio from 'socket.io-client';
import {MainContext as MainContextType, User} from '../interfaces';
import {
  SERVER_URL,
  PEER_SERVER_HOST,
  PEER_SERVER_PORT,
  PEER_SERVER_PATH,
} from '../server';
// @ts-ignore
import Peer from 'react-native-peerjs';
import {navigate} from '../helpers/RootNavigation';

const initialValues: MainContextType = {
  username: '',
  peerId: '',
  users: [],
  localStream: null,
  remoteStream: null,
  remoteUser: null,
  initialize: () => {},
  setUsername: () => {},
  call: () => {},
  switchCamera: () => {},
  toggleMute: () => {},
  isMuted: false,
  closeCall: () => {},
  reset: () => {},
  activeCall: null,
};

export const MainContext = React.createContext(initialValues);

interface Props {}

const MainContextProvider: React.FC<Props> = ({children}) => {
  const [username, setUsername] = useState(initialValues.username);
  const [peerId, setPeerId] = useState(initialValues.peerId);
  const [users, setUsers] = useState<User[]>(initialValues.users);
  const [localStream, setLocalStream] = useState<MediaStream | null>(
    initialValues.localStream,
  );
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(
    initialValues.remoteStream,
  );
  const [remoteUser, setRemoteUser] = useState<User | null>(null);
  const [socket, setSocket] = useState<SocketIOClient.Socket | null>(null);
  const [peerServer, setPeerServer] = useState<any>(null);
  const [isMuted, setIsMuted] = useState(initialValues.isMuted);
  const [activeCall, setActiveCall] = useState<any>(null);

  const initialize = async () => {
    const isFrontCamera = true;
    const devices = await mediaDevices.enumerateDevices();

    const facing = isFrontCamera ? 'front' : 'environment';
    const videoSourceId = devices.find(
      (device: any) => device.kind === 'videoinput' && device.facing === facing,
    );
    const facingMode = isFrontCamera ? 'user' : 'environment';
    const constraints: MediaStreamConstraints = {
      audio: true,
      video: {
        mandatory: {
          minWidth: 1280,
          minHeight: 720,
          minFrameRate: 30,
        },
        facingMode,
        optional: videoSourceId ? [{sourceId: videoSourceId}] : [],
      },
    };

    const newStream = await mediaDevices.getUserMedia(constraints);

    setLocalStream(newStream as MediaStream);

    const io = socketio.connect(SERVER_URL, {
      reconnection: true,
      autoConnect: true,
    });

    io.on('connect', () => {
      setSocket(io);
      io.emit('register', username);
    });

    io.on('users-change', (users: User[]) => {
      setUsers(users);
    });

    io.on('accepted-call', (user: User) => {
      setRemoteUser(user);
    });

    io.on('rejected-call', (user: User) => {
      setRemoteUser(null);
      setActiveCall(null);
      Alert.alert('Your call request rejected by ' + user?.username);
      navigate('Users');
    });

    io.on('not-available', (username: string) => {
      setRemoteUser(null);
      setActiveCall(null);
      Alert.alert(username + ' is not available right now');
      navigate('Users');
    });

    const peerServer = new Peer(undefined, {
      host: PEER_SERVER_HOST,
      path: PEER_SERVER_PATH,
      secure: true,
      port: PEER_SERVER_PORT,
      config: {
        iceServers: [
          {
            urls: [
              'stun:stun1.l.google.com:19302',
              'stun:stun2.l.google.com:19302',
            ],
          },
        ],
      },
    });

    peerServer.on('error', (err: Error) =>
      console.log('Peer server error', err),
    );

    peerServer.on('open', (peerId: string) => {
      setPeerServer(peerServer);
      setPeerId(peerId);
      io.emit('set-peer-id', peerId);
    });

    io.on('call', (user: User) => {
      peerServer.on('call', (call: any) => {
        setRemoteUser(user);
        Alert.alert(
          'New Call',
          'You have a new call from ' + user?.username,
          [
            {
              text: 'Reject',
              onPress: () => {
                io.emit('reject-call', user?.username);
                setRemoteUser(null);
                setActiveCall(null);
              },
              style: 'cancel',
            },
            {
              text: 'Accept',
              onPress: () => {
                io.emit('accept-call', user?.username);
                call.answer(newStream);
                setActiveCall(call);
                navigate('Call');
              },
            },
          ],
          {cancelable: false},
        );

        call.on('stream', (stream: MediaStream) => {
          setRemoteStream(stream);
        });

        call.on('close', () => {
          closeCall();
        });

        call.on('error', () => {});
      });
    });
  };

  const call = (user: User) => {
    if (!peerServer || !socket) {
      Alert.alert('Peer server or socket connection not found');
      return;
    }

    if (!user.peerId) {
      Alert.alert('User not connected to peer server');
      return;
    }

    socket.emit('call', user.username);

    setRemoteUser(user);

    try {
      const call = peerServer.call(user.peerId, localStream);

      call.on(
        'stream',
        (stream: MediaStream) => {
          setActiveCall(call);
          setRemoteStream(stream);
        },
        (err: Error) => {
          console.error('Failed to get call stream', err);
        },
      );
    } catch (error) {
      console.log('Calling error', error);
    }
  };

  const switchCamera = () => {
    if (localStream) {
      // @ts-ignore
      localStream.getVideoTracks().forEach((track) => track._switchCamera());
    }
  };

  const toggleMute = () => {
    if (localStream)
      localStream.getAudioTracks().forEach((track) => {
        track.enabled = !track.enabled;
        setIsMuted(!track.enabled);
      });
  };

  const closeCall = () => {
    activeCall?.close();
    setActiveCall(null);
    setRemoteUser(null);
    navigate('Users');
    Alert.alert('Call is ended');
  };

  const reset = async () => {
    peerServer?.destroy();
    socket?.disconnect();
    setActiveCall(null);
    setRemoteUser(null);
    setLocalStream(null);
    setRemoteStream(null);
    setUsername('');
    setPeerId('');
  };

  return (
    <MainContext.Provider
      value={{
        username,
        setUsername,
        peerId,
        setPeerId,
        users,
        setUsers,
        localStream,
        setLocalStream,
        remoteStream,
        setRemoteStream,
        initialize,
        call,
        switchCamera,
        toggleMute,
        isMuted,
        closeCall,
        reset,
        remoteUser,
        activeCall,
      }}>
      {children}
    </MainContext.Provider>
  );
};

export default MainContextProvider;
