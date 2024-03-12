import { CloseIcon } from "@chakra-ui/icons";
import { Box, Text } from "@chakra-ui/react";
import React from "react";

const GroupUserListItem = ({
  ariaLabel,
  user,
  handleClick,
  hideCloseIcon = false,
  elementAs = "div",
}) => {
  return (
    <Box
      aria-label={elementAs === "button" && ariaLabel}
      onClick={() => handleClick(user)}
      backgroundColor="slateblue"
      borderRadius={5}
      padding="2px 5px"
      as={elementAs}
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
