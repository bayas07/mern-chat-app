import { Box, IconButton, Text } from "@chakra-ui/react";
import React from "react";
import { useChatState } from "../context/chatContext";
import { getSender, getSenderInfo } from "../utils/chatUtils";
import { ArrowBackIcon, ViewIcon } from "@chakra-ui/icons";
import ProfileModal from "./ProfileModal";
import GroupUpdateModal from "./GroupUpdateModal";

const ChatBox = () => {
  const { selectedChat, user, setSelectedChat } = useChatState();
  const handleBackToUsers = () => {
    setSelectedChat(null);
  };
  return (
    <Box
      backgroundColor="#ffffff"
      borderRadius={10}
      width={{ base: "100%", md: "66%" }}
      display={{ base: selectedChat ? "flex" : "none", md: "flex" }}
      flexDirection="column"
      padding={4}
      rowGap={3}
    >
      {!selectedChat ? (
        <Text fontSize="xl" margin="auto" textAlign="center" width="100%">
          Click any user to start chatting...
        </Text>
      ) : (
        <>
          <Box display="flex" justifyContent="space-between" width="100%">
            <IconButton
              icon={<ArrowBackIcon />}
              size="sm"
              display={{ base: "block", md: "none" }}
              onClick={handleBackToUsers}
            />
            <Text>
              {selectedChat.isGroupChat
                ? selectedChat.chatName
                : getSender(selectedChat.users, user)}
            </Text>
            {!selectedChat.isGroupChat ? (
              <ProfileModal user={getSenderInfo(selectedChat.users, user)}>
                <IconButton icon={<ViewIcon />} size="sm" />
              </ProfileModal>
            ) : (
              <GroupUpdateModal />
            )}
          </Box>
          <Box
            backgroundColor="lightgrey"
            width="100%"
            height="100%"
            borderRadius={10}
          ></Box>
        </>
      )}
    </Box>
  );
};

export default ChatBox;
