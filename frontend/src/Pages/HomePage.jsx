import React, { useEffect } from "react";
import {
  Container,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import { Box, Text } from "@chakra-ui/layout";
import Login from "../components/authentication/Login";
import SignUp from "../components/authentication/SignUp";
import { useHistory } from "react-router-dom";
import axios from "axios";

const HomePage = () => {
  const history = useHistory();
  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (!userInfo) {
      history.push("/");
    }
    if (userInfo && userInfo.isVerified === false) {
      history.push("/verify");
      axios
        .post("/api/user/set-session-email", { email: userInfo.email })
        .then((response) => {
          if (response.status === 200) {
            history.push("/verify");
          } else {
            throw new Error("Failed to set session email");
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }
    if (userInfo && userInfo.isVerified === true) {
      history.push("/chats");
    }
  }, [history]);

  return (
    <Container maxW="xl" centerContent="true">
      <Box
        display="flex"
        justifyContent="center"
        p={3}
        bg={"white"}
        w="100%"
        m="40px 0 15px 0"
        borderRadius="lg"
        borderWidth="1px"
      >
        <Text fontSize="4xl" color="black" textAlign="center">
          Diggle
        </Text>
      </Box>
      <Box
        display="flex"
        justifyContent="center"
        p={3}
        bg={"white"}
        w="100%"
        borderRadius="lg"
        borderWidth="1px"
      >
        <Tabs variant="soft-rounded" colorScheme="green">
          <TabList mb="1em">
            <Tab width="50%">Login</Tab>
            <Tab width="50%">SignUp</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <SignUp />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
};

export default HomePage;
