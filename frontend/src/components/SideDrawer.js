import React, { useEffect, useState } from "react";
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
  Text,
} from "@chakra-ui/react";
import ChatSkeleton from "../components/ChatSkeleton";
import UserListItem from "./UserListItem";
import { useChatState } from "../context/chatContext";
import { useAxios } from "../customHooks/useAxios";

const SideDrawer = ({ isOpen, onClose }) => {
  const toast = useToast();
  const { setSelectedChat, chats, setChats } = useChatState();
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const {
    data: searchData,
    error: searchError,
    fetchData: searchUser,
    loading,
  } = useAxios({
    url: `/api/user?search=${search}`,
  });
  const {
    data: chatData,
    error: chatError,
    fetchData: loadChats,
    loading: isChatLoading,
  } = useAxios({ url: "api/chat", method: "post" });

  const handleSearchInputChange = (event) => {
    setSearch(event.target.value.trim());
  };
  const handleKeyDown = (event) => {
    if (event.code === "Enter") {
      handleSearch();
    }
  };
  const handleSearch = async () => {
    setSearchResults(null);
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
    searchUser();
  };
  useEffect(() => {
    if (searchData) {
      setSearchResults(searchData);
    }
    if (searchError) {
      toast({
        title: "Unable to load results",
        description: searchError.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchData, searchError]);
  const accessChat = async (userToChat) => {
    loadChats({
      userId: userToChat._id,
    });
  };
  useEffect(() => {
    if (chatData) {
      if (!chats.find((chat) => chat._id === chatData?._id)) {
        setChats([...chats, chatData]);
      }
      onClose();
      setSelectedChat(chatData);
    }
    if (chatError) {
      toast({
        title: "Unable to fetch the chats",
        description: chatError.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatData, chatError]);
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
              onKeyDown={handleKeyDown}
            />
            <Button onClick={handleSearch}>Go</Button>
          </Box>
          {loading ? (
            <ChatSkeleton />
          ) : (
            <>
              {searchResults?.length === 0 && (
                <Text fontSize="md">No Users Found</Text>
              )}
              {searchResults?.map((user) => {
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
