import axios from "axios";
import { useState } from "react";
import { useChatState } from "../context/chatContext";

export const useAxios = ({
  url,
  sendToken = true,
  method = "get",
  payload = {},
} = {}) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setIsLoading] = useState(false);
  const { user } = useChatState();
  const authHeader = sendToken
    ? {
        Authorization: `Bearer ${user.token}`,
      }
    : {};
  async function fetchData({ headerPayload, apiUrl } = {}) {
    setIsLoading(true);
    axios({
      url: apiUrl || url,
      method: method || "get",
      data: headerPayload || payload,
      headers: authHeader,
    })
      .then((response) => {
        setData(response.data);
        return response;
      })
      .catch((err) => setError(err))
      .finally(() => setIsLoading(false));
  }
  return { data, loading, error, fetchData };
};
