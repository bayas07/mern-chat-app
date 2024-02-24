import axios from "axios";
import { useState } from "react";
import { useChatState } from "../context/chatContext";

export const useAxios = (url, defaultState = null, method, payload = {}) => {
  const [data, setData] = useState(defaultState);
  const [error, setError] = useState(null);
  const [loading, setIsLoading] = useState(false);
  const { user } = useChatState();
  async function fetchData() {
    setIsLoading(true);
    axios({
      url,
      method: method || "get",
      data: payload,
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
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
