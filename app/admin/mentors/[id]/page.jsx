"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";

export default function MentorProfilePage() {
  const { id } = useParams();
  const [mentor, setMentor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchMentor() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`/api/mentor/${id}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to fetch mentor");
        setMentor(data.mentor);
      } catch (err) {
        setError(err.message || "Failed to fetch mentor");
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchMentor();
  }, [id]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-600">{error}</div>;
  }
  if (!mentor) {
    return <div className="min-h-screen flex items-center justify-center">Mentor not found</div>;
  }

  // Stats placeholders (replace with real stats if available)
  const stats = {
    totalViews: 0,
    videos: 0,
    shorts: 0,
    highlights: 0,
    posts: 0,
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="relative h-32 w-32">
              <Image
                src={mentor.profilePhoto}
                alt={mentor.user?.name || mentor.name}
                fill
                className="object-cover rounded-full border"
              />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 mb-1">{mentor.user?.name || mentor.name}</h1>
              <p className="text-gray-600 mb-1">@{mentor.user?.username || mentor.username}</p>
              {mentor.email && <p className="text-gray-600 mb-1">{mentor.email}</p>}
              {mentor.bio && <p className="text-gray-700 mb-2">{mentor.bio}</p>}
              <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">{mentor.tag || (mentor.isOrganic ? "Organic Mentor" : "Inorganic Mentor")}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
            <span className="text-lg font-semibold">{stats.totalViews}</span>
            <span className="text-xs text-gray-500 mt-1">Total Views</span>
          </div>
          <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
            <span className="text-lg font-semibold">{stats.videos}</span>
            <span className="text-xs text-gray-500 mt-1">Videos</span>
          </div>
          <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
            <span className="text-lg font-semibold">{stats.shorts}</span>
            <span className="text-xs text-gray-500 mt-1">Shorts</span>
          </div>
          <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
            <span className="text-lg font-semibold">{stats.highlights}</span>
            <span className="text-xs text-gray-500 mt-1">Highlights</span>
          </div>
          <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
            <span className="text-lg font-semibold">{stats.posts}</span>
            <span className="text-xs text-gray-500 mt-1">Posts</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex space-x-6 border-b mb-4">
            <button className="pb-2 border-b-2 border-blue-600 font-medium text-blue-700">Videos (0)</button>
            <button className="pb-2 text-gray-500">Shorts (0)</button>
            <button className="pb-2 text-gray-500">Highlights (0)</button>
            <button className="pb-2 text-gray-500">Posts (0)</button>
          </div>
          <div className="text-center text-gray-400 py-8">No content available</div>
        </div>
      </div>
    </div>
  );
}
