import { useState } from 'react';
import { Button } from '@/components/ui/button';

/**
 * FollowButton - Reusable follow/unfollow button for users
 * @param {string} targetUserId - The user to follow/unfollow
 * @param {boolean} initialIsFollowed - Initial follow state
 * @param {function} [onChange] - Optional callback when follow state changes
 * @param {function} [onFollowChange] - Optional callback with username and follow status
 * @param {string} [size] - Button size (sm, md, etc.)
 * @param {string} [variant] - Button variant (outline, solid, etc.)
 */
export default function FollowButton({
  targetUserId,
  initialIsFollowed = false,
  onChange,
  onFollowChange,
  size = 'sm',
  variant = 'outline',
}) {
  const [isFollowed, setIsFollowed] = useState(initialIsFollowed);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showUnfollowConfirm, setShowUnfollowConfirm] = useState(false);

  // Don't render if no targetUserId is provided
  if (!targetUserId) {
    return null;
  }

  const handleFollow = async () => {
    setLoading(true);
    setError(null);
    setIsFollowed(true); // Optimistic update
    try {
      const res = await fetch('/api/follow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ action: 'follow', targetUserId }),
      });
      const data = await res.json();
      if (!res.ok) {
        setIsFollowed(false); // Revert on error
        setError(data.message || 'Error');
      } else {
        if (onChange) onChange(true);
        if (onFollowChange) onFollowChange(targetUserId, true);
      }
    } catch (e) {
      setIsFollowed(false);
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  const handleUnfollow = async () => {
    setLoading(true);
    setError(null);
    setIsFollowed(false); // Optimistic update
    setShowUnfollowConfirm(false);
    try {
      const res = await fetch('/api/follow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ action: 'unfollow', targetUserId }),
      });
      const data = await res.json();
      if (!res.ok) {
        setIsFollowed(true); // Revert on error
        setError(data.message || 'Error');
      } else {
        if (onChange) onChange(false);
        if (onFollowChange) onFollowChange(targetUserId, false);
      }
    } catch (e) {
      setIsFollowed(true);
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  const handleClick = () => {
    if (isFollowed) {
      setShowUnfollowConfirm(true);
    } else {
      handleFollow();
    }
  };

  return (
    <div className="inline-block">
      <Button
        variant={variant}
        size={size}
        className={
          isFollowed
            ? 'bg-white text-black border-gray-300 hover:bg-gray-100 dark:bg-black dark:text-white dark:border-gray-700 dark:hover:bg-gray-900'
            : 'bg-black text-white border-gray-700 hover:bg-gray-800 dark:bg-white dark:text-black dark:border-gray-300 dark:hover:bg-gray-200'
        }
        onClick={handleClick}
        disabled={loading}
      >
        {loading ? '...' : isFollowed ? 'Following' : 'Follow'}
      </Button>

      {/* Unfollow Confirmation Dialog */}
      {showUnfollowConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm mx-4">
            <h3 className="text-lg font-semibold mb-4">Unfollow</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Are you sure you want to unfollow this user?
            </p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowUnfollowConfirm(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleUnfollow}
                className="flex-1"
                disabled={loading}
              >
                {loading ? '...' : 'Unfollow'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="text-xs text-red-500 mt-1">{error}</div>
      )}
    </div>
  );
}