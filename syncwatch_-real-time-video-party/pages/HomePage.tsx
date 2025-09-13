
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from '../components/Modal';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [isJoinModalOpen, setJoinModalOpen] = useState(false);
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [roomCode, setRoomCode] = useState('');
  const [roomName, setRoomName] = useState('');
  
  const handleJoinRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (roomCode.trim()) {
      navigate(`/room/${roomCode.trim()}`);
    }
  };

  const handleCreateRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (roomName.trim()) {
      const newRoomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      // In a real app, you'd call an API to create the room
      // and get the code back.
      navigate(`/room/${newRoomCode}?name=${encodeURIComponent(roomName.trim())}`);
    }
  };
  
  const trendingRooms = [
    { id: 'TREND1', name: 'Anime Watch Party', viewers: 42, img: 'https://picsum.photos/400/225?random=1' },
    { id: 'TREND2', name: 'Movie Night: Sci-Fi', viewers: 35, img: 'https://picsum.photos/400/225?random=2' },
    { id: 'TREND3', name: 'K-Drama Marathon', viewers: 28, img: 'https://picsum.photos/400/225?random=3' },
    { id: 'TREND4', name: 'Tech Conference Stream', viewers: 19, img: 'https://picsum.photos/400/225?random=4' },
  ];

  return (
    <div className="container mx-auto">
      <div className="text-center bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 md:p-12 mb-8">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
          Watch Together, Anywhere.
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8">
          Create a private room, invite your friends, and enjoy perfectly synchronized video playback. It's like having a movie theater in your browser.
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <button 
            onClick={() => setCreateModalOpen(true)}
            className="w-full sm:w-auto bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-6 rounded-lg text-lg transition-transform transform hover:scale-105"
          >
            Create a Room
          </button>
          <button 
            onClick={() => setJoinModalOpen(true)}
            className="w-full sm:w-auto bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-bold py-3 px-6 rounded-lg text-lg transition"
          >
            Join with Code
          </button>
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-3xl font-bold mb-6 text-center">Trending Public Rooms</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trendingRooms.map(room => (
            <div 
              key={room.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden cursor-pointer transition-transform transform hover:-translate-y-2"
              onClick={() => navigate(`/room/${room.id}`)}
            >
              <img src={room.img} alt={room.name} className="w-full h-40 object-cover" />
              <div className="p-4">
                <h3 className="font-bold text-lg">{room.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{room.viewers} viewers</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Modal isOpen={isJoinModalOpen} onClose={() => setJoinModalOpen(false)} title="Join a Room">
        <form onSubmit={handleJoinRoom}>
          <p className="mb-4 text-gray-600 dark:text-gray-300">Enter the room code provided by the host to join the watch party.</p>
          <input 
            type="text"
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value)}
            placeholder="Enter Room Code"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:ring-primary-500 focus:border-primary-500"
            required
          />
          <button type="submit" className="w-full mt-4 bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded-lg transition">
            Join Room
          </button>
        </form>
      </Modal>

      <Modal isOpen={isCreateModalOpen} onClose={() => setCreateModalOpen(false)} title="Create a New Room">
        <form onSubmit={handleCreateRoom}>
           <p className="mb-4 text-gray-600 dark:text-gray-300">Give your new room a name to get started.</p>
          <input 
            type="text"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            placeholder="e.g., Friday Movie Night"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:ring-primary-500 focus:border-primary-500"
            required
          />
          <button type="submit" className="w-full mt-4 bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded-lg transition">
            Create and Join
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default HomePage;
   