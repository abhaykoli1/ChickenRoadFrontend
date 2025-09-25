import React, { useEffect, useRef, useState } from "react";
import Navbar from "../components/Navbar";
import BalanceButton from "../components/BalanceButton";
import { Link } from "react-router-dom";
import Slider from "../components/Slider";
import Button from "../components/Button";
import BottomBar from "../components/BottomBar";
import TelegramMenu from "../components/TelegramMenu";
import AboutDialog from "./notificationDiloag";

const Home = () => {
  const [games, setGames] = useState([]);
  console.log(games);
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
      displayName: "Chicken Road",
      displayMsg: "Dodge cars, cross the road, and test your reflexes.",
      image: "https://cultmtl.com/wp-content/uploads/2025/06/IMG_8547.jpeg",
      link: "/chicken-road",
    },
  };

  return (
    <div className="min-h-screen flex relative  overflow-x-hidden  bg-gradient-to-t from-[#160003] to-[#420303]">
      <div className="md:max-w-md sm:max-w-md w-full shadow-2xl shadow-amber-50/15 flex flex-col text-white   mx-auto">
        <div className=" md:borderx-[0.5px] shadow-2xl shadow-amber-50/15 pt-5  pb-20 h-full">
          <AboutDialog />
          <div className="fixed !z-40  top-1/2  -translate-y-1/2 right-5">
            <TelegramMenu />
          </div>
          <span className="">
            <Navbar />
          </span>
          <div className="border  fixed left w-full bottom-0 rounded-t-xl border-none z-20">
            <BottomBar />
          </div>

          <div className=" flex hidde flex-col">
            <div className="my-8 flex gap-y-12 md:px-20 px-6 justify-center">
              {games.map((gameKey) => {
                const info = gameInfo[gameKey];
                if (!info) return null;

                return (
                  <Link
                    to={info.link}
                    key={gameKey}
                    className="p-1 shadow-xs  shadow-gray-700 bg-transparent flex flex-col gap-4 max-w-72 md:w-72"
                  >
                    <img
                      src={info.image}
                      alt={info.displayName}
                      className="h-52 rounded bg-contain"
                      style={{ objectFit: "fill", objectPosition: "center" }}
                    />

                    <h3 className="text-gray-400 pl-2 flex gap-2">
                      <span className="min-w-2 max-h-2 mt-2 bg-green-300 rounded-full text-center items-center"></span>
                      <p>{info.displayName}</p>
                    </h3>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
