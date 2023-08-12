import Link from 'next/link';
import Image from 'next/image';
import { NavLinks } from '@/constants';
import AuthProviders from './AuthProviders';
import { getCurrentUser } from '@/lib/session';
import { signOut } from 'next-auth/react';
import ProfileMenu from './ProfileMenu';
import Button from './Button';

const Navbar = async () => {
  const session = await getCurrentUser();

  return (
    <nav className="flexBetween navbar">
      <div className="flex-1 flexStart gap-10">
        <Link href="/application">
          <Image
            src="/logo.svg"
            width={115}
            height={43}
            alt='Flexibble'
          />
        </Link>

        <ul className="xl:flex hidden text-small gap-7">
          {NavLinks.map(link => (
            <Link href={link.href} key={link.key}>
              {link.text}
            </Link>
          ))}
        </ul>
      </div>

      <div className='flexCenter gap-4'>
        {session?.user ? (
            <>
              <ProfileMenu session={session} />
              
              <Link 
                href="/application/create-project"
                className="py-2 px-3 rounded-xl bg-primary-purple text-white"
              >
                Share Work
              </Link>
            </>
          ) : (
            <Link 
              href="/signin"
              className="py-2 px-3 rounded-xl bg-primary-purple text-white"
            >
              Sign In
            </Link>
            
            // <AuthProviders />
          )
        }
      </div>
    </nav>
  )
}

export default Navbar