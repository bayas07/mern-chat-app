import {
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
import { ArrowBackIcon, ViewIcon } from "@chakra-ui/icons";
import ProfileModal from "./ProfileModal";
import GroupUpdateModal from "./GroupUpdateModal";
import axios from "axios";
import ScrollableChatFeed from "./ScrollableChatFeed";
import io from "socket.io-client";

const END_POINT = "http://localhost:3000";
let socket;
let timeout;

const ChatBox = () => {
  const { selectedChat, user, setSelectedChat } = useChatState();
  const [message, setMessage] = useState("");
  const [isLoading, setIsloading] = useState(false);
  const [allMessages, setAllMessages] = useState([]);
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

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
      const headerConfig = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      try {
        setMessage("");
        const { data } = await axios.post(
          "api/message",
          { chatId: selectedChat._id, content: message },
          headerConfig
        );
        socket.emit("send-message", data);
        setAllMessages((messages) => [...messages, data]);
      } catch (err) {
        toast({
          title: "Error occured!",
          description: err.message,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    }
  };

  const fetchAllMessages = async () => {
    const headerConfig = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };
    try {
      setIsloading(true);
      const { data } = await axios.get(
        `api/message/${selectedChat._id}`,
        headerConfig
      );
      socket.emit("join-chat", selectedChat._id);
      setAllMessages(data);
      setIsloading(false);
    } catch (err) {
      setIsloading(false);
      toast({
        title: "Error occured!",
        description: err.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    socket = io(END_POINT);
    socket.emit("setup", user);
    socket.on("connect", () => setIsSocketConnected(true));
    socket.on("receive-message", (newMessage) => {
      setAllMessages((prevMessages) => [...prevMessages, newMessage]);
    });
    socket.on("typing", () => setIsTyping(true));
    socket.on("stopped-typing", () => setIsTyping(false));
  }, []);

  useEffect(() => {
    selectedChat && fetchAllMessages();
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
            padding={3}
            overflowY="hidden"
            display="flex"
          >
            {isLoading ? (
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
