import React from "react";
import { Box, Text, Avatar } from "@chakra-ui/react";

const UserListItem = ({ userData, onItemClick }) => {
  return (
    <Box
      display="flex"
      cursor="pointer"
      onClick={onItemClick}
      padding={2}
      backgroundColor="#F0F2F5"
      _hover={{ backgroundColor: "#60C9CB" }}
      borderRadius={10}
      columnGap={3}
      alignItems="center"
      marginBottom={2}
    >
      <Avatar size="sm" name={userData.name} src={userData.picture} />
      <Box>
        <Text fontSize="sm">{userData.name}</Text>
        <Text fontSize="sm">{userData.email}</Text>
      </Box>
    </Box>
  );
};

export default UserListItem;
