
import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Poll } from '../types';

interface PollsProps {
  poll: Poll | null;
  isHost: boolean;
  onCreatePoll: (question: string, options: string[]) => void;
  onVote: (optionId: string) => void;
  onClosePoll: () => void;
}

const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];

const Polls: React.FC<PollsProps> = ({ poll, isHost, onCreatePoll, onVote, onClosePoll }) => {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const addOption = () => {
    if (options.length < 5) {
      setOptions([...options, '']);
    }
  };

  const removeOption = (index: number) => {
    if (options.length > 2) {
      const newOptions = options.filter((_, i) => i !== index);
      setOptions(newOptions);
    }
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const validOptions = options.map(o => o.trim()).filter(o => o !== '');
    if (question.trim() && validOptions.length >= 2) {
      onCreatePoll(question, validOptions);
      setQuestion('');
      setOptions(['', '']);
    }
  };
  
  if (!poll) {
    if (isHost) {
      return (
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-4">Create a New Poll</h3>
          <form onSubmit={handleCreate}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Question</label>
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="What should we watch next?"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Options</label>
              <div className="space-y-2">
                {options.map((option, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => handleOptionChange(index, e.target.value)}
                      placeholder={`Option ${index + 1}`}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700"
                      required
                    />
                     {options.length > 2 && (
                       <button type="button" onClick={() => removeOption(index)} className="text-red-500 p-1 rounded-full hover:bg-red-100 dark:hover:bg-red-900">
                         <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                       </button>
                     )}
                  </div>
                ))}
              </div>
            </div>
            {options.length < 5 && (
              <button type="button" onClick={addOption} className="text-sm text-primary-600 hover:underline mb-4">
                + Add Option
              </button>
            )}
            <button type="submit" className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded-lg">
              Start Poll
            </button>
          </form>
        </div>
      );
    }
    return <div className="p-4 text-center text-gray-500">No active poll. The host can create one.</div>;
  }

  const totalVotes = poll.options.reduce((sum, opt) => sum + opt.votes, 0);

  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-2">{poll.question}</h3>
      {poll.isOpen ? (
        <div className="space-y-2">
          {poll.options.map(option => (
            <button
              key={option.id}
              onClick={() => onVote(option.id)}
              className="w-full text-left p-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition"
            >
              {option.text}
            </button>
          ))}
           {isHost && (
            <button onClick={onClosePoll} className="w-full mt-4 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg">
                End Poll & Show Results
            </button>
           )}
        </div>
      ) : (
        <div>
            <p className="text-sm text-gray-500 mb-4">Poll closed. Total votes: {totalVotes}</p>
            <div className="h-64">
                 <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={poll.options} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                        <XAxis type="number" hide />
                        <YAxis type="category" dataKey="text" width={80} tickLine={false} axisLine={false} />
                        <Tooltip cursor={{fill: 'rgba(255, 255, 255, 0.1)'}} contentStyle={{ backgroundColor: '#374151', border: 'none', color: '#FFF' }}/>
                        <Bar dataKey="votes" fill="#8884d8" barSize={20}>
                            {poll.options.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
      )}
    </div>
  );
};

export default Polls;
   