import axios from "axios";
import axiosInstance from "./axiosInstance";

const registerUser = async ({
  fullName,
  email,
  phoneNumber,
  password,
  ref_by,
}) => {
  try {
    const res = await axiosInstance.post(`/api/v1/users/register`, {
      fullName,
      email,
      phoneNumber,
      password,
      ref_by,
    });
    return res.data; // optional: return something useful
  } catch (error) {
    console.log("Failed to register user:", error);
    throw error; // optional: re-throw for UI to handle
  }
};

const verifyOTP = async ({
  userId,
  emailOTP,
  smsOTP,
  userEmail,
  password,
  login,
  navigate,
}) => {
  console.log("verifiying");
  console.log("verifiying...............");
  try {
    const res = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/v1/otp/verify`,
      { userId, emailOTP, smsOTP }
    );
    console.log(res, "...................");

    await login(
      userEmail.includes("@")
        ? { email: userEmail, password }
        : { email: userEmail, password }
    );
    navigate("/");
    return res.data; // optional: return something useful
  } catch (error) {
    console.log("OTP is not correct or expired", error);
    throw error; // optional: re-throw for UI to handle
  }
};

export { registerUser, verifyOTP };
