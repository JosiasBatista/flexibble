import { UserProfile } from "@/common.types"
import ProfilePage from "@/components/ProfilePage"
import { getUserProjects } from "@/lib/actions"

type Props = {
  params: {
    id: string
  }
}

const UserProfile = async ({ params: { id }}: Props) => {
  const result = await getUserProjects(id, 100) as { user: UserProfile };

  if (!result) {
    return (
      <p className="no-result-text">Fail to fetch user info</p>
    )
  }

  return (
    <ProfilePage 
      user={result?.user}
    />
  )
}

export default UserProfile