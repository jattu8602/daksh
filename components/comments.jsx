'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { X, Send, Smile, Heart } from 'lucide-react'
import { emojiLibrary } from '@/constants/emojis'

// Remove initialMessages and only use real comments

const reactions = ['👍', '🔥', '🎯', '😎', '⭐', '🙌', '👑', '💪']

const formatLikes = (likes) => {
  if (likes >= 1_000_000)
    return (likes / 1_000_000).toFixed(1).replace('.0', '') + 'M'
  if (likes >= 1_000) return (likes / 1_000).toFixed(1).replace('.0', '') + 'k'
  return likes.toString()
}

// Add helper to get studentId
const getStudentId = () => {
  if (typeof window !== 'undefined') {
    // Try localStorage
    let id = localStorage.getItem('studentId');
    // Fallback: try window.session or window.user if available
    if (!id && window.session?.user?.studentId) id = window.session.user.studentId;
    if (!id && window.user?.studentId) id = window.user.studentId;
    return id || '';
  }
  return '';
};

const isValidObjectId = (id) => typeof id === 'string' && id.length === 24 && /^[a-fA-F0-9]+$/.test(id);

export default function Comments({ post, onClose }) {
  const [newMessage, setNewMessage] = useState('')
  const [messages, setMessages] = useState([])
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  // Fetch comments from backend
  useEffect(() => {
    if (!post?.id) return;
    setLoading(true);
    setError(null);
    fetch(`/api/video-assignment/${post.id}/highlight-stats?type=comments`)
      .then((res) => res.json())
      .then(async (data) => {
        if (data.success) {
          const studentId = getStudentId();
          const commentsWithLikes = await Promise.all(
            data.comments.map(async (c) => {
              const likeRes = await fetch(`/api/video-assignment/${post.id}/highlight-stats/comment-like?commentId=${c.id}&studentId=${studentId}`);
              const likeData = await likeRes.json();
              return {
                id: c.id,
                text: c.comment,
                sender: c.student?.user?.username || 'user',
                time: new Date(c.createdAt).toLocaleTimeString(),
                likes: likeData.count || 0,
                liked: likeData.liked || false,
                name: c.student?.user?.username || 'user',
              };
            })
          );
          setMessages(commentsWithLikes);
        } else {
          setError(data.error || 'Failed to fetch comments');
        }
        setLoading(false);
      })
      .catch((err) => {
        setError('Failed to fetch comments');
        setLoading(false);
      });
  }, [post?.id])

  const handleSend = async () => {
    if (newMessage.trim() && post?.id) {
      const studentId = getStudentId();
      console.log('studentId used for comment:', studentId);
      if (!isValidObjectId(studentId)) {
        setError(`You must be logged in as a real student to comment. (studentId: ${studentId || 'not set'})`);
        return;
      }
      setError(null);
      const res = await fetch(`/api/video-assignment/${post.id}/highlight-stats`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId, comment: newMessage }),
      })
      if (res.ok) {
        const data = await res.json()
        setMessages([
          {
            id: data.highlightStat.id,
            text: data.highlightStat.comment,
            sender: data.highlightStat.student?.user?.username || 'user',
            time: new Date(data.highlightStat.createdAt).toLocaleTimeString(),
            likes: 0,
            liked: false,
            name: data.highlightStat.student?.user?.username || 'user',
          },
          ...messages,
        ])
        setNewMessage('')
      } else {
        const errData = await res.json();
        setError(errData.error || 'Failed to post comment.');
      }
    }
  }

  // Like/unlike a comment
  const handleLike = async (commentId) => {
    const studentId = getStudentId();
    const msgIdx = messages.findIndex((msg) => msg.id === commentId);
    if (msgIdx === -1) return;
    const msg = messages[msgIdx];
    if (!msg.liked) {
      // Like
      await fetch(`/api/video-assignment/${post.id}/highlight-stats/comment-like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ commentId, studentId }),
      });
      setMessages((msgs) =>
        msgs.map((m) =>
          m.id === commentId ? { ...m, liked: true, likes: m.likes + 1 } : m
        )
      );
    } else {
      // Unlike
      await fetch(`/api/video-assignment/${post.id}/highlight-stats/comment-like?commentId=${commentId}&studentId=${studentId}`, {
        method: 'DELETE',
      });
      setMessages((msgs) =>
        msgs.map((m) =>
          m.id === commentId ? { ...m, liked: false, likes: Math.max(0, m.likes - 1) } : m
        )
      );
    }
  };

  const handleReactionClick = (reaction) => {
    setNewMessage((prev) => prev + reaction)
  }

  const handleEmojiSelect = (emoji) => {
    setNewMessage((prev) => prev + emoji)
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-[99]" onClick={onClose} />

      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-black text-gray-900 dark:text-white rounded-t-3xl z-[100] max-h-[70vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
              S
            </div>
            <div>
              <div className="font-medium">sachin.sir_history</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Books are the best friends.
              </div>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </Button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {loading && <div className="text-center text-gray-400">Loading comments...</div>}
          {error && <div className="text-center text-red-500">{error}</div>}
          {!loading && !error && messages.length === 0 && (
            <div className="text-center text-gray-400">No comments yet.</div>
          )}
          {!loading && !error && messages.map((msg) => (
            <div key={msg.id} className="flex items-start gap-3 group">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm">
                {msg.sender === 'user' ? 'S' : 'Y'}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-sm">{msg.name}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {msg.time}
                  </span>
                </div>
                <div className="text-sm text-gray-900 dark:text-white break-words whitespace-pre-wrap max-w-[90%] sm:max-w-full">
                  {msg.text}
                </div>
              </div>
              <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleLike(msg.id)}
                  className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs transition-colors ${
                    msg.liked
                      ? 'text-red-500 bg-red-50 dark:bg-red-900/30'
                      : 'text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'
                  }`}
                >
                  <Heart
                    className={`w-4 h-4 ${msg.liked ? 'fill-current' : ''}`}
                  />
                  <span>{formatLikes(msg.likes)}</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Reactions */}
        <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-800">
          <div className="flex gap-2 overflow-x-auto">
            {reactions.map((reaction, i) => (
              <button
                key={i}
                onClick={() => handleReactionClick(reaction)}
                className="text-2xl transition-transform flex-shrink-0 p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                {reaction}
              </button>
            ))}
          </div>
        </div>

        {/* Emoji Picker */}
        <div
          className={`transition-all duration-300 ease-in-out ${
            showEmojiPicker ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'
          } overflow-y-auto`}
        >
          <div className="grid grid-cols-8 gap-1 p-2">
            {emojiLibrary.map((emoji, i) => (
              <button
                key={i}
                onClick={() => handleEmojiSelect(emoji)}
                className="text-xl hover:scale-110 transition-transform p-2 rounded flex items-center justify-center"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>

        {/* Input */}
        <div className="p-2 border-t border-gray-200 dark:border-gray-800">
          <div className="flex items-end gap-2">
            <div className="flex-1 relative">
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Add a comment"
                rows={2}
                className="w-full h-[40px] resize-none overflow-hidden pl-6 pr-10 py-2 text-sm rounded-full border border-gray-300 dark:border-gray-700 dark:bg-[#111] dark:text-white focus:border-blue-500 focus:ring-blue-500"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleSend()
                  }
                }}
              />

              <div className="absolute right-3 top-1 bottom-3 flex items-center">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 p-0 transition-transform duration-300 ease-in-out"
                  onClick={() => setShowEmojiPicker((prev) => !prev)}
                >
                  <div
                    className={`transition-transform duration-300 ${
                      showEmojiPicker ? 'rotate-180' : 'rotate-0'
                    }`}
                  >
                    {showEmojiPicker ? (
                      <X className="w-4 h-4" />
                    ) : (
                      <Smile className="w-4 h-4" />
                    )}
                  </div>
                </Button>
              </div>
            </div>

            <Button
              onClick={handleSend}
              size="icon"
              className="rounded-full bg-blue-500 text-white hover:bg-blue-600 h-10 w-10 flex-shrink-0"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
