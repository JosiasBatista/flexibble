"use client"

import { useEffect, useState } from 'react'
import { UserProfile } from '@/common.types'
import Image from 'next/image'
import FormField from './FormField'
import Button from './Button'
import { fetchToken, updateUser } from '@/lib/actions'

type EditProfileFormProps = {
  user: UserProfile
}

const EditProfileForm = ({ user }: EditProfileFormProps) => {
  const [form, setForm] = useState({
    username: user.name || "",
    description:  user.description || ""
  })
  const [submitting, setSubmitting] = useState<boolean>(false);

  useEffect(() => {
    setForm({
      username: user.name || "",
      description:  user.description || ""
    })
  }, [user])
  
  const handleStateChange = (fieldName: string, value: string) => {
    setForm((prevState) => ({
      ...prevState,
      [fieldName]: value
    }))
  }

  const updateProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    setSubmitting(true);

    const { token } = await fetchToken();
    
    try {
      await updateUser(user.email, form.username, form.description, token);

      alert("Usuário atualizado")
    } catch (error) {
      console.log(error);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <div className="flex flex-row items-center mt-16">
        {user?.avatarUrl ?
          <Image 
            src={user?.avatarUrl} 
            width={70} 
            height={70} 
            className="rounded-full" 
            alt="user image" 
          />
          :
          <div className="w-[70px] h-[70px] rounded-full bg-slate-600" />
        }

        <div className="flex flex-col ml-3">
          <strong className=" text-xl">{user?.name}</strong>
          <span>Update and manage your profile informations</span>
        </div>
      </div>

      <form className="mt-6 flex flex-col gap-3" onSubmit={updateProfile}>
        <FormField
          title="Username"
          state={form.username}
          placeholder="John Doe"
          setState={(value) => handleStateChange('username', value)}
        />

        <FormField
          title="Description"
          state={form.description}
          placeholder="I'm a great developer"
          setState={(value) => handleStateChange('description', value)}
        />

        <Button
          title={submitting ? "Saving..." : "Save"}
          type="submit"
          bgColor="bg-primary-purple"
          specificStyle="mt-8 mb-16"
          isSubmitting={submitting}
        />
      </form>
    </>
  )
}

export default EditProfileForm