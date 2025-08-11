import React from 'react'
import { useAuth } from '../lib/useAuth';
import Sidebar from '../component/Sidebar';
import messageChatStore from '../lib/messageChatStore';
import NoChatSelected from '../component/NoChatSelected';
import ChatContainer from '../component/ChatContainer';

const Home = () => {
  const { selectedUser } = messageChatStore();
  return (
    <div className="h-screen bg-base-200">
      <div className="flex items-center justify-center pt-20 px-4">
        <div className="bg-base-100 rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-8rem)]">
          <div className="flex h-full rounded-lg overflow-hidden">
            <Sidebar />

            {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home