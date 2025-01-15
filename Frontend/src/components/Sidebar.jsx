import React, { memo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  GoHome,
  GoHistory,
  GoDeviceCameraVideo,
  GoQuestion,
} from "react-icons/go";
import { AiOutlineMessage } from "react-icons/ai";
import { BiLike } from "react-icons/bi";
import { BsCollectionPlay } from "react-icons/bs";
import { FiSettings } from "react-icons/fi";
import { GrLogout } from "react-icons/gr";
import { FaRegUserCircle } from "react-icons/fa";
import axiosInstance from "../utils/axios.helper";
import { unSetUser } from "../store/authSlice";

const navItems = [
  { name: "Home", route: "/", icon: GoHome },
  { name: "Tweets", route: "/tweets", icon: AiOutlineMessage },
  { name: "Liked Videos", route: "/liked-videos", icon: BiLike },
  { name: "History", route: "/history", icon: GoHistory },
  { name: "Subscriptions", route: "/subscriptions", icon: BsCollectionPlay },
  { name: "My Channel", route: "/channel/", icon: GoDeviceCameraVideo },
];

const Sidebar = () => {
  const authStatus = useSelector((state) => state.auth.status);
  const userData = useSelector((state) => state.auth.userData);
  const location = useLocation();
  const isWatchPage = location.pathname.includes("/watchpage");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      await axiosInstance.post("/users/logout", {});
      dispatch(unSetUser());
      localStorage.removeItem("accessToken");
      toast.success("Logged out successfully.");
      navigate("/");
    } catch (error) {
      toast.error("Failed to log out. Please try again.");
      console.error("Logout error:", error);
    }
  };

  return (
    <div
      className={`bg-black text-white h-full flex flex-col border border-y-0 border-l-0 transition-all duration-100 ease-in-out ${
        isWatchPage ? "w-16" : "w-64"
      }`}
    >
      {/* Navigation Links */}
      <ul className="flex-grow px-2 py-2">
        {navItems.map(({ name, route, icon: Icon }, index) => (
          <NavLink
            key={index}
            to={
              route.includes(":username") && userData
                ? `${route}${userData.username}`
                : route
            }
            className={({ isActive }) =>
              `py-2 hover:bg-gray-800 transition-all duration-100 cursor-pointer flex items-center rounded-lg ${
                isActive ? "text-pink-700" : "text-gray-200"
              } ${isWatchPage ? "justify-center" : "px-5"}`
            }
          >
            <span className={`${isWatchPage ? "" : "mr-2"}`}>
              <Icon className="w-6 h-6" />
            </span>
            {!isWatchPage && name}
          </NavLink>
        ))}
        {/* Admin Dashboard */}
        {authStatus && (
          <NavLink
            to="/admin/dashboard"
            className={({ isActive }) =>
              `py-2 hover:bg-gray-800 transition-all duration-100 cursor-pointer flex items-center rounded-lg ${
                isActive ? "text-pink-700" : "text-gray-200"
              } ${isWatchPage ? "justify-center" : "px-5"}`
            }
          >
            <span className={`${isWatchPage ? "" : "mr-2"}`}>
              <FaRegUserCircle className="w-6 h-6" />
            </span>
            {!isWatchPage && "Dashboard"}
          </NavLink>
        )}
      </ul>
      {/* Settings and Logout */}
      <ul className="px-2 py-2">
        {authStatus && (
          <>
            <li
              onClick={handleLogout}
              className={`py-2 hover:bg-gray-800 transition-all duration-100 cursor-pointer flex items-center rounded-lg ${
                isWatchPage ? "justify-center" : "px-5"
              }`}
            >
              <span className={`${isWatchPage ? "ml-1" : "mr-2"}`}>
                <GrLogout className="w-6 h-6" />
              </span>
              {!isWatchPage && "Logout"}
            </li>
            <NavLink
              to="/settings"
              className={({ isActive }) =>
                `py-2 hover:bg-gray-800 transition-all duration-100 cursor-pointer flex items-center rounded-lg ${
                  isActive ? "text-pink-700" : "text-gray-200"
                } ${isWatchPage ? "justify-center" : "px-5"}`
              }
            >
              <span className={`${isWatchPage ? "" : "mr-2"}`}>
                <FiSettings className="w-6 h-6" />
              </span>
              {!isWatchPage && "Settings"}
            </NavLink>
          </>
        )}
        {/* Support */}
        <NavLink
          to="/support"
          className={({ isActive }) =>
            `py-2 hover:bg-gray-800 transition-all duration-100 cursor-pointer flex items-center rounded-lg ${
              isActive ? "text-pink-700" : "text-gray-200"
            } ${isWatchPage ? "justify-center" : "px-5"}`
          }
        >
          <span className={`${isWatchPage ? "" : "mr-2"}`}>
            <GoQuestion className="w-6 h-6" />
          </span>
          {!isWatchPage && "Support"}
        </NavLink>
      </ul>
    </div>
  );
};

export default memo(Sidebar);
