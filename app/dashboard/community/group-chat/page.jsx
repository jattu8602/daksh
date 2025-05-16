import GroupChat from "@/components/chat-screens/group-chat"

export default function GroupChatPage() {
  // Sample data for the group chat
  const messages = [
    {
      id: 1,
      text: "Today's test was very hard",
      time: "6:06 pm",
      isMe: true,
    },
    {
      id: 2,
      text: "Let's prepare for the next",
      time: "6:06 pm",
      isMe: true,
    },
    {
      id: 3,
      text: "What test we have next week?",
      time: "6:06 pm",
      isMe: false,
      sender: "Mohit Panjwani",
    },
    {
      id: 4,
      text: "I have the same doubts!",
      time: "6:06 pm",
      isMe: false,
      sender: "Akul Goel",
    },
    {
      id: 5,
      text: "It is of SST.",
      time: "6:06 pm",
      isMe: true,
    },
    {
      id: 6,
      text: "Rohan told me.",
      time: "6:06 pm",
      isMe: true,
    },
    {
      id: 7,
      text: "Do share important notes",
      time: "6:06 pm",
      isMe: false,
      sender: "Akul Goel",
    },
  ]

  return (
    <GroupChat
      avatar="https://randomuser.me/api/portraits/men/85.jpg"
      name="Official 10-B"
      info="Tap to view group info"
      messages={messages}
    />
  )
}
