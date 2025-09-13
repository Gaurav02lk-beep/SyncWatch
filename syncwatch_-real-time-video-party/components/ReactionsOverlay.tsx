import React from 'react';
import { Reaction } from '../types';

interface ReactionsOverlayProps {
  reactions: Reaction[];
}

const ReactionsOverlay: React.FC<ReactionsOverlayProps> = ({ reactions }) => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {reactions.map((reaction) => (
        <span
          key={reaction.id}
          className="reaction-emoji"
          style={{
            left: `${reaction.x}%`,
            top: `${reaction.y}%`,
          }}
          aria-hidden="true"
        >
          {reaction.emoji}
        </span>
      ))}
    </div>
  );
};

export default ReactionsOverlay;
