import React from "react";
import {
  Box,
  Container,
  Heading,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  TabPanels,
} from "@chakra-ui/react";
import Login from "../components/Login";
import SignUp from "../components/SignUp";

const Home = () => {
  return (
    <Container maxW="xl">
      <Box
        display="flex"
        justifyContent="center"
        backgroundColor="#ffffff"
        padding={2.5}
        marginTop={5}
        borderRadius={10}
      >
        <Heading as="h1" fontFamily="poppins" size="xl">
          Welcome to chat app
        </Heading>
      </Box>
      <Box
        marginTop={6}
        backgroundColor="#ffffff"
        padding={5}
        borderRadius={10}
      >
        <Tabs variant="soft-rounded" colorScheme="blue">
          <TabList>
            <Tab flex={1}>Login</Tab>
            <Tab flex={1}>SignUp</Tab>
          </TabList>
          <TabPanels>
            <TabPanel padding={0} marginTop={5}>
              <Login />
            </TabPanel>
            <TabPanel padding={0} marginTop={5}>
              <SignUp />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
};

export default Home;
