import React, { useEffect, useState } from "react";
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
  Text,
} from "@chakra-ui/react";
import { useChatState } from "../context/chatContext";
import GroupUserListItem from "./GroupUserListItem";
import { debounceFn } from "../utils";
import UserListItem from "./UserListItem";
import { useAxios } from "../customHooks/useAxios";
const GroupUpdateModal = ({ children }) => {
  const [chatName, setChatName] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isUserLeftGroup, setIsUserLeftGroup] = useState(false);
  const { selectedChat, user, setFetchChats, setSelectedChat } = useChatState();

  const {
    data: addUserData,
    error: addUserError,
    fetchData: addUser,
    loading: addUserLoading,
  } = useAxios({
    url: "api/chat/groupAdd",
    method: "put",
  });

  const {
    data: removeUserData,
    error: removeUserError,
    fetchData: removeUser,
  } = useAxios({
    url: "api/chat/groupRemove",
    method: "put",
  });

  const {
    data: renameGroupData,
    error: renameGroupError,
    fetchData: renameGroup,
    loading: isUpdateNameLoading,
  } = useAxios({
    url: "api/chat/renameGroup",
    method: "put",
    payload: { chatName, chatGroupId: selectedChat._id },
  });
  const {
    data: searchUserData,
    error: searchUserError,
    fetchData: searchUsers,
    loading: isUserListLoading,
  } = useAxios();

  const toast = useToast();
  const userIsGroupAdmin = selectedChat.groupAdmin._id === user.id;

  const handleNameChange = (event) => {
    setChatName(event.target.value);
  };
  const createdDate = new Date(selectedChat?.createdAt);
  const handleRemoveUser = (user) => {
    if (selectedChat?.users.length < 3) {
      const remove = window.confirm(
        `Atleast 2 members should be in a group. If you remove this user this group will be deleted.`
      );
      if (!remove) return;
      setIsUserLeftGroup(true);
    } else {
      const remove = window.confirm(
        `Would you like to remove ${user.name} from this group?`
      );
      if (!remove) return;
    }
    removeUser({
      headerPayload: { userId: user._id, chatGroupId: selectedChat._id },
    });
  };
  const handleLeaveGroup = () => {
    if (selectedChat?.users.length < 3) {
      const remove = window.confirm(
        `Atleast 2 members should be in a group. If you remove this user this group will be deleted.`
      );
      if (!remove) return;
    } else {
      const remove = window.confirm(`Would you like to leave from this group?`);
      if (!remove) return;
    }
    setIsUserLeftGroup(true);
    removeUser({
      headerPayload: { userId: user.id, chatGroupId: selectedChat._id },
    });
  };
  const handleAddUser = (newUser) => {
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
    addUser({
      headerPayload: { userId: newUser._id, chatGroupId: selectedChat._id },
    });
  };

  const handleUserInputChange = debounceFn(async (event) => {
    const query = event.target.value.trim();
    if (!query) {
      setSearchResults(null);
      return;
    }
    searchUsers({ apiUrl: `/api/user?search=${query}` });
  });

  const handleModalClose = () => {
    setChatName("");
    setSearchResults(null);
    onClose();
  };

  useEffect(() => {
    if (searchUserData) {
      setSearchResults(searchUserData);
    }
    if (searchUserError) {
      toast({
        title: "Unable to load results",
        description: searchUserError.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchUserData, searchUserError]);

  useEffect(() => {
    if (addUserData) {
      setSelectedChat(addUserData);
    }
    if (addUserError) {
      toast({
        title: "Error occured!",
        description: addUserError.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addUserData, addUserError]);

  useEffect(() => {
    if (removeUserData) {
      console.log({ removeUserData, isUserLeftGroup }, "** Obj");
      if (isUserLeftGroup) {
        setSelectedChat(null);
        setFetchChats(true);
        handleModalClose();
      } else {
        setSelectedChat(removeUserData);
      }
    }
    if (removeUserError) {
      toast({
        title: "Error occured!",
        description: removeUserError.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [removeUserData, removeUserError, isUserLeftGroup]);

  useEffect(() => {
    if (renameGroupData) {
      setFetchChats(true);
      setChatName("");
      setSelectedChat(renameGroupData);
    }
    if (renameGroupError) {
      toast({
        title: "Error Occured!!",
        description: renameGroupError.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [renameGroupData, renameGroupError]);
  return (
    <>
      {<Box onClick={onOpen}>{children}</Box>}
      <Modal isOpen={isOpen} onClose={handleModalClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Text fontSize="x-large">{selectedChat?.chatName}</Text>
            <Text fontSize="small" color="grey">
              Created on {createdDate?.toLocaleDateString("en-GB")}
            </Text>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box display="flex" flexWrap="wrap" gap={2} marginBottom={3}>
              {selectedChat.users.map((chatUser) => {
                if (
                  !(
                    chatUser._id === selectedChat.groupAdmin._id &&
                    chatUser._id === user.id
                  )
                ) {
                  return (
                    <GroupUserListItem
                      ariaLabel={`Click to remove ${chatUser?.name} from the group`}
                      user={chatUser}
                      key={chatUser._id}
                      elementAs={userIsGroupAdmin ? "button" : "div"}
                      hideCloseIcon={!userIsGroupAdmin}
                      handleClick={() => {
                        userIsGroupAdmin && handleRemoveUser(chatUser);
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
                onClick={() => renameGroup()}
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
                {isUserListLoading || addUserLoading ? (
                  <Spinner size="md" display="flex" margin="0 auto" />
                ) : (
                  <>
                    {searchResults?.length === 0 && (
                      <Text fontSize="md">No Users Found</Text>
                    )}
                    {searchResults?.slice(0, 4).map((user) => {
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
              onClick={handleLeaveGroup}
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
