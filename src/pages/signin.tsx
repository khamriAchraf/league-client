import { SignInButton, SignOutButton, useUser } from '@clerk/nextjs'
import Head from 'next/head'
import React from 'react'
import Game from '~/components/Game'

const Signin = () => {
    
    const user = useUser();

  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#fff] to-[#fff]">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          {!user.isSignedIn && <SignInButton />}
        </div>
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          {!!user.isSignedIn && (
            <>
              {user.user.id}
              <Game />
              
              <SignOutButton />
            </>
          )}
        </div>
      </main>
    </>
  )
}

export default Signin