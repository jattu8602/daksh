'use client'
import GroupProfileScreen from "../../../../../components/chat-screens/group-profile-screen"
import { useEffect, useState } from "react"
import React from "react"

export default function GroupProfileDynamicPage({ params }) {
  // Safely unwrap params using React.use()
  const unwrappedParams = React.use(params);
  const classId = unwrappedParams.classId;

  const [user, setUser] = useState(null);
  const [className, setClassName] = useState("");
  const [schoolId, setSchoolId] = useState("");
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch user info (with student/class/school)
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("/api/auth/session", {
          credentials: 'include', // Important for cookies
        });
        const data = await response.json();
        if (data.success && data.user) {
          setUser(data.user);
        } else {
          setError(data.error || "Failed to fetch user data");
        }
      } catch (error) {
        setError("Failed to fetch user data");
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, []);

  // Fetch class members
  useEffect(() => {
    if (!schoolId || !classId) return;
    setLoading(true);

    // Get class details including students
    fetch(`/api/schools/${schoolId}/classes/${classId}`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.class) {
          setClassName(data.class.name);
          setMembers(data.class.students.map(student => ({
            id: student.id,
            name: student.name || student.username,
            rollNo: student.rollNo,
            avatar: student.profileImage || "https://ui-avatars.com/api/?name=" + encodeURIComponent(student.name || student.username)
          })));
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching class members:", err);
        setLoading(false);
      });
  }, [schoolId, classId]);

  if (loading || !user) {
    return <div className="flex min-h-screen items-center justify-center">Loading group profile...</div>;
  }

  return (
    <GroupProfileScreen
      groupName={`Official ${className}`}
      groupAvatar="/images/groupphoto.png"
      members={members}
      backUrl={`/dashboard/community/school/group-chat/${classId}`}
    />
  );
}