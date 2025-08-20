import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';

interface VideoConferenceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Participant {
  id: string;
  name: string;
  role: 'teacher' | 'student';
  isVideoOn: boolean;
  isAudioOn: boolean;
  stream?: MediaStream;
}

interface ScreenShareData {
  isSharing: boolean;
  sharedBy: string;
  stream?: MediaStream;
}

export function VideoConferenceModal({ isOpen, onClose }: VideoConferenceModalProps) {
  const { user } = useAuth();
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [screenShare, setScreenShare] = useState<ScreenShareData>({ isSharing: false, sharedBy: '' });
  const [chatMessages, setChatMessages] = useState<{id: string; sender: string; message: string; timestamp: Date}[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [showChat, setShowChat] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting');
  
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const screenShareRef = useRef<HTMLVideoElement>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const screenStreamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (isOpen) {
      initializeVideo();
      simulateConnection();
    } else {
      cleanup();
    }

    return () => cleanup();
  }, [isOpen]);

  const initializeVideo = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });
      
      localStreamRef.current = stream;
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      // Add current user as participant
      setParticipants([{
        id: user?.id || 'local',
        name: user?.name || 'You',
        role: user?.role as 'teacher' | 'student',
        isVideoOn: true,
        isAudioOn: true,
        stream
      }]);

    } catch (error) {
      console.error('Error accessing media devices:', error);
      alert('Unable to access camera/microphone. Please check permissions.');
    }
  };

  const simulateConnection = () => {
    setTimeout(() => {
      setConnectionStatus('connected');
      
      // Simulate other participants joining (for demo purposes)
      if (user?.role === 'student') {
        setParticipants(prev => [...prev, {
          id: 'teacher-1',
          name: 'Ms. Johnson',
          role: 'teacher',
          isVideoOn: true,
          isAudioOn: true
        }]);
      } else {
        setParticipants(prev => [...prev, 
          {
            id: 'student-1',
            name: 'Alice',
            role: 'student',
            isVideoOn: true,
            isAudioOn: false
          },
          {
            id: 'student-2', 
            name: 'Bob',
            role: 'student',
            isVideoOn: false,
            isAudioOn: true
          }
        ]);
      }
    }, 2000);
  };

  const cleanup = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
      localStreamRef.current = null;
    }
    if (screenStreamRef.current) {
      screenStreamRef.current.getTracks().forEach(track => track.stop());
      screenStreamRef.current = null;
    }
    setParticipants([]);
    setConnectionStatus('disconnected');
  };

  const toggleVideo = () => {
    const videoTrack = localStreamRef.current?.getVideoTracks()[0];
    if (videoTrack) {
      videoTrack.enabled = !videoTrack.enabled;
      setIsVideoOn(videoTrack.enabled);
      
      // Update participant state
      setParticipants(prev => prev.map(p => 
        p.id === (user?.id || 'local') 
          ? { ...p, isVideoOn: videoTrack.enabled }
          : p
      ));
    }
  };

  const toggleAudio = () => {
    const audioTrack = localStreamRef.current?.getAudioTracks()[0];
    if (audioTrack) {
      audioTrack.enabled = !audioTrack.enabled;
      setIsAudioOn(audioTrack.enabled);
      
      // Update participant state
      setParticipants(prev => prev.map(p => 
        p.id === (user?.id || 'local')
          ? { ...p, isAudioOn: audioTrack.enabled }
          : p
      ));
    }
  };

  const startScreenShare = async () => {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true
      });
      
      screenStreamRef.current = screenStream;
      if (screenShareRef.current) {
        screenShareRef.current.srcObject = screenStream;
      }
      
      setIsScreenSharing(true);
      setScreenShare({
        isSharing: true,
        sharedBy: user?.name || 'You',
        stream: screenStream
      });

      // Listen for screen share end
      screenStream.getVideoTracks()[0].addEventListener('ended', stopScreenShare);
      
    } catch (error) {
      console.error('Error starting screen share:', error);
    }
  };

  const stopScreenShare = () => {
    if (screenStreamRef.current) {
      screenStreamRef.current.getTracks().forEach(track => track.stop());
      screenStreamRef.current = null;
    }
    setIsScreenSharing(false);
    setScreenShare({ isSharing: false, sharedBy: '' });
  };

  const sendChatMessage = () => {
    if (!chatInput.trim()) return;

    const message = {
      id: Date.now().toString(),
      sender: user?.name || 'You',
      message: chatInput,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, message]);
    setChatInput('');
  };

  const leaveCall = () => {
    cleanup();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black">
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 bg-gray-900 text-white">
          <div className="flex items-center space-x-3">
            <div className={`w-3 h-3 rounded-full ${
              connectionStatus === 'connected' ? 'bg-green-500' : 
              connectionStatus === 'connecting' ? 'bg-yellow-500' : 'bg-red-500'
            }`}></div>
            <h2 className="text-xl font-bold">
              {user?.role === 'teacher' ? 'Teaching Session' : 'Learning Session'}
            </h2>
            <span className="text-gray-300 text-sm">
              {participants.length} participant{participants.length !== 1 ? 's' : ''}
            </span>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowChat(!showChat)}
              className="bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded-lg transition"
            >
              <i className="fa-solid fa-comments mr-2"></i>
              Chat
            </button>
            <button
              onClick={leaveCall}
              className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition"
            >
              <i className="fa-solid fa-sign-out-alt mr-2"></i>
              Leave
            </button>
          </div>
        </div>

        {/* Video Area */}
        <div className="flex-1 flex">
          {/* Main Video Area */}
          <div className={`${showChat ? 'w-3/4' : 'w-full'} flex flex-col`}>
            {/* Screen Share or Main Video */}
            <div className="flex-1 bg-gray-800 relative">
              {screenShare.isSharing ? (
                <div className="w-full h-full">
                  <video
                    ref={screenShareRef}
                    autoPlay
                    muted
                    className="w-full h-full object-contain"
                  />
                  <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded">
                    Screen shared by {screenShare.sharedBy}
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2 p-4 h-full">
                  {participants.slice(0, 4).map((participant) => (
                    <div key={participant.id} className="relative bg-gray-700 rounded-lg overflow-hidden">
                      {participant.isVideoOn ? (
                        participant.id === (user?.id || 'local') ? (
                          <video
                            ref={localVideoRef}
                            autoPlay
                            muted
                            className="w-full h-full object-cover mirror"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                            <div className="text-4xl">
                              {participant.name.charAt(0).toUpperCase()}
                            </div>
                          </div>
                        )
                      ) : (
                        <div className="w-full h-full bg-gray-600 flex items-center justify-center">
                          <div className="text-center text-white">
                            <div className="text-4xl mb-2">
                              {participant.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="text-sm">{participant.name}</div>
                          </div>
                        </div>
                      )}
                      
                      {/* Participant Info */}
                      <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
                        {participant.name}
                        {participant.role === 'teacher' && ' 👩‍🏫'}
                      </div>
                      
                      {/* Audio/Video Status */}
                      <div className="absolute top-2 right-2 flex space-x-1">
                        {!participant.isAudioOn && (
                          <div className="bg-red-500 text-white p-1 rounded">
                            <i className="fa-solid fa-microphone-slash text-xs"></i>
                          </div>
                        )}
                        {!participant.isVideoOn && (
                          <div className="bg-red-500 text-white p-1 rounded">
                            <i className="fa-solid fa-video-slash text-xs"></i>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Controls */}
            <div className="bg-gray-900 p-4 flex justify-center space-x-4">
              <button
                onClick={toggleAudio}
                className={`p-3 rounded-full transition ${
                  isAudioOn ? 'bg-gray-700 hover:bg-gray-600' : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                <i className={`fa-solid ${isAudioOn ? 'fa-microphone' : 'fa-microphone-slash'} text-white`}></i>
              </button>
              
              <button
                onClick={toggleVideo}
                className={`p-3 rounded-full transition ${
                  isVideoOn ? 'bg-gray-700 hover:bg-gray-600' : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                <i className={`fa-solid ${isVideoOn ? 'fa-video' : 'fa-video-slash'} text-white`}></i>
              </button>
              
              {user?.role === 'teacher' && (
                <button
                  onClick={isScreenSharing ? stopScreenShare : startScreenShare}
                  className={`p-3 rounded-full transition ${
                    isScreenSharing ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-700 hover:bg-gray-600'
                  }`}
                >
                  <i className="fa-solid fa-desktop text-white"></i>
                </button>
              )}
              
              <button className="p-3 rounded-full bg-gray-700 hover:bg-gray-600 transition">
                <i className="fa-solid fa-cog text-white"></i>
              </button>
            </div>
          </div>

          {/* Chat Sidebar */}
          {showChat && (
            <div className="w-1/4 bg-white border-l border-gray-300 flex flex-col">
              <div className="p-4 border-b border-gray-200">
                <h3 className="font-bold">Session Chat</h3>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {chatMessages.map((msg) => (
                  <div key={msg.id} className="text-sm">
                    <div className="font-semibold text-gray-700">{msg.sender}</div>
                    <div className="text-gray-600">{msg.message}</div>
                    <div className="text-xs text-gray-400">
                      {msg.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="p-4 border-t border-gray-200">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
                    placeholder="Type a message..."
                    className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    onClick={sendChatMessage}
                    className="bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600 transition"
                  >
                    <i className="fa-solid fa-paper-plane"></i>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}