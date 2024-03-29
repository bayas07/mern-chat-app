import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [fetchChats, setFetchChats] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = JSON.parse(window.localStorage.getItem("userInfo"));
    if (userInfo) {
      setUser(userInfo);
    } else {
      setUser(null);
      navigate("/");
    }
  }, [navigate]);
  return (
    <ChatContext.Provider
      value={{
        user,
        chats,
        selectedChat,
        fetchChats,
        notifications,
        setUser,
        setChats,
        setSelectedChat,
        setFetchChats,
        setNotifications,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChatState = () => {
  return useContext(ChatContext);
};

export default ChatProvider;
