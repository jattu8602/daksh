'use client'
import GroupChat from "../../../../../components/chat-screens/group-chat";
import { useEffect, useState } from "react";
import React from "react";

export default function GroupChatDynamicPage({ params }) {
  // Safely unwrap params using React.use()
  const unwrappedParams = React.use(params);
  const classId = unwrappedParams.classId;

  const [user, setUser] = useState(null);
  const [className, setClassName] = useState("");
  const [schoolId, setSchoolId] = useState("");
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch user info (with student/class/school)
  useEffect(() => {
    async function fetchUser() {
      const token = localStorage.getItem("token");
      if (!token) return;
      const res = await fetch("/api/auth/session", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success && data.user && data.user.student && data.user.student.class) {
        setUser(data.user);
        setClassName(data.user.student.class.name);
        setSchoolId(data.user.student.class.school.id);
      }
    }
    fetchUser();
  }, []);

  // Fetch messages for this class
  useEffect(() => {
    if (!schoolId || !classId) return;
    setLoading(true);
    fetch(`/api/schools/${schoolId}/classes/${classId}/messages`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          // Format timestamps to 12-hour format if they aren't already
          const formattedMessages = data.messages.map(msg => ({
            ...msg,
            time: formatTime(msg.createdAt || new Date())
          }));
          setMessages(formattedMessages);
        }
        setLoading(false);
      });
  }, [schoolId, classId]);

  // Format time to 12-hour format with AM/PM
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  // Send a new message
  const handleSendMessage = async () => {
    if (!inputValue.trim() || !user?.student?.id) return;
    const res = await fetch(`/api/schools/${schoolId}/classes/${classId}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        senderId: user.student.id,
        text: inputValue
      })
    });
    const data = await res.json();
    if (data.success && data.message) {
      // Set the formatted time with 12-hour clock
      const messageWithFormattedTime = {
        ...data.message,
        time: formatTime(data.message.createdAt || new Date()),
        isMe: true // Mark as sent by current user
      };
      setMessages(msgs => [...msgs, messageWithFormattedTime]);
      setInputValue("");
    }
  };

  if (loading || !user) {
    return <div className="flex min-h-screen items-center justify-center">Loading group chat...</div>;
  }

  // Mark messages sent by current user
  const displayMessages = messages.map(msg => ({
    ...msg,
    isMe: msg.sender?.id === user.student.id,
    sender: msg.sender?.name || msg.sender?.username || "Unknown",
    time: msg.time || formatTime(msg.createdAt || new Date())
  }));

  return (
    <GroupChat
      avatar="/images/groupphoto.png"
      name={`Official ${className}`}
      info="Tap to view group info"
      messages={displayMessages}
      inputValue={inputValue}
      setInputValue={setInputValue}
      onSendMessage={handleSendMessage}
      groupProfileUrl={`/dashboard/community/school/group-profile/${classId}`}
    />
  );
}