import {
  useDisclosure,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  FormControl,
  Input,
  Box,
  useToast,
  Spinner,
  Text,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useState } from "react";
import { useChatState } from "../context/chatContext";
import ChatUserListItem from "./ChatUserListItem";
import { CloseIcon } from "@chakra-ui/icons";

const debounceFn = (callbackFn) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      callbackFn(...args);
    }, 400);
  };
};

const GroupModal = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user, setChats, setSelectedChat } = useChatState();
  const toast = useToast();

  const [groupName, setGroupName] = useState("");
  const [loading, setIsloading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [isCreateGroupLoading, setIsCreateGroupLoading] = useState(false);

  const handleNameInputChange = (event) => {
    setGroupName(event.target.value);
  };
  const handleSearchUser = debounceFn(async (event) => {
    const query = event.target.value.trim();
    const headerConfig = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };
    try {
      if (!query) return;
      setIsloading(true);
      const response = await axios.get(
        `/api/user?search=${query}`,
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
  });

  const handleModalClose = () => {
    setGroupName("");
    setSelectedUsers([]);
  };

  const handleCreateChat = async () => {
    if (!groupName || !selectedUsers) {
      toast({
        title: "Error",
        description: "Please fill all the fields",
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
      setIsCreateGroupLoading(true);
      const users = selectedUsers.map((user) => user._id);
      const payload = { name: groupName, users };
      const { data } = await axios.post(
        "api/chat/createGroup",
        payload,
        headerConfig
      );
      setChats((chats) => [data, ...chats]);
      setSelectedChat(data);
      setIsCreateGroupLoading(false);
      handleModalClose();
      onClose();
    } catch (err) {
      console.log(err);
      setIsCreateGroupLoading(false);
      toast({
        title: "Unable to create group",
        description: err.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleSelectUser = (newUser) => {
    const isUserExist = selectedUsers.find((user) => user._id === newUser._id);
    if (isUserExist) {
      toast({
        title: "User Exists",
        description: "This user has already been added",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
    } else {
      setSelectedUsers((users) => [...users, newUser]);
    }
  };

  const handleRemoveUser = (userToRemove) => {
    setSelectedUsers((users) =>
      users.filter((user) => user._id !== userToRemove._id)
    );
  };

  return (
    <>
      <span onClick={onOpen}>{children}</span>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create Group Chat</ModalHeader>
          <ModalCloseButton onClick={handleModalClose} />
          <ModalBody>
            <FormControl>
              <Input
                name="group-name"
                type="text"
                size="sm"
                marginBottom={3}
                onChange={handleNameInputChange}
                placeholder="Enter name for the group"
                value={groupName}
              />
            </FormControl>
            <FormControl>
              <Input
                name="user-search"
                type="search"
                size="sm"
                marginBottom={3}
                placeholder="Search user Eg: bayas, suriya"
                onChange={handleSearchUser}
              />
            </FormControl>
            <Box display="flex" columnGap={2} marginBottom={3}>
              {selectedUsers.map((user) => {
                return (
                  <Box
                    cursor="pointer"
                    onClick={() => handleRemoveUser(user)}
                    backgroundColor="burlywood"
                    borderRadius={5}
                    padding="0 5px"
                  >
                    <Text fontSize="small">
                      {user.name}
                      <CloseIcon marginLeft={1} boxSize="8px" />
                    </Text>
                  </Box>
                );
              })}
            </Box>
            {loading ? (
              <Spinner size="sm" display="block" margin="0 auto" />
            ) : (
              <>
                {searchResults.slice(0, 3).map((user) => {
                  return (
                    <ChatUserListItem
                      key={user.id}
                      userData={user}
                      onItemClick={() => handleSelectUser(user)}
                    />
                  );
                })}
              </>
            )}
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="blue"
              size="sm"
              mr={3}
              onClick={handleCreateChat}
              isLoading={isCreateGroupLoading}
            >
              Create Chat
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GroupModal;
