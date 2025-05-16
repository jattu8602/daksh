import CommunityScreen from "../../../components/chat-screens/community-screens"

export default function FriendsPage() {
  const chats = [
    {
      id: 1,
      name: "mohit.panjwani_25",
      message: "Hey, how's it going?",
      time: "9:45 AM",
      avatar: "https://randomuser.me/api/portraits/men/25.jpg",
      isOnline: true,
    },
    {
      id: 2,
      name: "sakshi.shukla_03",
      message: "Let's study together!",
      time: "Yesterday",
      avatar: "https://randomuser.me/api/portraits/women/3.jpg",
      isLive: true,
    },
  ]

  return <CommunityScreen activeTab="friends" chats={chats} />
}
