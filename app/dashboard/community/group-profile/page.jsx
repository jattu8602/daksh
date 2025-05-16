import GroupProfileScreen from "@/components/chat-screens/group-profile-screen"

export default function GroupProfilePage() {
  // Sample data for the group profile
  const members = [
    {
      id: 1,
      name: "chetna.singh_28",
      avatar: "https://randomuser.me/api/portraits/women/28.jpg",
    },
    {
      id: 2,
      name: "ashif.khan_04",
      avatar: "https://randomuser.me/api/portraits/men/4.jpg",
    },
    {
      id: 3,
      name: "siddhart.nigam_48",
      avatar: "https://randomuser.me/api/portraits/men/48.jpg",
    },
    {
      id: 4,
      name: "sakshi.shukla_03",
      avatar: "https://randomuser.me/api/portraits/women/3.jpg",
      isLive: true,
    },
    {
      id: 5,
      name: "avni.pandya_01",
      avatar: "https://randomuser.me/api/portraits/women/1.jpg",
      isLive: true,
    },
    {
      id: 6,
      name: "bhagyashree.shukla_03",
      avatar: "https://randomuser.me/api/portraits/women/13.jpg",
    },
  ]

  return (
    <GroupProfileScreen
      groupName="Official 10-B"
      groupAvatar="https://randomuser.me/api/portraits/men/85.jpg"
      members={members}
    />
  )
}
