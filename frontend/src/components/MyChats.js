import React, { useCallback, useEffect } from "react";
import { useChatState } from "../context/chatContext";
import { useToast, Box, Text, Button, Avatar } from "@chakra-ui/react";
import axios from "axios";
import { AddIcon } from "@chakra-ui/icons";
import ChatSkeleton from "./ChatSkeleton";
import { getSenderInfo } from "../utils/chatUtils";
import GroupModal from "./GroupModal";

const MyChats = () => {
  const {
    setChats,
    user,
    selectedChat,
    setSelectedChat,
    chats,
    fetchChats,
    setFetchChats,
  } = useChatState();
  const toast = useToast();

  const fetchAllChats = useCallback(async () => {
    const headerConfig = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };
    try {
      const { data } = await axios.get("api/chat", headerConfig);
      setChats(data);
    } catch (err) {
      toast({
        title: "Unable to fetch the chats",
        description: err.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
    setFetchChats(false);
  }, []);

  useEffect(() => {
    fetchChats && fetchAllChats();
  }, [fetchChats]);
  return (
    <Box
      width={{ base: "100%", md: "33%" }}
      borderRadius={10}
      backgroundColor="#ffffff"
      padding={4}
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      rowGap={3}
    >
      <Box display="flex" width="100%" justifyContent="space-between">
        <Text fontSize="xl">My Chats</Text>
        <GroupModal>
          <Button size="sm" leftIcon={<AddIcon />}>
            Create Group Chat
          </Button>
        </GroupModal>
      </Box>
      <Box height="100%" overflowY="scroll" className="scrollable-box">
        {!chats.length ? (
          <ChatSkeleton />
        ) : (
          chats.map((chat) => {
            let sender = getSenderInfo(chat.users, user);
            return (
              <Box
                padding={2}
                marginBottom={3}
                backgroundColor={
                  chat._id === selectedChat?._id ? "#60C9CB" : "#D3D3D3"
                }
                cursor="pointer"
                borderRadius={5}
                onClick={() => setSelectedChat(chat)}
                display="flex"
                alignItems="center"
                gap="0 8px"
              >
                <Avatar size="sm" name={sender.name} src={sender.picture} />
                <Text fontFamily="poppins" fontSize="sm">
                  {!chat.isGroupChat ? sender.name : chat.chatName}
                </Text>
              </Box>
            );
          })
        )}
      </Box>
    </Box>
  );
};

export default MyChats;
