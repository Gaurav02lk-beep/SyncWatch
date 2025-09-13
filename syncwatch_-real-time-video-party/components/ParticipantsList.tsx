
import React from 'react';
import { User } from '../types';

interface ParticipantsListProps {
  participants: User[];
}

const ParticipantsList: React.FC<ParticipantsListProps> = ({ participants }) => {
  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">In this Room</h3>
      <ul className="space-y-3">
        {participants.map((user) => (
          <li key={user.id} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary-200 dark:bg-primary-800 flex items-center justify-center font-bold text-primary-700 dark:text-primary-200">
                    {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="font-medium text-gray-700 dark:text-gray-300">{user.name}</span>
            </div>
            {user.isHost && (
              <span className="text-xs font-bold text-white bg-yellow-500 px-2 py-1 rounded-full">
                HOST
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ParticipantsList;
   