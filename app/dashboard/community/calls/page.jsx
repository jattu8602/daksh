import CommunityScreen from "../../../components/chat-screens/community-screens"

export default function CommunityCallsPage() {
  // Sample data for the community calls screen
  const chats = [
    {
      id: 1,
      avatar: "https://randomuser.me/api/portraits/men/24.jpg",
      name: "rohan.shukla_24",
      message: "Today, 06:01 pm",
      time: "",
      isMissedCall: false,
    },
    {
      id: 2,
      avatar: "https://randomuser.me/api/portraits/women/34.jpg",
      name: "radhika.singh_94",
      message: "Today, 04:15 pm",
      time: "",
      isMissedCall: true,
    },
    {
      id: 3,
      avatar: "https://randomuser.me/api/portraits/men/44.jpg",
      name: "nirupam.biswas_24",
      message: "Today, 06:15 am",
      time: "",
      isMissedCall: false,
    },
    {
      id: 4,
      avatar: "https://randomuser.me/api/portraits/men/54.jpg",
      name: "supratim.das_98",
      message: "Yesterday, 10:01 pm",
      time: "",
      isMissedCall: false,
    },
    {
      id: 5,
      avatar: "https://randomuser.me/api/portraits/men/64.jpg",
      name: "ankit.singh_94",
      message: "Yesterday, 07:15 pm",
      time: "",
      isMissedCall: false,
    },
    {
      id: 6,
      avatar: "https://randomuser.me/api/portraits/men/74.jpg",
      name: "rakesh.singh_09",
      message: "29 Feb, 06:15 am",
      time: "",
      isMissedCall: true,
    },
    {
      id: 7,
      avatar: "https://randomuser.me/api/portraits/men/84.jpg",
      name: "subham.mishra_98",
      message: "28 Feb, 09:15 pm",
      time: "",
      isMissedCall: true,
    },
    {
      id: 8,
      avatar: "https://randomuser.me/api/portraits/men/94.jpg",
      name: "kartik.singh_11",
      message: "28 Feb, 06:15 am",
      time: "",
      isMissedCall: false,
    },
  ]

  return <CommunityScreen activeTab="calls" chats={chats} />
}
