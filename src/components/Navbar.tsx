import { SignOutButton, useUser } from "@clerk/nextjs";
import React from "react";

const Navbar = () => {
  const user = useUser();

  return (
    <nav className="absolute flex w-screen items-center justify-center bg-transparent px-4 py-8 text-black">
      <div></div> {/* This empty div ensures the title is centered */}
      <div>
        <div className="text-2xl font-bold text-tan">
          Guess Who Won This Game
        </div>
        <img className="absolute top-0 left-1/2 -translate-x-2/4	" src="/linework-top.png" alt="" />
      </div>
      {/* {user.isSignedIn && (
        <div className="rounded bg-gold px-3 py-1 hover:bg-red-700">
          <SignOutButton />
        </div>
      )} */}
    </nav>
  );
};

export default Navbar;
