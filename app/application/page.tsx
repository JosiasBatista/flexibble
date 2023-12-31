import { ProjectInterface, SessionInterface } from "@/common.types";
import Categories from "@/components/Categories";
import LoadMore from "@/components/LoadMore";
import ProjectCard from "@/components/ProjectCard";
import { fetchAllProjects } from "@/lib/actions";
import { getCurrentUser } from "@/lib/session";

type ProjectSearch = {
  projectSearch: {
    edges: { node: ProjectInterface }[];
    pageInfo: {
      hasPreviousPage: boolean;
      hasNextPage: boolean;
      startCursor: string;
      endCursor: string;
    }
  }
}

type SearchParams = {
  category?: string,
  endcursor?: string
}

type Props = {
  searchParams: SearchParams
}

export const dynamic = 'force-dynamic';
export const dynamicParams = true;
export const revalidate = 0;

const Home = async ({ searchParams: { category, endcursor }}: Props) => {
  const [data, session] = await Promise.all([
    fetchAllProjects(category, endcursor),
    getCurrentUser()
  ]) as [ProjectSearch, SessionInterface]
  // const data = await fetchAllProjects(category, endcursor) as ProjectSearch;
  // const session = await getCurrentUser();
  
  const projectsToDisplay = data?.projectSearch?.edges || [];
  const pagination = data?.projectSearch?.pageInfo;

  if (projectsToDisplay.length === 0) {
    return (
      <section className="flexStart flex-col paddings">
        <Categories />

        <p className="no-result-text text-center">No projects, let's create something</p>
      </section>
    )
  }

  return (
    <section className="flex-start flex-col paddings mb-16">
      <Categories />
      
      <section className="projects-grid">
        {projectsToDisplay.map(({ node }: { node: ProjectInterface }) => (
          <ProjectCard
            key={node?.id}
            id={node?.id}
            image={node?.image}
            title={node?.title}
            name={node?.createdBy?.name}
            avatarUrl={node?.createdBy?.avatarUrl}
            userId={node?.createdBy?.id}
            likes={node?.likedBy}
            session={session}
          />
        ))}
      </section>

      <LoadMore 
        startCursor={pagination?.startCursor}
        endCursor={pagination?.endCursor}
        hasPreviousPage={pagination.hasPreviousPage}
        hasNextPage={pagination.hasNextPage}
      />
    </section>
  )
}

export default Home;