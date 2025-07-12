'use client'

import { useSelector } from 'react-redux'
import Profile from '../../components/dashboard/Profile'
import Settings from '../../components/dashboard/Settings'
import { useState } from 'react';
import StudentAIAgentChat from '../../components/ai/StudentAIAgentChat';
import AIAgentModal from '../../components/ai/AIAgentModal';

export default function StudentDashboard() {
  const { user, loading } = useSelector((state) => state.auth)
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Daksh AI Agent Icon */}
      <div className="flex justify-end items-center p-4">
        <button
          aria-label="Open Daksh AI Agent"
          onClick={() => setIsAIModalOpen(true)}
          className="focus:outline-none"
        >
          <img
            src="/web-app-manifest-512x512.png"
            alt="Daksh AI Agent"
            className="w-10 h-10 rounded-full shadow hover:scale-105 transition-transform"
          />
        </button>
      </div>
      {/* AI Agent Modal */}
      <AIAgentModal open={isAIModalOpen} onClose={() => setIsAIModalOpen(false)}>
        <StudentAIAgentChat onClose={() => setIsAIModalOpen(false)} />
      </AIAgentModal>
      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <Profile user={user} isLoading={loading || !user} />
        <Settings />
      </main>
    </div>
  )
}
