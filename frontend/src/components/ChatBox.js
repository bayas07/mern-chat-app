import {
  Avatar,
  Box,
  FormControl,
  IconButton,
  Input,
  Spinner,
  Text,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useChatState } from "../context/chatContext";
import { getSender, getSenderInfo } from "../utils/chatUtils";
import { ArrowBackIcon } from "@chakra-ui/icons";
import ProfileModal from "./ProfileModal";
import GroupUpdateModal from "./GroupUpdateModal";
import ScrollableChatFeed from "./ScrollableChatFeed";
import io from "socket.io-client";
import { useAxios } from "../customHooks/useAxios";

const END_POINT = "http://localhost:3000";
let socket;
let timeout;
let compareChat;

const ChatBox = () => {
  const {
    selectedChat,
    user,
    setSelectedChat,
    setNotifications,
    setFetchChats,
  } = useChatState();
  const [message, setMessage] = useState("");
  const [allMessages, setAllMessages] = useState([]);
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const {
    data: messageData,
    error: messageError,
    fetchData: fetchAllMessages,
    loading,
  } = useAxios({ url: `api/message/${selectedChat?._id}` });
  const {
    data: sendMessageData = {},
    error: sendMessageError,
    fetchData: sendMessage,
  } = useAxios({
    url: `api/message`,
    method: "post",
    payload: {
      chatId: selectedChat?._id,
      content: message,
    },
  });

  const toast = useToast();

  const handleBackToUsers = () => {
    setSelectedChat(null);
  };

  const handleMessage = (event) => {
    setMessage(event.target.value);
    if (!isSocketConnected) return;
    !isTyping && socket.emit("typing", selectedChat._id);
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      socket.emit("stopped-typing", selectedChat._id);
    }, 2000);
  };

  const handleSendMessage = async (event) => {
    if (event.key === "Enter") {
      socket.emit("stopped-typing", selectedChat._id);
      if (!message.trim()) {
        toast({
          title: "Error occured!",
          description: "Please enter something to send",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        return;
      }
      setMessage("");
      sendMessage();
    }
  };

  useEffect(() => {
    if (sendMessageData && Object.entries(sendMessageData).length) {
      socket.emit("send-message", sendMessageData);
      setFetchChats(true);
      setAllMessages((messages) => [...messages, sendMessageData]);
    }
    if (sendMessageError) {
      toast({
        title: "Error occured!",
        description: sendMessageError.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket, sendMessageData, sendMessageError]);

  useEffect(() => {
    if (messageData?.length) {
      setAllMessages(messageData);
      socket.emit("join-chat", selectedChat._id);
    }
    if (messageError) {
      toast({
        title: "Error occured!",
        description: messageError.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket, messageData, messageError, selectedChat]);

  useEffect(() => {
    socket = io(END_POINT);
    socket.emit("setup", user);
    socket.on("connect", () => setIsSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stopped-typing", () => setIsTyping(false));
    socket.on("receive-message", (newMessage) => {
      setFetchChats(true);
      if (!compareChat || compareChat?._id !== newMessage?.chat?._id) {
        setNotifications((prevData) => [newMessage, ...prevData]);
      }
      compareChat &&
        setAllMessages((prevMessages) => [newMessage, ...prevMessages]);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    selectedChat && fetchAllMessages();
    compareChat = selectedChat;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedChat]);

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
          <Box display="flex" columnGap={4} width="100%">
            <IconButton
              icon={<ArrowBackIcon />}
              size="sm"
              display={{ base: "block", md: "none" }}
              onClick={handleBackToUsers}
            />
            {!selectedChat.isGroupChat ? (
              <ProfileModal user={getSenderInfo(selectedChat.users, user)}>
                <Box
                  display="flex"
                  alignItems="center"
                  gap="0 10px"
                  cursor="pointer"
                >
                  <Avatar
                    size="sm"
                    name={getSenderInfo(selectedChat.users, user).name}
                    src={getSenderInfo(selectedChat.users, user).picture}
                  />
                  <Text>{getSender(selectedChat.users, user)}</Text>
                </Box>
              </ProfileModal>
            ) : (
              <GroupUpdateModal>
                <Box
                  display="flex"
                  alignItems="center"
                  gap="0 10px"
                  cursor="pointer"
                >
                  <Avatar
                    size="sm"
                    name={selectedChat.chatName}
                    src={selectedChat?.groupChatPicture}
                  />
                  <Text>{selectedChat.chatName}</Text>
                </Box>
              </GroupUpdateModal>
            )}
          </Box>
          <Box
            backgroundColor="lightgrey"
            width="100%"
            height="100%"
            borderRadius={10}
            padding={3}
            overflowY="hidden"
            display="flex"
          >
            {loading ? (
              <Spinner margin="0 auto" size="lg" alignSelf="center" />
            ) : (
              <ScrollableChatFeed
                messages={allMessages}
                user={user}
                isTyping={isTyping}
              />
            )}
          </Box>
          <FormControl>
            <Input
              type="text"
              onChange={handleMessage}
              placeholder="Type something..."
              onKeyDown={handleSendMessage}
              value={message}
            />
          </FormControl>
        </>
      )}
    </Box>
  );
};

export default ChatBox;
