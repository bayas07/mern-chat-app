import { Box, Text } from "@chakra-ui/react";
import React from "react";
import { useChatState } from "../context/chatContext";

const ChatBox = () => {
  const { selectedChat } = useChatState();
  return (
    <Box
      backgroundColor="#ffffff"
      borderRadius={10}
      width="66%"
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
    >
      <Text>Chats</Text>
    </Box>
  );
};

export default ChatBox;
