import React from 'react';

interface ReactionButtonsProps {
  reactionsEnabled: boolean;
  onSendReaction: (emoji: string) => void;
  isHost: boolean;
  onToggleReactions: () => void;
}

const EMOJIS = ['❤️', '😂', '👍', '🔥', '🎉', '🤯'];

const ReactionButtons: React.FC<ReactionButtonsProps> = ({ reactionsEnabled, onSendReaction, isHost, onToggleReactions }) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-2 rounded-b-lg flex justify-between items-center shadow-lg">
      <div className="flex items-center gap-2">
        {EMOJIS.map(emoji => (
          <button
            key={emoji}
            onClick={() => onSendReaction(emoji)}
            disabled={!reactionsEnabled}
            className="text-2xl p-1 rounded-full transition-transform transform hover:scale-125 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary-500"
            aria-label={`React with ${emoji}`}
          >
            {emoji}
          </button>
        ))}
      </div>
      {isHost && (
        <div className="flex items-center gap-3 pr-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Reactions</span>
          <label htmlFor="toggle-reactions" className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" checked={reactionsEnabled} onChange={onToggleReactions} id="toggle-reactions" className="sr-only peer" />
            <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 rounded-full peer peer-focus:ring-2 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
          </label>
        </div>
      )}
    </div>
  );
};

export default ReactionButtons;
