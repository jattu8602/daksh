import React, { useState, useEffect } from 'react';

export default function VideoAssignmentModal({ isOpen, onClose, videoIds, onAssign }) {
  const [mentors, setMentors] = useState([]);
  const [selectedMentor, setSelectedMentor] = useState('');
  const [contentType, setContentType] = useState('videos');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState({
    success: 0,
    alreadyAssigned: 0,
    failed: 0
  });

  useEffect(() => {
    if (isOpen) {
      fetchMentors();
      setResults({ success: 0, alreadyAssigned: 0, failed: 0 });
    }
  }, [isOpen]);

  const fetchMentors = async () => {
    try {
      const res = await fetch('/api/mentor/list?isOrganic=false');
      const data = await res.json();
      if (data.mentors) {
        setMentors(data.mentors);
      }
    } catch (err) {
      console.error('Error fetching mentors:', err);
    }
  };

  const handleAssign = async () => {
    if (!selectedMentor || !contentType) {
      setError('Please select a mentor and content type');
      return;
    }

    setLoading(true);
    setError('');
    setProgress(0);
    setResults({ success: 0, alreadyAssigned: 0, failed: 0 });

    try {
      const newAssignments = [];
      // Process each video assignment sequentially
      for (let i = 0; i < videoIds.length; i++) {
        const videoId = videoIds[i];
        try {
          const res = await fetch('/api/admin/assign-video', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              videoId,
              mentorId: selectedMentor,
              contentType
            })
          });

          const data = await res.json();
          if (!res.ok) {
            throw new Error(data.error || `Failed to assign video ${i + 1}`);
          }

          // Update results based on response
          if (data.message && data.message.includes('already assigned')) {
            setResults(prev => ({
              ...prev,
              alreadyAssigned: prev.alreadyAssigned + 1
            }));
            if (data.assignment) newAssignments.push(data.assignment);
          } else {
            setResults(prev => ({
              ...prev,
              success: prev.success + 1
            }));
            if (data.assignment) newAssignments.push(data.assignment);
          }
        } catch (err) {
          console.error(`Error assigning video ${i + 1}:`, err);
          setResults(prev => ({
            ...prev,
            failed: prev.failed + 1
          }));
        }

        // Update progress
        setProgress(((i + 1) / videoIds.length) * 100);
      }

      onAssign(newAssignments);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">
          Assign {videoIds.length} Video{videoIds.length !== 1 ? 's' : ''} to Mentor
        </h2>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Mentor
          </label>
          <select
            value={selectedMentor}
            onChange={(e) => setSelectedMentor(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select a mentor</option>
            {mentors.map((mentor) => (
              <option key={mentor.id} value={mentor.id}>
                {mentor.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Content Type
          </label>
          <select
            value={contentType}
            onChange={(e) => setContentType(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="videos">Videos</option>
            <option value="shorts">Shorts</option>
            <option value="post">Post</option>
            <option value="highlights">Highlights</option>
          </select>
        </div>

        {error && (
          <div className="text-red-500 text-sm mb-4">{error}</div>
        )}

        {loading && (
          <div className="mb-4">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-blue-500 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              Assigning videos... {Math.round(progress)}%
            </p>
            {(results.success > 0 || results.alreadyAssigned > 0 || results.failed > 0) && (
              <div className="mt-2 text-sm">
                <p className="text-green-600">Successfully assigned: {results.success}</p>
                <p className="text-yellow-600">Already assigned: {results.alreadyAssigned}</p>
                <p className="text-red-600">Failed: {results.failed}</p>
              </div>
            )}
          </div>
        )}

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleAssign}
            disabled={loading || !selectedMentor}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? 'Assigning...' : 'Assign'}
          </button>
        </div>
      </div>
    </div>
  );
}