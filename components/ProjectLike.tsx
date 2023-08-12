"use client";

import { SessionInterface } from '@/common.types';
import { dislikePost, fetchToken, likePost } from '@/lib/actions';
import Image from 'next/image';
import React, { useState } from 'react';
import Modal from './Modal';
import AuthProviders from './AuthProviders';

type LikesStructure = {
  edges: { 
    node: {
      id: string,
      user: {
        id: string
      }
    } 
  }[]
}

type Props = {
  id: string,
  session: SessionInterface,
  likes: LikesStructure,
  className?: string,
}

type LikeResponse = {
  likeCreate: {
    like: {
      user: {
        email: string
      },
      project: {
        id: string
      },
      id: string
    }
  }
}

const ProjectLike = ({
  id,
  session,
  likes,
  className
}: Props) => {
  const [likesList, setLikesList] = useState<LikesStructure>(likes || { edges: [] });
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);

  const userAlreadyLiked = (userId: string) => {
    return likesList.edges.find(({ node }) => {
      return node?.user?.id === userId
    })
  }

  const likeAction = async () => {
    const userId = session?.user?.id;
    if (!userId) {
      setIsLoginModalOpen(true);
      return;
    }

    const userAlreadyLike = userAlreadyLiked(userId);

    const { token } = await fetchToken();

    if (userAlreadyLike === undefined) {
      const likeReturned: LikeResponse = await likePost(id, userId, token) as LikeResponse;

      const newNode = {
        id: likeReturned.likeCreate?.like?.id || "",
        user: {
          id: userId
        }
      }
      
      const newLikesList = {...likesList}
      newLikesList.edges.push({ node: newNode });

      setLikesList(newLikesList)
    } else {
      await dislikePost(userAlreadyLike?.node?.id, token)

      const newLikesList = {...likesList};
      newLikesList.edges = newLikesList.edges.filter(({ node }) => (
        node?.user?.id !== userId
      ))

      setLikesList(newLikesList)
    }
  }

  return (
    <>
      <button className={`flexCenter gap-2 cursor-pointer ${className}`} onClick={likeAction}>
        {userAlreadyLiked(session?.user?.id) !== undefined ?
          <Image src="/hearth.svg" width={13} height={12} alt="heart" />
          :
          <Image src="/heart-void.svg" width={13} height={12} alt="heart" />
        }
        <p className="text-sm">{likesList?.edges?.length || 0}</p>
      </button>
    
      {isLoginModalOpen &&
        <Modal closeFunction={() => setIsLoginModalOpen(false)}>
          <Image
            src="/login.svg"
            width={500}
            height={450}
            alt="login image"
          />

          <h1 className="font-bold text-4xl text-center text-primary-purple mt-4">
            Ops! You are not logged in
          </h1>
          <p className="mt-2 mb-6 text-center">Do you want to login to proceed with your navigation?</p>

          <AuthProviders />
        </Modal>
      }
    </>
  )
}

export default ProjectLike