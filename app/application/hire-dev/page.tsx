import Button from '@/components/Button'
import { getUserList } from '@/lib/actions'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

type DeveloperInfos = {
  name: string,
  email: string,
  avatarUrl: string,
  description: string,
  id: string,
  githubUrl: string
}

type UserList = {
  userCollection: {
    edges: { 
      node: {
        name: string
        email: string
        avatarUrl: string
        description: string
        id: string
        githubUrl: string
      }
    }[];
    pageInfo: {
      hasPreviousPage: boolean;
      hasNextPage: boolean;
      startCursor: string;
      endCursor: string;
    }
  }
}

const DeveloperCard = ({ developer }: { developer: DeveloperInfos }) => {
  if (!developer) return <></>;

  return (
    <div className="rounded-2xl shadow-lg p-4 flex flex-col">
      <Link 
        href={`/application/profile/${developer.id}`} 
      >
        <div className="flex flex-row gap-2 items-center">
          <Image
            src={developer.avatarUrl}
            width={80}
            height={80}
            className="rounded-full"
            alt="user profile image"
          />

          <div className="flex flex-col">
            <strong className="text-xl">{developer.name}</strong>
            <a href={developer.githubUrl} className="text-slate-700">
              {developer.githubUrl || "Github not informed"}
            </a>
          </div>
        </div>
      </Link>

      <p className="my-4 text-2xl">{developer.description}</p>

      <Link href={`mailto:${developer?.email}`} className=" max-w-[40%] mt-4">
          <Button title="Hire Me" leftIcon="/email.svg" />
      </Link>
    </div>
  )
}

const HireDeveloper = async () => {
  const developers = await getUserList() as UserList;
  console.log(developers.userCollection.edges)

  return (
    <div className="max-w-[80vw] my-10 mx-auto">
      <h1 className="font-bold text-primary-purple text-3xl text-center md:text-left">Find the developer that fits in your needs</h1>

      <section className="mt-6 gap-4 flex flex-col items-center md:grid md:grid-cols-fluid">
        {developers?.userCollection?.edges.map((dev) => (
          <DeveloperCard developer={dev?.node} key={dev?.node.id} />
        ))}
      </section>
    </div>
  )
}

export default HireDeveloper