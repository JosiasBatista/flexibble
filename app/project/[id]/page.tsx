import { ProjectInterface } from '@/common.types';
import Modal from '@/components/Modal';
import ProjectActions from '@/components/ProjectActions';
import RelatedProjects from '@/components/RelatedProjects';
import { getProjectDetails } from '@/lib/actions';
import { getCurrentUser } from '@/lib/session';
import Image from 'next/image';
import Link from 'next/link';

const Project = async ({ params: { id } }: { params: { id: string }}) => {
  const session = await getCurrentUser();
  const result = await getProjectDetails(id) as {
    project?: ProjectInterface
  };
  
  if (!result?.project) {
    <p>Failed to fetch project information</p>
  }

  const project = result?.project

  return (
    <Modal>
      <section className="flexBetween gap-y-8 max-w-4xl max-xs:flex-col w-full">
        <div className="flex-1 flex items-start gap-5 w-full max-xs:flex-col">
          <Image
            src={project?.createdBy?.avatarUrl || ""}
            width={45}
            height={45}
            className="rounded-full"
            alt="Profile image"
          />

          <div className="gap-2">
            <p className="font-semibold text-lg">{project?.title}</p>

            <div className="flex flex-row gap-1">
              <p className="text-sm text-slate-400">
                {project?.createdBy?.name}
              </p>
              <Image src="/dot.svg" width={4} height={4} alt="dot" />
              <Link href={`/?category=${project?.category}`} className="text-sm text-purple-600">
                {project?.category}
              </Link>
            </div>
          </div>

        </div>
        {session?.user?.email == project?.createdBy?.email &&
          <div className="flex justify-end items-center gap-2">
            <ProjectActions 
              projectId={project?.id}
            />
          </div>
        }
      </section>

      <div className="mt-14">
        <Image
          src={`${project?.image}`}
          className="object-cover rounded-2xl"
          width={1064}
          height={798}
          alt="poster"
        />
      </div>

      <section className="flexCenter flex-col mt-14 gap-6">
        <p className="font-medium">{project?.description}</p>

        <div className="flex flex-row gap-6">
          {project?.githubUrl &&
            <Link href={project.githubUrl} 
              target="_blank" rel="noreferrer"
              className="text-sm text-purple-600"
            >🤖 Github</Link>
          }
          <Image src="/dot.svg" width={4} height={4} alt="dot" />
          {project?.liveSiteUrl &&
            <Link href={project.liveSiteUrl}
              target="_blank" rel="noreferrer"
              className="text-sm text-purple-600"
            >🚀 Live Site</Link>
          }
        </div>
      </section>

      <section className="flexCenter w-full gap-8 mt-28">
        <span className="w-full h-0.5 bg-light-white-200" />
        <Link href={`/profile/${project?.createdBy?.id}`} className="min-w-[82px] h-[82px]">
            <Image
                src={project?.createdBy?.avatarUrl || ""}
                className="rounded-full"
                width={82}
                height={82}
                alt="profile image"
            />
        </Link>
        <span className="w-full h-0.5 bg-light-white-200" />
      </section>

      <RelatedProjects 
        userId={project?.createdBy?.id || ""}
        projectId={project?.id || ""}
      />
    </Modal>
  )
}

export default Project