import UserProfile from "@/components/userProfile/UserProfile";

interface Props {
  params: Promise<{ username: string }>;
}

export default async function UserProfilePage({ params }: Props) {
  const { username } = await params;
  return <UserProfile username={username} />;
}