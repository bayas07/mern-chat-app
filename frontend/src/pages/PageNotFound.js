import { Box, Heading, Text } from "@chakra-ui/react";
import React from "react";
import { Link } from "react-router-dom";
import { ArrowBackIcon } from "@chakra-ui/icons";

const PageNotFound = () => {
  return (
    <Box
      marginTop={10}
      display="flex"
      alignItems="center"
      flexDirection="column"
      rowGap={3}
    >
      <Heading as="h2">Page Not Found</Heading>
      <Link to="/" style={{ color: "blue" }}>
        <>
          <ArrowBackIcon boxSize={4} />
          <Text fontSize="sm" paddingLeft={2} display="inline-block">
            Back to home page
          </Text>
        </>
      </Link>
    </Box>
  );
};

export default PageNotFound;
