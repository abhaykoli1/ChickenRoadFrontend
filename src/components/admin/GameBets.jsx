import React, { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";
import BottomBar from "../BottomBar";
import { ReferEarn } from "../ReferEarn";

const GameBets = ({ userId }) => {
  const [userBets, setUserBets] = useState([]);
  const [selectedGameType, setSelectedGameType] = useState("aviator"); // Default to "aviator"
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isReferOpen, setIsReferOpen] = useState(false);

  const fetchUserBets = async (gameType) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_API_URL
        }/api/v1/admin/game-history/${userId}/${gameType}`
      );
      setUserBets(response.data.data || []); // Ensure response.data contains the data field
    } catch (err) {
      setError("Failed to fetch data");
      console.error("API Error:", err.response || err);
    } finally {
      setLoading(false);
    }
  };

  const formatTransactionType = (bet) =>
    bet.payoutAmount > 0 ? "Period Win" : "Join Period";

  const getAmount = (bet) => {
    const amount = bet.payoutAmount > 0 ? bet.payoutAmount : bet.betAmount;
    return `${amount >= 0 ? "+" : ""}${amount.toFixed(2)}`;
  };

  const getAmountStyle = (bet) => ({
    color: bet.payoutAmount > 0 ? "green" : "red",
    fontWeight: "bold",
  });

  useEffect(() => {
    fetchUserBets(selectedGameType);
  }, [selectedGameType]);

  return (
    <div className="min-h-screen  bg-gradient-to-b from-[#1a0a0a] to-[#420303] text-white ">
      <div className="md:max-w-md sm:max-w-md w-full h-screen py-10  shadow-2xl shadow-amber-50/15  flex flex-col  mx-auto">
        <div className="border  fixed left w-full bottom-0 rounded-t-xl border-none z-20">
          <BottomBar />
        </div>

        <div className="flex justify-between px-5 items-center mb-4">
          <h2 className="text-xl font-semibold  text-amber-200">
            Game History
          </h2>

          <a
            onClick={(e) => {
              e.preventDefault();
              setIsReferOpen(true);
            }}
            href="/"
            className="bg-amber-500  text-black px-4 py-2 rounded-md"
          >
            Refer & Earn
          </a>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p style={{ color: "red" }}>{error}</p>
        ) : (
          <table className="min-w-full  rounded-lg shadow-md">
            <thead>
              <tr className="bg-[#451118] text-[#9f3e3e] text-center text-sm font-semibold">
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Balance</th>
              </tr>
            </thead>
            <tbody>
              {userBets.map((bet, index) =>
                bet ? (
                  <tr
                    key={bet._id || index}
                    className="cursor-pointer transition-colors duration-200 text-center"
                  >
                    <td className="px-4 py-3">
                      {moment(bet?.createdAt)
                        .local()
                        .format("YYYY-MM-DD hh:mm A")}
                    </td>
                    <td style={getAmountStyle(bet)}>{getAmount(bet)}</td>
                  </tr>
                ) : null
              )}
            </tbody>
          </table>
        )}

        <ReferEarn
          isOpen={isReferOpen}
          onClose={() => setIsReferOpen(false)}
          userId="12345"
        />
      </div>
    </div>
  );
};

export default GameBets;
