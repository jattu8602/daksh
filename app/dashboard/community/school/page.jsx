import CommunityScreen from "../../../components/chat-screens/community-screens"

export default function SchoolPage() {
  const chats = [
    {
      id: 1,
      name: "Official 10-B",
      message: "Welcome to the class group!",
      time: "10:30 AM",
      avatar: "https://randomuser.me/api/portraits/men/85.jpg",
      name: "Official 10-B",
      message: "Akshat: Please share som.....",
      time: "6:11 pm",
      unread: 1,
    },
    {
      id: 2,
      avatar: "https://randomuser.me/api/portraits/women/45.jpg",
      name: "ankita.maam_science",
      message: "Do revise more.",
      time: "3h",
    },
    {
      id: 3,
      avatar: "https://randomuser.me/api/portraits/women/55.jpg",
      name: "payal.maam_english",
      message: "Have you done the vocab quiz?",
      time: "2h",
    },
    {
      id: 4,
      avatar: "https://randomuser.me/api/portraits/women/65.jpg",
      name: "parul.maam_english",
      message: "Have you done the homework?",
      time: "6h",
    },
    {
      id: 5,
      avatar: "https://randomuser.me/api/portraits/women/75.jpg",
      name: "ayushi.maam_hindi",
      message: "Let me know in case of any doubts.",
      time: "6h",
    },
    {
      id: 6,
      avatar: "https://randomuser.me/api/portraits/women/85.jpg",
      name: "akansha.maam_english",
      message: "Have you done the recent quiz?",
      time: "1d",
    },
    {
      id: 7,
      avatar: "https://randomuser.me/api/portraits/men/95.jpg",
      name: "raghav.sir_maths",
      message: "Be ready for tomorrow's test!",
      time: "1d",
    },
    {
      id: 8,
      avatar: "https://randomuser.me/api/portraits/women/55.jpg",
      name: "payal.maam_english",
      message: "Have you done the vocab quiz?",
      time: "2h",
    },
  ]

  return <CommunityScreen activeTab="school" chats={chats} />
}
