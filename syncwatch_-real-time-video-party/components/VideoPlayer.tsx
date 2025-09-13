import React, { useRef, useEffect, useState } from 'react';
import YouTube from 'react-youtube';
import { VideoSource, VideoSourceType, Reaction } from '../types';
import { PlayIcon, PauseIcon } from './Icons';
import ReactionsOverlay from './ReactionsOverlay';
import ReactionButtons from './ReactionButtons';

interface VideoPlayerProps {
  source: VideoSource | null;
  isPlaying: boolean;
  startTime: number;
  onPlaybackChange: (action: 'play' | 'pause' | 'seek', time: number) => void;
  isHost: boolean;
  onSetVideoSource: (source: VideoSource) => void;
  reactions: Reaction[];
  reactionsEnabled: boolean;
  onSendReaction: (emoji: string) => void;
  onToggleReactions: () => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ source, isPlaying, startTime, onPlaybackChange, isHost, onSetVideoSource, reactions, reactionsEnabled, onSendReaction, onToggleReactions }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const youtubePlayerRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [videoUrlInput, setVideoUrlInput] = useState('');

  // Effect to revoke object URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      if (source?.type === VideoSourceType.UPLOAD && source.url.startsWith('blob:')) {
        URL.revokeObjectURL(source.url);
      }
    };
  }, [source]);
  
  useEffect(() => {
    if (!isHost) {
      if ((source?.type === VideoSourceType.URL || source?.type === VideoSourceType.UPLOAD) && videoRef.current) {
        if (isPlaying) {
          videoRef.current.play().catch(console.error);
        } else {
          videoRef.current.pause();
        }
        // Simple sync, a real implementation would be more complex
        if (Math.abs(videoRef.current.currentTime - startTime) > 2) {
          videoRef.current.currentTime = startTime;
        }
      } else if (source?.type === VideoSourceType.YOUTUBE && youtubePlayerRef.current) {
         if (isPlaying) {
            youtubePlayerRef.current.playVideo();
         } else {
            youtubePlayerRef.current.pauseVideo();
         }
      }
    }
  }, [isPlaying, startTime, source, isHost]);
  
  const getYouTubeId = (url: string): string | null => {
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
      const match = url.match(regExp);
      return (match && match[2].length === 11) ? match[2] : null;
  }

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if(videoUrlInput) {
        let type = VideoSourceType.URL;
        if(videoUrlInput.includes('youtube.com') || videoUrlInput.includes('youtu.be')) {
            type = VideoSourceType.YOUTUBE;
        }
        onSetVideoSource({ type, url: videoUrlInput });
        setVideoUrlInput('');
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const fileUrl = URL.createObjectURL(file);
      onSetVideoSource({ type: VideoSourceType.UPLOAD, url: fileUrl });
    }
  };

  if (!source) {
    return (
      <div className="aspect-video w-full bg-gray-800 rounded-lg flex flex-col justify-center items-center text-white p-4">
        <h2 className="text-xl font-bold mb-4">No video selected</h2>
        {isHost && (
          <div className="w-full max-w-md text-center">
            <form onSubmit={handleUrlSubmit} className="w-full flex gap-2">
              <input 
                type="text" 
                value={videoUrlInput}
                onChange={(e) => setVideoUrlInput(e.target.value)}
                placeholder="Enter YouTube or video URL" 
                className="w-full px-4 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:ring-primary-500 focus:border-primary-500" 
              />
              <button type="submit" className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded-lg">Load</button>
            </form>
            <div className="flex items-center my-4">
              <div className="flex-grow border-t border-gray-600"></div>
              <span className="flex-shrink mx-4 text-gray-400 text-sm">OR</span>
              <div className="flex-grow border-t border-gray-600"></div>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="video/*"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full bg-gray-600 hover:bg-gray-500 text-white font-bold py-2.5 px-4 rounded-lg transition"
            >
              Upload Video File
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      <div className="relative w-full aspect-video bg-black rounded-t-lg overflow-hidden shadow-lg">
        {(source.type === VideoSourceType.URL || source.type === VideoSourceType.UPLOAD) && (
          <video
            ref={videoRef}
            src={source.url}
            className="w-full h-full"
            controls={isHost}
            onPlay={() => isHost && onPlaybackChange('play', videoRef.current?.currentTime || 0)}
            onPause={() => isHost && onPlaybackChange('pause', videoRef.current?.currentTime || 0)}
            onSeeked={() => isHost && onPlaybackChange('seek', videoRef.current?.currentTime || 0)}
          />
        )}
        {source.type === VideoSourceType.YOUTUBE && getYouTubeId(source.url) && (
          <YouTube
            videoId={getYouTubeId(source.url)!}
            opts={{
              height: '100%',
              width: '100%',
              playerVars: {
                autoplay: 0,
                controls: isHost ? 1: 0,
                rel: 0
              },
            }}
            className="absolute top-0 left-0 w-full h-full"
            onReady={(event) => { youtubePlayerRef.current = event.target; }}
            onPlay={() => isHost && onPlaybackChange('play', youtubePlayerRef.current.getCurrentTime())}
            onPause={() => isHost && onPlaybackChange('pause', youtubePlayerRef.current.getCurrentTime())}
            onEnd={() => isHost && onPlaybackChange('pause', 0)}
          />
        )}
        {!isHost && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 pointer-events-none">
            {isPlaying ? 
              <PlayIcon className="w-20 h-20 text-white opacity-50" /> : 
              <PauseIcon className="w-20 h-20 text-white opacity-50" />
            }
          </div>
        )}
        <ReactionsOverlay reactions={reactions} />
      </div>
      <ReactionButtons 
        reactionsEnabled={reactionsEnabled}
        onSendReaction={onSendReaction}
        isHost={isHost}
        onToggleReactions={onToggleReactions}
      />
    </div>
  );
};

export default VideoPlayer;
