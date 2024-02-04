import React from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useChatState } from "../context/chatContext";
import { Box, useDisclosure } from "@chakra-ui/react";
import Header from "../components/Header";
import SideDrawer from "../components/SideDrawer";
import ChatBox from "../components/ChatBox";
import MyChats from "../components/MyChats";

const Chat = () => {
  const { user } = useChatState();
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();

  if (!user) {
    return <Navigate to="/" replace={true} />;
  }
  const handleLogout = () => {
    window.localStorage.removeItem("userInfo");
    navigate("/", { replace: true });
  };
  return (
    <>
      <SideDrawer isOpen={isOpen} onClose={onClose} />
      <Header onDrawerOpen={onOpen} onLogout={handleLogout} />
      <Box display="flex" flexDirection="row" height="88vh" gap={3} margin={3}>
        <MyChats />
        <ChatBox onDrawerOpen={onOpen} />
      </Box>
    </>
  );
};

export default Chat;
