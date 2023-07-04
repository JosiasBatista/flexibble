"use client"

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { deleteProject, fetchToken } from '@/lib/actions';
import { useRouter } from 'next/navigation';

type Props = {
  projectId: string
}

const ProjectActions = ({ projectId }: Props) => {
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const router = useRouter();

  const handleDeleteProject = async () => {
    setIsDeleting(true);

    const { token } = await fetchToken();

    try {
      await deleteProject(projectId, token);
      router.push('/');
    } catch (error) {
      console.log(error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Link
        href={`/edit-project/${projectId}`}
        className="flexCenter edit-action_btn"
      >
        <Image
          src="/pencile.svg"
          width={15}
          height={15}
          alt="Edit"
        />
      </Link>

      <button 
        type="button"
        onClick={handleDeleteProject}
        className={`flexCenter delete-action_btn 
        ${isDeleting ? 'bg-gray' : 'bg-primary-purple'}`}
      >
        <Image
          src="/trash.svg"
          width={15}
          height={15}
          alt="Delete"
        />
      </button>
    </>
  )
}

export default ProjectActions