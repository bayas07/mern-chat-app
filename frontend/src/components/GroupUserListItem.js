import { CloseIcon } from "@chakra-ui/icons";
import { Box, Text } from "@chakra-ui/react";
import React from "react";

const GroupUserListItem = ({ user, handleClick, hideCloseIcon = false }) => {
  return (
    <Box
      cursor="pointer"
      onClick={() => handleClick(user)}
      backgroundColor="slateblue"
      borderRadius={5}
      padding="2px 5px"
    >
      <Text fontSize="small" color="#ffffff">
        {user.name}
        {!hideCloseIcon && (
          <CloseIcon marginLeft={1} boxSize="8px" verticalAlign="baseline" />
        )}
      </Text>
    </Box>
  );
};

export default GroupUserListItem;
