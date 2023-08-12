import { getCurrentUser } from '@/lib/session';
import { UserProfile } from '@/common.types';
import { getUser } from '@/lib/actions';
import EditProfileForm from '@/components/EditProfileForm';

const EditProfile = async () => {
  // const [user, setUser] = useState<UserProfile>();
  const session = await getCurrentUser();
  const userFetched = await getUser(session?.user?.email) as { user: UserProfile }

  return (
    <div className="flex flex-col items-center justify-center">
      <section className="max-w-[50vw] flex flex-col">
        {userFetched ?
          <EditProfileForm user={userFetched.user} />
          :
          <span>Não foi encontrado o usuário</span>
        }
      </section>
    </div>
  )
}

export default EditProfile