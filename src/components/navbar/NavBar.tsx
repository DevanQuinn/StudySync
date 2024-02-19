import React from "react";
import Link from "next/link";
import Logo from "./logo";
import Button from "./button";

const Navbar = () => {
  return (
    <>
      <div className="w-full h-20 bg-emerald-800 sticky top-0">
        <div className="container mx-auto px-4 h-full">
          <div className="flex justify-between items-center h-full">
            <Logo />
            <ul className="hidden md:flex gap-x-6 text-white">
              <li>
                <Link href="/FlashCards">
                  <p>Flashcards</p>
                </Link>
              </li>
              <li>
                <Link href="/studyroom">
                  <p>Study Room</p>
                </Link>
              </li>
              <li>
                <Link href="/Leaderboard">
                  <p>Leaderboard</p>
                </Link>
              </li>
              <li>
                <Link href="/contactus">
                  <p>Contact Us</p>
                </Link>
              </li>
            </ul>
            <Button />
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;