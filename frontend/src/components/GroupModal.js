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
import UserListItem from "./UserListItem";
import GroupUserListItem from "./GroupUserListItem";
import { debounceFn } from "../utils";

const GroupModal = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user, setChats, setSelectedChat } = useChatState();
  const toast = useToast();

  const [groupName, setGroupName] = useState("");
  const [loading, setIsloading] = useState(false);
  const [searchResults, setSearchResults] = useState(null);
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
      const payload = {
        name: groupName,
        users,
        groupChatPicture:
          "https://img.freepik.com/free-vector/happy-young-people_24908-56802.jpg?w=826&t=st=1707985171~exp=1707985771~hmac=edb0aae5340f81d545328357fe278b334592b91d02a9f854f8fd74029a099665",
      };
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
            <Box display="flex" flexWrap="wrap" gap={2} marginBottom={3}>
              {selectedUsers.map((user) => {
                return (
                  <GroupUserListItem
                    user={user}
                    key={user._id}
                    onClick={handleRemoveUser}
                  />
                );
              })}
            </Box>
            {loading ? (
              <Spinner size="sm" display="block" margin="0 auto" />
            ) : (
              <>
                {searchResults?.length === 0 && (
                  <Text fontSize="md">No Users Found</Text>
                )}
                {searchResults?.slice(0, 3).map((user) => {
                  return (
                    <UserListItem
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
