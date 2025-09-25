import React, { useEffect, useState } from "react";
import {
  User,
  Settings,
  Headphones,
  Home,
  Users,
  FileText,
  CreditCard,
  Share2,
  RefreshCcw,
  LogOut,
  Lock,
} from "lucide-react";
import BottomBar from "../BottomBar";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import { useBalance } from "../../context/BalanceContext";
import {
  MenuButton,
  Menu,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import { ReferEarn } from "../ReferEarn";
import Button from "../Button";
import PasswordInput from "../PasswordInput";
import { GiChicken, GiGoldBar } from "react-icons/gi";
import { FaPlaneDeparture } from "react-icons/fa";
import { IoIosColorFilter } from "react-icons/io";

export default function ProfilePage() {
  const [isReferOpen, setIsReferOpen] = useState(false);

  const { user, logout, isAuthenticated } = useAuth();
  const [games, setGames] = useState([]);
  const { balance } = useBalance();
  const integerBalance = Math.floor(parseInt(balance, 10));

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/v1/users/visible-games`)
      .then((response) => response.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          setGames(data.data);
        }
      });
  }, []);

  const gameInfo = {
    chicken: {
      displayName: "Chicken Escape",
      image: <GiChicken className="w-5 h-5 text-yellow-500" />,
      link: "/chicken-road",
    },
  };

  return (
    <div className="min-h-screen flex relative  overflow-x-hidden  bg-gradient-to-t from-[#160003] to-[#420303]">
      <div className="md:max-w-md sm:max-w-md w-full shadow-2xl shadow-amber-50/15 flex flex-col text-white py-5 pb-20 mx-auto">
        <div className="border  fixed left w-full bottom-0 rounded-t-xl border-none z-20">
          <BottomBar />
        </div>

        <div className="p-4 flex justify-end items-center">
          <div className="flex gap-4">
            {isAuthenticated ? (
              <Menu as="div" className="relative ml-3">
                <div>
                  <MenuButton className="relative h-10 w-10 flex justify-center items-center rounded-full bg-transparent text-amber-200 text-xl font-medium z-50 shadow-xs shadow-[#9C1137]">
                    {user.fullName[0]}
                  </MenuButton>
                </div>

                <Transition
                  enter="transition-transform transition-opacity duration-300 ease-out"
                  enterFrom="-translate-x-full opacity-0" // start from left
                  enterTo="translate-x-0 opacity-100" // slide in to center
                  leave="transition-transform transition-opacity duration-300 ease-in"
                  leaveFrom="translate-x-0 opacity-100" // start at center
                  leaveTo="-translate-x-full opacity-0" // exit to left
                >
                  <MenuItems className="fixed top-0 left-0 z-100 h-screen overflow-y-auto w-64 md:w-64 sm:w-full transform bg-[#160003] focus:outline-none pt-4">
                    <span className="block px-4 py-2 text-sm cursor-pointer">
                      <p className="text-amber-200">{user.fullName}</p>
                      <p>
                        {user._id[0]}
                        {user._id[1]}*****{user._id[user._id.length - 1]}
                        {user._id[user._id.length - 2]}
                      </p>
                    </span>

                    <MenuItem>
                      <a
                        href="/transactions"
                        className="block px-4 py-2 text-sm hover:shadow-xs shadow-red-500 focus:outline-none"
                      >
                        Transactions
                      </a>
                    </MenuItem>

                    <a
                      href="/spinner"
                      className="block px-4 py-2 text-sm hover:shadow-xs shadow-red-500 focus:outline-none cursor-pointer"
                    >
                      Spinner
                    </a>

                    <a
                      href="/bets"
                      className="block px-4 py-2 text-sm hover:shadow-xs shadow-red-500 focus:outline-none cursor-pointer"
                    >
                      All Bets
                    </a>

                    <a
                      href="/ranking"
                      className="block px-4 py-2 text-sm hover:shadow-xs shadow-red-500 focus:outline-none cursor-pointer"
                    >
                      Ranking
                    </a>

                    <a
                      href="/"
                      className="block px-4 py-2 text-sm hover:shadow-xs shadow-red-500 focus:outline-none cursor-pointer"
                    >
                      Help & Support
                    </a>

                    <a
                      onClick={(e) => {
                        e.preventDefault();
                        setIsReferOpen(true);
                      }}
                      href="/"
                      className="block px-4 py-2 text-sm hover:shadow-xs shadow-red-500 focus:outline-none cursor-pointer"
                    >
                      Refer & Earn
                    </a>

                    <ReferEarn
                      isOpen={isReferOpen}
                      onClose={() => setIsReferOpen(false)}
                      userId="12345"
                    />
                  </MenuItems>
                </Transition>
              </Menu>
            ) : (
              <>
                <Link to={"/login"}>
                  <Button
                    children="Login"
                    className="bg-transparent shadow-xs shadow-[#9C1137]"
                  />
                </Link>
                <Link to={"/signup"}>
                  <Button
                    children="Register"
                    className="bg-gradient-to-b from-[#9C1137] via-[#9C1137]  to-black"
                  />
                </Link>
              </>
            )}
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-lg font-semibold">{user?.phoneNumber}</h2>
          <div className="flex items-center justify-center mt-3">
            <div>
              <p className="text-gray-400 text-sm">Available(₹)</p>
              <p className="text-xl font-bold">₹ {`${integerBalance}`}</p>
            </div>
          </div>
        </div>

        {/* Menu List */}
        <div className="mt-6 space-y-3 mx-4">
          {isAuthenticated && (
            <div className="p-4 bg-white text-black shadow rounded-xl flex items-center justify-between">
              <span className="block py-2 text-sm cursor-pointer">
                <p className="text-[#9C1137]">{user?.fullName}</p>
                <p>
                  {user._id[0]}
                  {user._id[1]}*****{user._id[user._id.length - 1]}
                  {user._id[user._id.length - 2]}
                </p>
              </span>
              {user?.role === "admin" && (
                <Link
                  to="/admin"
                  className="block py-2 text-white px-4 rounded-3xl bg-[#9C1137] text-sm hover:shadow-xs shadow-red-500 focus:outline-none"
                >
                  Admin Panel
                </Link>
              )}
            </div>
          )}

          <Link
            to={"/change-password"}
            className="p-4 bg-white shadow rounded-xl flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <Lock className="w-5 h-5 text-green-500" />
              <span className="text-gray-800 font-medium">Change Password</span>
            </div>
          </Link>
          {games.map((gameKey) => {
            const info = gameInfo[gameKey];
            if (!info) return null;

            return (
              <Link
                key={info.displayName}
                to={info.link}
                className="p-4 bg-white shadow rounded-xl flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  {info.image}
                  <span className="text-gray-800 font-medium">
                    {info.displayName}
                  </span>
                </div>
              </Link>
            );
          })}

          {/*  */}

          {isAuthenticated && (
            <a
              onClick={logout}
              className="p-4 text-black bg-white shadow rounded-xl flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <LogOut className="w-5 h-5 text-red-500" />
                <span className="text-gray-800 font-medium">Sign out</span>
              </div>
            </a>
          )}
        </div>
      </div>
    </div>
    // </div>
  );
}
