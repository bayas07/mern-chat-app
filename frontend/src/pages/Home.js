import React from "react";
import {
  Box,
  Container,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  TabPanels,
} from "@chakra-ui/react";
import Login from "../components/Login";
import SignUp from "../components/SignUp";
import { Navigate } from "react-router-dom";
import Header from "../components/Header";

const Home = () => {
  const userInfo = window.localStorage.getItem("userInfo");
  if (userInfo) {
    return <Navigate to="/chat" replace={true} />;
  }
  return (
    <>
      <Header />
      <Container maxW="xl" marginTop={16} as="main">
        <Box backgroundColor="#ffffff" padding={6} borderRadius={10}>
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
    </>
  );
};

export default Home;
