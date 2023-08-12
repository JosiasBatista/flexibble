import AuthProviders from '@/components/AuthProviders'
import Image from 'next/image'
import React from 'react'

const SignIn = () => {
  return (
    <section className="h-[100vh] flex flex-row">
      <aside className="w-[20vw] h-screen relative">
        <Image
          src="/loginart.gif"
          fill
          alt="login gif"
          className="relative"
        />
      </aside>

      <div className="h-full w-2/3 flex flex-col items-start justify-center p-6">
        <Image
          src="/logo-purple.svg"
          width={140}
          height={42}
          alt="Flexibble"
        />

        <h1 className="text-3xl font-bold text-primary-purple mt-12 mb-2">Welcome! It's great to have you here</h1>
        <span className="mb-6">To proceed select the way to login and be part of our community</span>

        <AuthProviders />
      </div>
    </section>
  )
}

export default SignIn