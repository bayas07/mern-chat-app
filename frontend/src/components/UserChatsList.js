import React, { useEffect } from "react";
import { useChatState } from "../context/chatContext";
import { useToast, Box, Text, Button, Avatar } from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import ChatSkeleton from "./ChatSkeleton";
import { getSenderInfo } from "../utils/chatUtils";
import GroupModal from "./GroupModal";
import { useAxios } from "../customHooks/useAxios";

const UserChatsList = () => {
  const {
    chats,
    setChats,
    user,
    selectedChat,
    setSelectedChat,
    fetchChats,
    setFetchChats,
  } = useChatState();
  const toast = useToast();

  const {
    data: chatsData,
    loading,
    error,
    fetchData: fetchUsersData,
  } = useAxios("api/chat", []);

  useEffect(() => {
    if (error) {
      toast({
        title: "Unable to fetch the chats",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
    if (chatsData.length) {
      setChats(chatsData);
      setFetchChats(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error, chatsData]);

  useEffect(() => {
    fetchChats && fetchUsersData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        {!chats.length && loading ? (
          <ChatSkeleton />
        ) : (
          chats.map((chat) => {
            let sender = getSenderInfo(chat.users, user);
            return (
              <Box
                padding={2}
                marginBottom={3}
                backgroundColor={
                  chat._id === selectedChat?._id ? "#73D7FF" : "#F0F2F5"
                }
                cursor="pointer"
                borderRadius={5}
                onClick={() => setSelectedChat(chat)}
                display="flex"
                alignItems="center"
                gap="0 8px"
                key={chat._id}
              >
                <Avatar
                  size="sm"
                  name={sender.name}
                  src={
                    chat.isGroupChat ? chat.groupChatPicture : sender.picture
                  }
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
