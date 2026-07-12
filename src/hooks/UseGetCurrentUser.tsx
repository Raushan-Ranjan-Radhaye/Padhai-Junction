
import { AppDispatch } from "@/redux/store";
import { setUser } from "@/redux/userSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

function UseGetCurrentUser() {
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const result = await axios.get("/api/user/currentUser");
        dispatch(setUser(result.data.user));
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 401) {
            console.log("No authenticated user found");
            dispatch(setUser(null));
          } else if (error.response?.status === 404) {
            console.log("API endpoint not found - this might be expected during development");
            dispatch(setUser(null));
          } else {
            console.error("Error fetching user:", error);
            dispatch(setUser(null));
          }
        } else {
          console.error("Error fetching user:", error);
          dispatch(setUser(null));
        }
      }
    };

    fetchUser();
  }, []);
}

export default UseGetCurrentUser;
