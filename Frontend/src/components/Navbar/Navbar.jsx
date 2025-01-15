import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import Logo from "../Logo";
import Button from "../Button";
import Search from "./Search";

function Navbar() {
  const authStatus = useSelector((state) => state.auth.status);
  const userData = useSelector((state) => state.auth.userData);

  return (
    <nav className="flex items-center justify-between bg-black p-4">
      {/* Logo */}
      <Link to="/" aria-label="Home">
        <Logo />
      </Link>

      {/* Search Component */}
      <Search />

      {/* Authentication Buttons or User Avatar */}
      <div className="flex items-center space-x-4">
        {!authStatus ? (
          <>
            <Link to="/login" aria-label="Log in">
              <Button className="hover:bg-gray-500 py-2 px-4 rounded transition duration-150 ease-in-out active:scale-95">
                Log in
              </Button>
            </Link>
            <Link to="/signup" aria-label="Sign up">
              <Button className="bg-pink-700 hover:bg-pink-600 text-white py-2 px-4 rounded transition duration-150 ease-in-out active:scale-95">
                Sign up
              </Button>
            </Link>
          </>
        ) : (
          userData && (
            <Link
              to={`/channel/${userData.username}`}
              aria-label={`${userData.username}'s channel`}
              className="shrink-0"
            >
              <img
                src={userData.avatar}
                alt={userData.username || "User Avatar"}
                className="h-10 w-10 rounded-full object-cover"
              />
            </Link>
          )
        )}
      </div>
    </nav>
  );
}

export default Navbar;
