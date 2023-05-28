import { SignIn, SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import Game from "~/components/Game";
import Navbar from "~/components/Navbar";
import { PlayerStats } from "~/server/api/routers/game";
import { api } from "~/utils/api";

const Home: NextPage = () => {
  const user = useUser();

  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="h-screen w-screen bg-[url('/game-bg.jpg')] main">
        <Navbar />
        <div>{!user.isSignedIn && <SignInButton />}</div>
        <div>
          {!!user.isSignedIn && (
            <>
              <Game />
            </>
          )}
        </div>
      </main>
    </>
  );
};

export default Home;
