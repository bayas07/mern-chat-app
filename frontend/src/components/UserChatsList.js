import React, { useCallback, useEffect } from "react";
import { useChatState } from "../context/chatContext";
import { useToast, Box, Text, Button, Avatar } from "@chakra-ui/react";
import axios from "axios";
import { AddIcon } from "@chakra-ui/icons";
import ChatSkeleton from "./ChatSkeleton";
import { getSenderInfo } from "../utils/chatUtils";
import GroupModal from "./GroupModal";

const UserChatsList = () => {
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

  const getNameAndLatestMsg = (chat) => {
    if (!chat.latestMessage) return "No new messages found";
    if (chat.isGroupChat) {
      if (chat.latestMessage.sender._id === user.id) {
        return `You: ${chat.latestMessage.content}`;
      } else {
        return `${chat.latestMessage.sender.name}: ${chat.latestMessage.content}`;
      }
    } else {
      if (chat.latestMessage.sender._id === user.id) {
        return `You: ${chat.latestMessage.content}`;
      } else {
        return chat.latestMessage.content;
      }
    }
  };
  const groupPicUrl =
    "https://img.freepik.com/free-vector/happy-young-people_24908-56802.jpg?w=826&t=st=1707985171~exp=1707985771~hmac=edb0aae5340f81d545328357fe278b334592b91d02a9f854f8fd74029a099665";
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
                  chat._id === selectedChat?._id ? "#55CEFF" : "#C7ECFF"
                }
                cursor="pointer"
                borderRadius={5}
                onClick={() => setSelectedChat(chat)}
                display="flex"
                alignItems="center"
                gap="0 8px"
              >
                <Avatar
                  size="sm"
                  name={sender.name}
                  src={chat.isGroupChat ? groupPicUrl : sender.picture}
                />
                <Box width="100%" overflow="hidden">
                  <Text fontFamily="poppins" fontSize="sm">
                    {!chat.isGroupChat ? sender.name : chat.chatName}
                  </Text>
                  <Text
                    fontSize="xs"
                    sx={{
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      width: "95%",
                      display: "inline-block",
                    }}
                  >
                    {getNameAndLatestMsg(chat)}
                  </Text>
                </Box>
              </Box>
            );
          })
        )}
      </Box>
    </Box>
  );
};

export default UserChatsList;
