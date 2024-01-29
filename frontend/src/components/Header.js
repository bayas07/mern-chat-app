import React from "react";
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

const Header = ({ onDrawerOpen, onLogout }) => {
  const { user } = useChatState();
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
            <BellIcon boxSize={6} marginRight={3} cursor="pointer" />
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
