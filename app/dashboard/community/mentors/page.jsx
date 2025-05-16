import CommunityScreen from "@/components/chat-screens/community-screen"

export default function CommunityPage() {
  // Sample data for the community screen
  const chats = [
    {
      id: 1,
      avatar: "https://randomuser.me/api/portraits/women/32.jpg",
      name: "learn.with.hanshika",
      message: "You are welcome",
      time: "now",
      isOnline: true,
    },
    {
      id: 2,
      avatar: "https://randomuser.me/api/portraits/men/42.jpg",
      name: "physics.by.bassi",
      message: "Were you able to submit?",
      time: "2m",
    },
    {
      id: 3,
      avatar: "https://randomuser.me/api/portraits/men/22.jpg",
      name: "solve.with.sinha_1",
      message: "Do review your mistakes carefully.",
      time: "20m",
    },
    {
      id: 4,
      avatar: "https://randomuser.me/api/portraits/men/52.jpg",
      name: "learn.with.ranjan",
      message: "Text me in case of any doubts.",
      time: "1h",
    },
    {
      id: 5,
      avatar: "https://randomuser.me/api/portraits/women/62.jpg",
      name: "revise.with.radhika",
      message: "We will do the next quiz tomorrow.",
      time: "5h",
    },
    {
      id: 6,
      avatar: "https://randomuser.me/api/portraits/men/72.jpg",
      name: "excel.with.shubham",
      message: "Text me in case of any doubts.",
      time: "12h",
    },
    {
      id: 7,
      avatar: "https://randomuser.me/api/portraits/men/82.jpg",
      name: "solve.with.rajesh",
      message: "Practice more.",
      time: "1d",
    },
    {
      id: 8,
      avatar: "https://randomuser.me/api/portraits/women/92.jpg",
      name: "learn.with.siya",
      message: "Text me in case of any doubts.",
      time: "1d",
    },
  ]

  return <CommunityScreen activeTab="mentors" chats={chats} />
}
