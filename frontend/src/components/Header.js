import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Box,
  Button,
  Image,
  Text,
  Tooltip,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Avatar,
  MenuDivider,
} from "@chakra-ui/react";
import { BellIcon, SearchIcon, ChevronDownIcon } from "@chakra-ui/icons";
import ProfileModal from "../components/ProfileModal";
import { useChatState } from "../context/chatContext";
import { getSender } from "../utils/chatUtils";
import { removeDuplicateNotifications } from "../utils";

const Header = ({ onDrawerOpen, onLogout }) => {
  const { user, notifications, setSelectedChat, setNotifications } =
    useChatState();
  const [addAniClass, setAddAniClass] = useState(false);
  const notRef = useRef();
  const handleNotification = (msg) => {
    setSelectedChat(msg.chat);
    setNotifications((prevNot) =>
      prevNot.filter((notification) => notification.chat._id !== msg.chat._id)
    );
  };
  const filteredNotifications = useMemo(
    () => removeDuplicateNotifications(notifications),
    [notifications]
  );
  useEffect(() => {
    let timeRef;
    if (notifications.length > 0) {
      setAddAniClass(true);
      timeRef && clearTimeout(timeRef);
      timeRef = setTimeout(() => {
        setAddAniClass(false);
      }, 500);
    }
  }, [notifications]);

  return (
    <Box
      as="header"
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      backgroundColor="#ffffff"
      padding="0px 16px"
      height="60px"
    >
      {!user ? (
        <Box>
          <Image
            boxSize="45px"
            src="https://cryptologos.cc/logos/chatcoin-chat-logo.png"
            alt="chat logo"
          />{" "}
        </Box>
      ) : (
        <>
          <Box display="flex" columnGap={5} alignItems="center">
            <Image
              boxSize="45px"
              src="https://cryptologos.cc/logos/chatcoin-chat-logo.png"
              alt="chat logo"
            />
            <Tooltip label="Search users to chat">
              <Button variant="ghost" onClick={onDrawerOpen}>
                <SearchIcon boxSize={4} />
                <Text fontSize="sm" paddingLeft={2}>
                  Search users
                </Text>
              </Button>
            </Tooltip>
          </Box>
          <Box>
            <Menu>
              <MenuButton
                as={Button}
                aria-label="Notifications"
                variant="ghost"
                position="relative"
                ref={notRef}
                className={addAniClass ? "pop-up-animation" : ""}
              >
                <BellIcon boxSize={6} />
                <Text
                  as="span"
                  color="#FFFFFF"
                  fontSize="x-small"
                  position="absolute"
                  backgroundColor="red"
                  padding="1px 6px"
                  borderRadius={20}
                  right="12px"
                  top="4px"
                >
                  {notifications.length}
                </Text>
              </MenuButton>
              <MenuList padding={2}>
                {!notifications.length ? (
                  <Text fontSize="sm">No new messsages received</Text>
                ) : (
                  filteredNotifications.map((msg) => {
                    return (
                      <MenuItem
                        onClick={() => handleNotification(msg)}
                        justifyContent="space-between"
                        gap="0 5px"
                      >
                        <Text as="span">
                          {msg.chat.isGroupChat
                            ? `New Message in ${msg.chat.chatName}`
                            : `New Message from ${getSender(
                                msg.chat.users,
                                user
                              )}`}
                        </Text>
                        <Text
                          as="span"
                          color="#FFFFFF"
                          fontSize="x-small"
                          backgroundColor="red"
                          padding="1px 6px"
                          borderRadius="50%"
                        >
                          {msg.count}
                        </Text>
                      </MenuItem>
                    );
                  })
                )}
              </MenuList>
            </Menu>
            <Menu>
              <MenuButton
                as={Button}
                variant="ghost"
                rightIcon={<ChevronDownIcon />}
              >
                <Avatar size="sm" name={user.name} src={user.picture} />
              </MenuButton>
              <MenuList>
                <ProfileModal user={user}>
                  <MenuItem>My Profile</MenuItem>
                </ProfileModal>
                <MenuDivider />
                <MenuItem onClick={onLogout}>Logout</MenuItem>
              </MenuList>
            </Menu>
          </Box>
        </>
      )}
    </Box>
  );
};

export default Header;
