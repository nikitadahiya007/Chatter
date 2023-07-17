import React, { useEffect, useState } from "react";
import { useToast } from "@chakra-ui/react";
import axios from "axios";
import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Input,
  VStack,
  HStack,
} from "@chakra-ui/react";
import { useHistory } from "react-router";

const EmailVerify = () => {
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
  const toast = useToast();
  const [otp, setOtp] = useState();
  const [loading, setLoading] = useState(false);
  // useEffect(() => {
  //   const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  //   if (!userInfo) {
  //     history.push("/");
  //   }
  //   if (userInfo.isVerified === true) {
  //     history.push("/chats");
  //   }
  // }, []);

  const HandleSubmit = async () => {
    setLoading(true);
    if (!otp) {
      toast({
        title: "Please Fill all the Fields!",
        status: "Warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }
    try {
      const config = {
        headers: {
          "content-type": "application/json",
        },
      };
      const { data } = await axios.put(
        "/api/user/verifyemail",
        { otp },
        config
      );
      console.log(data);
      localStorage.setItem("userInfo", JSON.stringify(data));
      toast({
        title: "verififation Successful",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      history.push("/chats");
    } catch (error) {
      toast({
        title: "Error occured",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };
  return (
    <Container maxW="xl" centerContent="true">
      <Box
        display="flex"
        justifyContent="center"
        p={3}
        bg={"white"}
        w="100%"
        m="auto"
        borderRadius="lg"
        borderWidth="1px"
      >
        <VStack spacing={4}>
          <FormControl id="Name">
            <FormLabel>Enter the verification OTP sent to your mail</FormLabel>
            <Input
              type={"password"}
              placeholder="Enter the OTP"
              onChange={(e) => setOtp(e.target.value)}
              value={otp}
            />
          </FormControl>

          <Button
            isLoading={loading}
            onClick={HandleSubmit}
            width="100%"
            colorScheme="green"
          >
            verify
          </Button>
        </VStack>
      </Box>
    </Container>
  );
};

export default EmailVerify;
