import { Skeleton, Stack } from "@chakra-ui/react";
import React from "react";

const ChatSkeleton = () => {
  return (
    <Stack>
      <Skeleton height="40px" borderRadius={10} />
      <Skeleton height="40px" borderRadius={10} />
      <Skeleton height="40px" borderRadius={10} />
      <Skeleton height="40px" borderRadius={10} />
      <Skeleton height="40px" borderRadius={10} />
      <Skeleton height="40px" borderRadius={10} />
      <Skeleton height="40px" borderRadius={10} />
      <Skeleton height="40px" borderRadius={10} />
      <Skeleton height="40px" borderRadius={10} />
      <Skeleton height="40px" borderRadius={10} />
      <Skeleton height="40px" borderRadius={10} />
    </Stack>
  );
};

export default ChatSkeleton;
