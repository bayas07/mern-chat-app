import React, { useState } from "react";
import {
  Modal,
  useDisclosure,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Box,
  ModalFooter,
  Button,
  FormControl,
  Input,
  useToast,
  Spinner,
} from "@chakra-ui/react";
import { useChatState } from "../context/chatContext";
import GroupUserListItem from "./GroupUserListItem";
import axios from "axios";
import { debounceFn } from "../utils";
import UserListItem from "./UserListItem";
const GroupUpdateModal = ({ children }) => {
  const [isUserListLoading, setIsUserListloading] = useState(false);
  const [isUpdateNameLoading, setIsUpdateNameloading] = useState(false);
  const [chatName, setChatName] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const { selectedChat, user, setFetchChats, setSelectedChat } = useChatState();
  const headerConfig = {
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
  };
  const toast = useToast();
  const userIsGroupAdmin = selectedChat.groupAdmin._id === user.id;

  const handleNameChange = (event) => {
    setChatName(event.target.value);
  };
  const handleRemoveUser = async (removeUser) => {
    const remove = window.confirm(
      `Would you like to remove ${removeUser.name} from this group?`
    );
    if (!remove) return;
    try {
      const { data } = await axios.put(
        "api/chat/groupRemove",
        { userId: removeUser._id, chatGroupId: selectedChat._id },
        headerConfig
      );
      setSelectedChat(data);
      setFetchChats(true);
    } catch (err) {
      toast({
        title: "Error occured!",
        description: err.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };
  const handleAddUser = async (newUser) => {
    if (selectedChat.users.find((user) => user._id === newUser._id)) {
      toast({
        title: "User Exist",
        description: "User already added to the group",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    try {
      setIsUserListloading(true);
      const { data } = await axios.put(
        "api/chat/groupAdd",
        { userId: newUser._id, chatGroupId: selectedChat._id },
        headerConfig
      );
      setSelectedChat(data);
      setFetchChats(true);
      setIsUserListloading(false);
    } catch (err) {
      setIsUserListloading(false);
      toast({
        title: "Error occured!",
        description: err.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };
  const handleUserInputChange = debounceFn(async (event) => {
    const query = event.target.value.trim();
    if (!query) {
      setSearchResults([]);
      return;
    }
    try {
      setIsUserListloading(true);
      const response = await axios.get(
        `/api/user?search=${query}`,
        headerConfig
      );
      setSearchResults(response.data);
      setIsUserListloading(false);
    } catch (err) {
      setIsUserListloading(false);
      toast({
        title: "Unable to load results",
        description: err.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  });
  const handleUpdateGroupName = async () => {
    try {
      setIsUpdateNameloading(true);
      const { data } = await axios.put(
        `api/chat/renameGroup`,
        { chatName, chatGroupId: selectedChat._id },
        headerConfig
      );
      setSelectedChat(data);
      setChatName("");
      setIsUpdateNameloading(false);
      setFetchChats(true);
    } catch (err) {
      setIsUpdateNameloading(false);
      toast({
        title: "Error Occured!!",
        description: err.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };
  const handleModalClose = () => {
    setChatName("");
    setSearchResults([]);
    onClose();
  };
  return (
    <>
      {<Box onClick={onOpen}>{children}</Box>}
      <Modal isOpen={isOpen} onClose={handleModalClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{selectedChat?.chatName}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box display="flex" flexWrap="wrap" gap={2} marginBottom={3}>
              {selectedChat.users.map((user) => {
                if (user._id !== selectedChat.groupAdmin._id) {
                  return (
                    <GroupUserListItem
                      user={user}
                      key={user._id}
                      hideCloseIcon={!userIsGroupAdmin}
                      handleClick={() => {
                        handleRemoveUser(user);
                      }}
                    />
                  );
                }
                return null;
              })}
            </Box>
            <FormControl display="flex" columnGap={2} marginBottom={3}>
              <Input
                type="text"
                size="md"
                onChange={handleNameChange}
                id="group-name"
                placeholder="Enter a new group name"
                value={chatName}
              />
              <Button
                backgroundColor="#60C9CB"
                size="md"
                onClick={handleUpdateGroupName}
                isLoading={isUpdateNameLoading}
              >
                Update
              </Button>
            </FormControl>
            {userIsGroupAdmin && (
              <>
                <FormControl marginBottom={3}>
                  <Input
                    type="text"
                    size="md"
                    onChange={handleUserInputChange}
                    id="group-name"
                    placeholder="Search user to add into the group"
                  />
                </FormControl>
                {isUserListLoading ? (
                  <Spinner size="md" display="flex" margin="0 auto" />
                ) : (
                  <>
                    {searchResults.slice(0, 4).map((user) => {
                      return (
                        <UserListItem
                          key={user.id}
                          userData={user}
                          onItemClick={() => handleAddUser(user)}
                        />
                      );
                    })}
                  </>
                )}
              </>
            )}
          </ModalBody>
          <ModalFooter>
            <Button
              color="#ffffff"
              backgroundColor="tomato"
              mr={3}
              onClick={handleModalClose}
              variant="ghost"
              _hover={{ color: "#000000", backgroundColor: "#EDF2F7" }}
            >
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GroupUpdateModal;
