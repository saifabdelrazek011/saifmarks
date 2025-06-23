import Cookies from "js-cookie";

export const useAuthToken = () => {
  return Cookies.get("Authorization") || "";
};

export const checkAuthToken = (): boolean => {
  const token = useAuthToken();
  return !!token;
};
