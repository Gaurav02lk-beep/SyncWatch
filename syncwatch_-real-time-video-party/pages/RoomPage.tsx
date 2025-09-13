import React, { useState, useEffect, useRef } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { User, Message, VideoSource, VideoSourceType, Poll, Reaction } from '../types';
import VideoPlayer from '../components/VideoPlayer';
import InteractionPanel from '../components/InteractionPanel';

// Mock hook to simulate WebSocket connection
const useMockSocket = (roomId: string) => {
  const [participants, setParticipants] = useState<User[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackTime, setPlaybackTime] = useState(0);
  const [reactionsEnabled, setReactionsEnabled] = useState(true);
  const [latestReaction, setLatestReaction] = useState<Reaction | null>(null);

  const mockUsers = [
    { id: 'u2', name: 'Alice' },
    { id: 'u3', name: 'Bob' },
    { id: 'u4', name: 'Charlie' },
    { id: 'u5', name: 'Diana' },
  ];

  useEffect(() => {
    // Initial setup
    setParticipants([
      { id: 'u1', name: 'You', isHost: true },
      mockUsers[0],
      mockUsers[1],
    ]);
    
    setMessages([
      { id: 'm1', user: mockUsers[0], text: 'Hey everyone! Ready to watch?', timestamp: Date.now() - 60000 },
      { id: 'm2', user: mockUsers[1], text: 'Born ready! What are we watching?', timestamp: Date.now() - 30000 },
    ]);

    // Simulate events
    const interval = setInterval(() => {
      const randomAction = Math.random();

      if (randomAction < 0.15) { // New user joins
        setParticipants(prevParticipants => {
          if (prevParticipants.length >= 5) return prevParticipants;
          const availableUsers = mockUsers.filter(u => !prevParticipants.some(p => p.id === u.id));
          if (availableUsers.length > 0) {
            const newUser = availableUsers[Math.floor(Math.random() * availableUsers.length)];
            setMessages(prevMessages => [...prevMessages, { id: `m${Date.now()}`, user: {id: 'system', name: 'System'}, text: `${newUser.name} joined the room.`, timestamp: Date.now()}]);
            return [...prevParticipants, newUser];
          }
          return prevParticipants;
        });
      } else if (randomAction < 0.3) { // User sends a message
        setParticipants(prevParticipants => {
            if (prevParticipants.length > 1) {
                const randomUser = prevParticipants.filter(p=>p.id !== 'u1')[Math.floor(Math.random() * (prevParticipants.length-1))];
                if (randomUser) {
                  setMessages(prevMessages => [...prevMessages, { id: `m${Date.now()}`, user: randomUser, text: 'This is awesome!', timestamp: Date.now()}]);
                }
            }
            return prevParticipants;
        });
      } else if (randomAction < 0.4) { // A user leaves
         setParticipants(prevParticipants => {
            if (prevParticipants.length > 2) {
                const leavingCandidates = prevParticipants.filter(p => !p.isHost);
                if (leavingCandidates.length > 0) {
                    const userLeaving = leavingCandidates[Math.floor(Math.random() * leavingCandidates.length)];
                    setMessages(prevMessages => [...prevMessages, { id: `m${Date.now()}`, user: {id: 'system', name: 'System'}, text: `${userLeaving.name} left the room.`, timestamp: Date.now()}]);
                    return prevParticipants.filter(p => p.id !== userLeaving.id);
                }
            }
            return prevParticipants;
         });
      } else if (randomAction < 0.6) { // Send a reaction
        setReactionsEnabled(prevEnabled => {
            if (prevEnabled) {
                setParticipants(prevParticipants => {
                    if (prevParticipants.length > 1) {
                        const reactingParticipants = prevParticipants.filter(p => !p.isHost);
                        if (reactingParticipants.length > 0) {
                            const randomUser = reactingParticipants[Math.floor(Math.random() * reactingParticipants.length)];
                            const randomEmoji = ['❤️', '😂', '👍', '🔥', '🎉', '🤯'][Math.floor(Math.random() * 6)];
                            const newReaction: Reaction = {
                                id: `r${Date.now()}-${randomUser.id}`,
                                emoji: randomEmoji,
                                x: Math.random() * 80 + 10,
                                y: Math.random() * 20 + 75,
                            };
                            setLatestReaction(newReaction);
                        }
                    }
                    return prevParticipants;
                });
            }
            return prevEnabled;
        });
      }
    }, 5000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId]);

  // Mock functions to simulate sending events
  const sendMessage = (text: string) => {
    const user = { id: 'u1', name: 'You', isHost: true };
    setMessages(prev => [...prev, { id: `m${Date.now()}`, user, text, timestamp: Date.now() }]);
  };

  const syncPlayback = (action: 'play' | 'pause' | 'seek', time?: number) => {
    if (action === 'play') setIsPlaying(true);
    if (action === 'pause') setIsPlaying(false);
    if (action === 'seek' && time !== undefined) setPlaybackTime(time);
    console.log(`[MockSocket] Host action: ${action}`, time !== undefined ? `to ${time}s` : '');
  };

  const sendReaction = (emoji: string) => {
    if (!reactionsEnabled) return;
    const newReaction: Reaction = {
        id: `r${Date.now()}-u1`,
        emoji,
        x: Math.random() * 80 + 10,
        y: Math.random() * 20 + 75,
    };
    setLatestReaction(newReaction);
  };

  const toggleReactions = () => {
      setReactionsEnabled(prev => !prev);
  };

  return { participants, messages, isPlaying, playbackTime, reactionsEnabled, latestReaction, sendMessage, syncPlayback, sendReaction, toggleReactions };
};


const RoomPage: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const roomName = queryParams.get('name') || `Room ${roomId}`;

  const { participants, messages, isPlaying, playbackTime, reactionsEnabled, latestReaction, sendMessage, syncPlayback, sendReaction, toggleReactions } = useMockSocket(roomId!);
  
  const [videoSource, setVideoSource] = useState<VideoSource | null>(null);
  const [poll, setPoll] = useState<Poll | null>(null);
  const [activeReactions, setActiveReactions] = useState<Reaction[]>([]);
  
  const isHost = true; // Hardcoded for this demo

  useEffect(() => {
    if (latestReaction) {
        setActiveReactions(prevReactions => [...prevReactions, latestReaction]);
        const reactionId = latestReaction.id;
        setTimeout(() => {
            setActiveReactions(current => current.filter(r => r.id !== reactionId));
        }, 4000); // Corresponds to animation duration
    }
  }, [latestReaction]);


  const handleCreatePoll = (question: string, options: string[]) => {
      setPoll({
        id: `p${Date.now()}`,
        question,
        options: options.map((opt, i) => ({ id: `o${i}`, text: opt, votes: 0 })),
        isOpen: true
      });
  };

  const handleVote = (optionId: string) => {
    if (!poll || !poll.isOpen) return;
    setPoll(prevPoll => {
        if (!prevPoll) return null;
        const newOptions = prevPoll.options.map(opt => 
            opt.id === optionId ? { ...opt, votes: opt.votes + 1 } : opt
        );
        return { ...prevPoll, options: newOptions };
    });
  };

  const handleClosePoll = () => {
      if(poll) setPoll({...poll, isOpen: false });
  }

  const handleSetVideoSource = (source: VideoSource) => {
    setVideoSource(source);
  }

  return (
    <div className="container mx-auto">
      <div className="mb-4">
        <h1 className="text-3xl font-bold">{roomName}</h1>
        <p className="text-gray-500 dark:text-gray-400">Room Code: <span className="font-mono bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">{roomId}</span></p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-2/3">
           <VideoPlayer 
             source={videoSource}
             isPlaying={isPlaying}
             startTime={playbackTime}
             onPlaybackChange={syncPlayback}
             isHost={isHost}
             onSetVideoSource={handleSetVideoSource}
             reactions={activeReactions}
             reactionsEnabled={reactionsEnabled}
             onSendReaction={sendReaction}
             onToggleReactions={toggleReactions}
           />
        </div>
        <div className="lg:w-1/3">
            <InteractionPanel 
                participants={participants}
                messages={messages}
                poll={poll}
                isHost={isHost}
                onSendMessage={sendMessage}
                onCreatePoll={handleCreatePoll}
                onVote={handleVote}
                onClosePoll={handleClosePoll}
            />
        </div>
      </div>
    </div>
  );
};

export default RoomPage;
