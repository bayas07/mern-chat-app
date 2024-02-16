import React, { useState } from "react";
import {
  Box,
  Button,
  Drawer,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerBody,
  Input,
  Spinner,
  useToast,
} from "@chakra-ui/react";
import ChatSkeleton from "../components/ChatSkeleton";
import UserListItem from "./UserListItem";
import axios from "axios";
import { useChatState } from "../context/chatContext";

const SideDrawer = ({ isOpen, onClose }) => {
  const toast = useToast();
  const { setSelectedChat, user, chats, setChats } = useChatState();
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsloading] = useState(false);
  const [isChatLoading, setIsChatloading] = useState(false);

  const handleSearchInputChange = (event) => {
    setSearch(event.target.value.trim());
  };
  const handleSearch = async () => {
    setSearchResults([]);
    if (!search) {
      toast({
        description: "Please fill the search field",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
      return;
    }
    const headerConfig = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };
    try {
      setIsloading(true);
      const response = await axios.get(
        `/api/user?search=${search}`,
        headerConfig
      );
      setSearchResults(response.data);
      setIsloading(false);
    } catch (err) {
      setIsloading(false);
      toast({
        title: "Unable to load results",
        description: err.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };
  const accessChat = async (userToChat) => {
    const headerConfig = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };
    try {
      setIsChatloading(true);
      const { data } = await axios.post(
        "api/chat",
        {
          userId: userToChat._id,
        },
        headerConfig
      );
      if (!chats.find((chat) => chat._id === data?._id)) {
        setChats([...chats, data]);
      }
      setSelectedChat(data);
      setIsChatloading(false);
      onClose();
    } catch (err) {
      setIsChatloading(false);
      toast({
        title: "Unable to fetch the chats",
        description: err.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };
  return (
    <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>Search Users</DrawerHeader>
        <DrawerBody>
          <Box display="flex" columnGap={2} marginBottom={2}>
            <Input
              placeholder="Type name or email"
              onChange={handleSearchInputChange}
              value={search}
            />
            <Button onClick={handleSearch}>Go</Button>
          </Box>
          {isLoading ? (
            <ChatSkeleton />
          ) : (
            <>
              {searchResults.map((user) => {
                return (
                  <UserListItem
                    key={user.id}
                    userData={user}
                    onItemClick={() => accessChat(user)}
                  />
                );
              })}
            </>
          )}
          {isChatLoading && (
            <Spinner
              size="md"
              display="flex"
              justifyContent="center"
              margin="auto"
            />
          )}
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export default SideDrawer;
