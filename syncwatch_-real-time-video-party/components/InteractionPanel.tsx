
import React, { useState } from 'react';
import { User, Message, Poll } from '../types';
import { ChatBubbleIcon, UsersIcon, ChartBarIcon } from './Icons';
import ChatWindow from './ChatWindow';
import ParticipantsList from './ParticipantsList';
import Polls from './Polls';

interface InteractionPanelProps {
  participants: User[];
  messages: Message[];
  poll: Poll | null;
  isHost: boolean;
  onSendMessage: (text: string) => void;
  onCreatePoll: (question: string, options: string[]) => void;
  onVote: (optionId: string) => void;
  onClosePoll: () => void;
}

type Tab = 'chat' | 'participants' | 'polls';

const InteractionPanel: React.FC<InteractionPanelProps> = (props) => {
  const [activeTab, setActiveTab] = useState<Tab>('chat');

  const TabButton = ({ tab, icon, label }: { tab: Tab, icon: React.ReactNode, label: string }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`flex-1 flex items-center justify-center gap-2 p-3 text-sm font-medium border-b-2 transition ${
        activeTab === tab 
          ? 'border-primary-500 text-primary-500' 
          : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
      }`}
    >
      {icon}
      {label}
    </button>
  );

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg h-[80vh] flex flex-col">
      <div className="flex border-b border-gray-200 dark:border-gray-700">
        <TabButton tab="chat" icon={<ChatBubbleIcon className="w-5 h-5" />} label="Chat" />
        <TabButton tab="participants" icon={<UsersIcon className="w-5 h-5" />} label={`Participants (${props.participants.length})`} />
        <TabButton tab="polls" icon={<ChartBarIcon className="w-5 h-5" />} label="Polls" />
      </div>
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'chat' && <ChatWindow messages={props.messages} onSendMessage={props.onSendMessage} />}
        {activeTab === 'participants' && <ParticipantsList participants={props.participants} />}
        {activeTab === 'polls' && (
            <Polls 
                poll={props.poll}
                isHost={props.isHost}
                onCreatePoll={props.onCreatePoll}
                onVote={props.onVote}
                onClosePoll={props.onClosePoll}
            />
        )}
      </div>
    </div>
  );
};

export default InteractionPanel;
   