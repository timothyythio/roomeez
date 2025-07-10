export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "RoomEez";
export const APP_DESC =
  process.env.NEXT_PUBLIC_DESC || "Placeholder description for now! :)";
export const SERVER_URL =
  process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3001";

export const signInDefaultValues = {
  email: "",
  password: "",
};
export const signUpDefaultValues = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};
