import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import axiosInstance from "../../utils/axiosInstance";

const GameRoundsTable = () => {
  const [rounds, setRounds] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editedRound, setEditedRound] = useState({});
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newChannel, setNewChannel] = useState("");
  const [transactions, setTransactions] = useState([]);

  const [formData, setFormData] = useState({
    gameType: "chicken",
    multipliers: "",
    startTime: "",
    endTime: "",
    channelId: newChannel,
  });
  console.log("forom Data", formData);

  console.log(" ===== id: ", newChannel);

  console.log(formData);

  const apiId = import.meta.env.TELEGRAM_API_ID;
  const apiHash = import.meta.env.TELEGRAM_API_HASH;
  console.log("api id", apiId);
  console.log("api hash", apiHash);
  const gameOptions = ["chicken", "aviator", "color", "mining"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const fetchRounds = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/telegram/game-rounds`
      );
      setRounds(res.data.data || []);
    } catch (err) {
      console.error("Error fetching rounds:", err);
      toast.error("❌ Failed to fetch game rounds");
    }
  };

  useEffect(() => {
    fetchRounds();
  }, []);

  const fetchChannels = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/my-channels`
      );
      console.log("res", res.data.channels);
      setChannels(res.data.channels || []);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (showModal) {
      fetchChannels();
    }
  }, [showModal]);

  const handleEdit = (index) => {
    setEditIndex(index);
    setEditedRound({ ...rounds[index] });
  };

  const handleCancelEdit = () => {
    setEditIndex(null);
    setEditedRound({});
  };

  const handleInputChange = (field, value) => {
    setEditedRound((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/v1/telegram/update-round/${
          editedRound._id
        }`,
        editedRound
      );
      setEditIndex(null);
      fetchRounds();
      toast.success("✅ Round updated successfully");
    } catch (err) {
      console.error("Error saving round:", err);
      toast.error("❌ Failed to update round");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this round?")) return;
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/v1/telegram/delete-round/${id}`
      );
      fetchRounds();
      toast.success("🗑️ Round deleted successfully");
    } catch (err) {
      console.error("Error deleting round:", err);
      toast.error("❌ Failed to delete round");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      period: formData.gameType === "color" ? newPeriod : "",
      channelId: newChannel,
      multipliers: formData.multipliers.split(",").map(Number),
    };

    console.log("payload", payload);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/telegram/round`,
        payload
      );
      setNewPeriod("");
      setChannels("");
      console.log(res.data);
      setShowModal(false);
      fetchRounds();
      setFormData({
        gameType: "chicken",
        period: "",
        multipliers: "",
        startTime: "",
        endTime: "",
        channelId: 0,
      });

      toast.success("✅ Game round added successfully");
    } catch (err) {
      toast.error("❌ Failed to add game round");
      console.log("Failed to add game round", err);
    }
  };

  const [periodsList, setPeriodslist] = useState([]);
  const [newPeriod, setNewPeriod] = useState([]);

  const fetchClorPeriod = async () => {
    try {
      const res = await axiosInstance.get("/api/v1/color/next-periods");
      setPeriodslist(res?.data?.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchClorPeriod();
  }, []);

  return (
    <div className=" md:p-6 text-white w-full">
      {/* Header */}

      <div className="flex flex-col pl-5 sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
        <h2 className="text-lg md:text-xl font-bold">🎮 Game Rounds</h2>
        <button
          onClick={() => setShowModal(true)}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm sm:text-base"
        >
          ➕ Add New Game Round
        </button>
      </div>

      {/* Table */}

      <div className="overflow-x-auto max-w-screen   ">
        <table className="min-w-ful  ml-5   text-sm sm:text-base bg-gray-800 rounded-lg text-white border border-gray-700">
          <thead className="bg-gray-700 text-left">
            <tr>
              {/* <th className="p-2">Game Type</th> */}
              <th className="p-2">Prediction</th>
              <th className="p-2">Start Time</th>
              <th className="p-2">End Time</th>
              {/* <th className="p-2">Period</th> */}
              <th className="p-2">Status</th>
              <th className="p-2 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {rounds.map((round, index) => (
              <tr key={round._id} className="border-t border-gray-600">
                {/* <td className="p-2">
                  {editIndex === index ? (
                    <select
                      value={editedRound.gameType}
                      onChange={(e) =>
                        handleInputChange("gameType", e.target.value)
                      }
                      className="bg-gray-900 p-1 rounded w-full"
                    >
                      {gameOptions.map((game) => (
                        <option key={game} value={game}>
                          {game.charAt(0).toUpperCase() + game.slice(1)}
                        </option>
                      ))}
                    </select>
                  ) : (
                    round.gameType
                  )}
                </td> */}
                <td className="p-2">
                  {editIndex === index ? (
                    <input
                      value={editedRound.multipliers.join(",")}
                      onChange={(e) =>
                        handleInputChange(
                          "multipliers",
                          e.target.value.split(",").map(Number)
                        )
                      }
                      className="bg-gray-900 p-1 rounded w-full"
                    />
                  ) : (
                    round.multipliers.join(", ")
                  )}
                </td>
                <td className="p-2">
                  {editIndex === index ? (
                    <input
                      type="datetime-local"
                      value={new Date(editedRound.startTime)
                        .toLocaleString("sv-SE", {
                          timeZone: "Asia/Kolkata",
                        })
                        .replace(" ", "T")}
                      onChange={(e) =>
                        handleInputChange(
                          "startTime",
                          new Date(e.target.value).toISOString()
                        )
                      }
                      className="bg-gray-900 p-1 rounded w-full"
                    />
                  ) : (
                    new Date(round.startTime).toLocaleString()
                  )}
                </td>
                <td className="p-2">
                  {editIndex === index ? (
                    <input
                      type="datetime-local"
                      value={new Date(editedRound.endTime)
                        .toLocaleString("sv-SE", {
                          timeZone: "Asia/Kolkata",
                        })
                        .replace(" ", "T")}
                      onChange={(e) =>
                        handleInputChange(
                          "endTime",
                          new Date(e.target.value).toISOString()
                        )
                      }
                      className="bg-gray-900 p-1 rounded w-full"
                    />
                  ) : (
                    new Date(round.endTime).toLocaleString()
                  )}
                </td>

                {/* <td className="p-2">
                  {editIndex === index ? (
                    <select
                      value={editedRound.period}
                      onChange={(e) =>
                        handleInputChange("period", e.target.value)
                      }
                      className="bg-gray-900 p-1 rounded w-full"
                    >
                      {periodsList.map((per) => (
                        <option key={per.id} value={per.id}>
                          {per?.period?.slice(-6) || "---"}
                        </option>
                      ))}
                    </select>
                  ) : (
                    round.period
                  )}
                </td> */}
                <td className="p-2">{round.status}</td>
                <td className="p-2 text-center">
                  {editIndex === index ? (
                    <div className="flex gap-2 justify-center flex-wrap">
                      <button
                        onClick={handleSave}
                        className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-sm"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="bg-gray-600 hover:bg-gray-700 px-3 py-1 rounded text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2 justify-center flex-wrap">
                      <button
                        onClick={() => handleEdit(index)}
                        className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(round._id)}
                        className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
            {rounds.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center py-4 text-gray-400">
                  No game rounds found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 px-4">
          <form
            onSubmit={handleSubmit}
            className="bg-gray-900 w-full max-w-md p-6 rounded-lg space-y-4"
          >
            <h3 className="text-lg font-bold text-white">Add Game Round</h3>
            {/* <label htmlFor="channelSelect" className="block mb-2 font-medium">
              Game Type:
            </label>
            <select
              name="gameType"
              value={formData.gameType}
              onChange={handleChange}
              className="w-full p-2 bg-gray-700 rounded text-white"
              required
            >
              {gameOptions.map((game) => (
                <option key={game} value={game}>
                  {game.charAt(0) + game.slice(1)}
                </option>
              ))}
            </select> */}

            {/* {formData.gameType === "color" ? (
              periodsList.length > 0 ? (
                <div className="mb-6">
                  <label
                    htmlFor="channelSelect"
                    className="block mb-2 font-medium"
                  >
                    Select a Period:
                  </label>
                  <select
                    required
                    id="channelSelect"
                    className=" w-full p-2 bg-gray-700 rounded text-white "
                    value={newPeriod}
                    onChange={(e) => setNewPeriod(e.target.value)}
                  >
                    <option value="">-- Select a period --</option>
                    {periodsList.map((per) => (
                      <option key={per.id} value={per.id}>
                        {per?.period?.slice(-6) || "---"}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <p>No channels found.</p>
              )
            ) : (
              
              ""
            )} */}

            <label htmlFor="multipliers" className="block mb-2 font-medium">
              Prediction:
            </label>
            <input
              type="text"
              name="multipliers"
              value={formData.multipliers}
              onChange={handleChange}
              className="w-full p-2 bg-gray-700 rounded text-white"
              placeholder="Prediction"
              required
            />

            <label htmlFor="startTime" className="block mb-2 font-medium">
              Start Time:
            </label>

            <input
              type="datetime-local"
              name="startTime"
              value={formData.startTime}
              onChange={handleChange}
              className="w-full p-2 bg-gray-700 rounded text-white"
              required
            />

            {channels.length > 0 ? (
              <div className="mb-6">
                <label
                  htmlFor="channelSelect"
                  className="block mb-2 font-medium"
                >
                  Select a Channel:
                </label>
                <select
                  required
                  id="channelSelect"
                  className=" w-full p-2 bg-gray-700 rounded text-white "
                  value={newChannel}
                  onChange={(e) => setNewChannel(e.target.value)}
                >
                  <option value="">-- Select a channel --</option>
                  {channels.map((channel) => (
                    <option key={channel.id} value={channel.id}>
                      {channel.title}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <p>No channels found.</p>
            )}

            <label htmlFor="endTime" className="block mb-2 font-medium">
              End Time:
            </label>
            <input
              type="datetime-local"
              name="endTime"
              value={formData.endTime}
              onChange={handleChange}
              className="w-full p-2 bg-gray-700 rounded text-white"
              required
            />

            <div className="flex justify-end gap-3">
              <button
                type="button"
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded text-white"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default GameRoundsTable;

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { toast } from "react-toastify";

// const GameRoundsTable = () => {
//   const [predictions, setPredictions] = useState([]);
//   const [showModal, setShowModal] = useState(false);
//   const [channels, setChannels] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [newChannel, setNewChannel] = useState("");
//   const [formData, setFormData] = useState({
//     prediction: "LEFT",
//     confidence: "",
//     time: "",
//     chatId: "",
//   });

//   console.log(formData);

//   const fetchPredictions = async () => {
//     try {
//       const res = await axios.get(
//         `${import.meta.env.VITE_API_URL}/api/v1/telegram/game-rounds`
//       );
//       setPredictions(res.data.data || []);
//     } catch (err) {
//       toast.error("❌ Failed to fetch predictions");
//     }
//   };

//   useEffect(() => {
//     fetchPredictions();
//   }, []);

//   const fetchChannels = async () => {
//     try {
//       setLoading(true);
//       const res = await axios.get(
//         `${import.meta.env.VITE_API_URL}/my-channels`
//       );
//       setChannels(res.data.channels || []);
//     } catch (err) {
//       toast.error("❌ Failed to fetch channels");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (showModal) fetchChannels();
//   }, [showModal]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const payload = {
//       ...formData,
//       confidence: Number(formData.confidence),
//       chatId: newChannel,
//     };

//     try {
//       await axios.post(
//         `${import.meta.env.VITE_API_URL}/api/v1/telegram/round`,
//         payload
//       );
//       toast.success("✅ Prediction created");
//       fetchPredictions();
//       setShowModal(false);
//       setFormData({
//         prediction: "LEFT",
//         confidence: "",
//         time: "",
//         chatId: "",
//       });
//     } catch (err) {
//       console.error(err);
//       toast.error("❌ Failed to create prediction");
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm("Are you sure?")) return;
//     try {
//       await axios.delete(
//         `${import.meta.env.VITE_API_URL}/api/v1/telegram/delete-round/${id}`
//       );
//       toast.success("🗑️ Deleted");
//       fetchPredictions();
//     } catch (err) {
//       toast.error("❌ Failed to delete");
//     }
//   };

//   return (
//     <div className="p-6 text-white">
//       <div className="flex justify-between mb-4">
//         <h2 className="text-xl font-bold">Telegram Predictions</h2>
//         <button
//           onClick={() => setShowModal(true)}
//           className="bg-green-600 px-4 py-2 rounded"
//         >
//           ➕ Add Prediction
//         </button>
//       </div>

//       <div className="overflow-x-auto">
//         <table className="w-full bg-gray-800 rounded">
//           <thead className="bg-gray-700">
//             <tr>
//               <th className="p-2 text-left">Prediction</th>
//               <th className="p-2 text-left">Confidence</th>
//               <th className="p-2 text-left">Time</th>
//               <th className="p-2 text-left">Status</th>
//               {/* <th className="p-2 text-left">Created By</th> */}
//               <th className="p-2 text-left">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {predictions.map((pred) => (
//               <tr key={pred._id} className="border-t border-gray-600">
//                 <td className="p-2">{pred.prediction}</td>
//                 <td className="p-2">{pred.confidence}%</td>
//                 <td className="p-2">
//                   {new Date(pred.time).toLocaleString("en-IN")}
//                 </td>
//                 <td className="p-2">{pred.status}</td>
//                 {/* <td className="p-2">{pred.createdBy}</td> */}
//                 <td className="p-2">
//                   <button
//                     onClick={() => handleDelete(pred._id)}
//                     className="bg-red-600 px-3 py-1 rounded"
//                   >
//                     Delete
//                   </button>
//                 </td>
//               </tr>
//             ))}
//             {predictions.length === 0 && (
//               <tr>
//                 <td colSpan="6" className="text-center py-4 text-gray-400">
//                   No predictions found.
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* Modal */}
//       {showModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
//           <form
//             onSubmit={handleSubmit}
//             className="bg-gray-900 w-full max-w-md p-6 rounded-lg space-y-4"
//           >
//             <h3 className="text-lg font-bold text-white">New Prediction</h3>

//             <div>
//               <label className="block mb-1">Prediction (e.g. 1.02)</label>
//               <input
//                 type="number"
//                 name="prediction"
//                 step="0.01"
//                 min="0"
//                 value={formData.prediction}
//                 onChange={handleChange}
//                 className="w-full p-2 bg-gray-700 rounded text-white"
//                 required
//               />
//             </div>

//             <div>
//               <label className="block mb-1">Confidence (%)</label>
//               <input
//                 type="number"
//                 name="confidence"
//                 value={formData.confidence}
//                 onChange={handleChange}
//                 className="w-full p-2 bg-gray-700 rounded text-white"
//                 required
//                 min={0}
//                 max={100}
//               />
//             </div>

//             <div>
//               <label className="block mb-1">Prediction Time</label>
//               <input
//                 type="datetime-local"
//                 name="time"
//                 value={formData.time}
//                 onChange={handleChange}
//                 className="w-full p-2 bg-gray-700 rounded text-white"
//                 required
//               />
//             </div>

//             {/* <div>
//               <label className="block mb-1">Created By</label>
//               <input
//                 type="text"
//                 name="createdBy"
//                 value={formData.createdBy}
//                 onChange={handleChange}
//                 className="w-full p-2 bg-gray-700 rounded text-white"
//                 required
//               />
//             </div> */}

//             <div>
//               <label className="block mb-1">Select Channel</label>
//               <select
//                 required
//                 value={newChannel}
//                 onChange={(e) => setNewChannel(e.target.value)}
//                 className="w-full p-2 bg-gray-700 rounded text-white"
//               >
//                 <option value="">-- Select a channel --</option>
//                 {channels.map((channel) => (
//                   <option key={channel.id} value={channel.id}>
//                     {channel.title}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div className="flex justify-end gap-3">
//               <button
//                 type="button"
//                 onClick={() => setShowModal(false)}
//                 className="px-4 py-2 bg-gray-600 rounded"
//               >
//                 Cancel
//               </button>
//               <button
//                 type="submit"
//                 className="px-4 py-2 bg-blue-600 rounded text-white"
//               >
//                 Submit
//               </button>
//             </div>
//           </form>
//         </div>
//       )}
//     </div>
//   );
// };

// export default GameRoundsTable;
