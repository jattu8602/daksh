import DirectChat from "../../../components/chat-screens/direct-chat"

export default function DirectChatPage() {
  // Sample data for the chat with mohit.panjwani_25
  const messages = [
    {
      id: 1,
      text: "You coming tomorrow??",
      time: "6:06 pm",
      isMe: false,
    },
    {
      id: 2,
      text: "Yes I am coming to school.",
      time: "6:06 pm",
      isMe: true,
    },
    {
      id: 3,
      text: "What are you doing right now?",
      time: "6:06 pm",
      isMe: false,
    },
    {
      id: 4,
      text: "Just finishing today's work.",
      time: "6:06 pm",
      isMe: true,
    },
    {
      id: 5,
      text: "What test do we have next week?",
      time: "6:06 pm",
      isMe: false,
    },
    {
      id: 6,
      text: "I am not sure, let me ask Rohan.",
      time: "6:06 pm",
      isMe: true,
    },
    {
      id: 7,
      text: "Can i get history notes?",
      time: "6:06 pm",
      isMe: false,
    },
  ]

  return (
    <DirectChat avatar="https://randomuser.me/api/portraits/men/32.jpg" name="mohit.panjwani_25" messages={messages} />
  )
}
