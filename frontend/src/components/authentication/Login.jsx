import { Button } from "@chakra-ui/button";
import { FormControl, FormLabel } from "@chakra-ui/react";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/react";
import { VStack } from "@chakra-ui/react";
import React, { useState } from "react";
import { useToast } from "@chakra-ui/react";
import axios from "axios";
import { useHistory } from "react-router-dom";

const Login = () => {
  const history = useHistory();
  const toast = useToast();
  const [showP, setshowP] = useState(false);
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [loading, setLoading] = useState(false);
  const HandleSubmit = async () => {
    setLoading(true);
    if (!email || !password) {
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
      const { data } = await axios.post(
        "/api/user/login",
        { email, password },
        config
      );

      toast({
        title: "Login Successful",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      localStorage.setItem("userInfo", JSON.stringify(data));
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
  const handleShowClickp = () => {
    setshowP(!showP);
  };
  return (
    <VStack spacing={4}>
      <FormControl id="Email">
        <FormLabel></FormLabel>
        <Input
          placeholder=" Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormControl>
      <FormControl id="Password">
        <FormLabel></FormLabel>
        <InputGroup>
          <Input
            type={showP ? "text" : "password"}
            placeholder=" Password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />

          <InputRightElement width="4.5rem" height="100%">
            <Button onClick={handleShowClickp}>
              {showP ? "HIDE" : "SHOW"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <Button
        isLoading={loading}
        onClick={HandleSubmit}
        width="100%"
        colorScheme="green"
      >
        Login
      </Button>
      {/* <Button
        onClick={() => {
          setEmail("guest@example.com");
          setPassword("123456");
        }}
        width="100%"
        variant="solid"
        colorScheme="red"
      >
        Get Guest User Credentials
      </Button> */}
    </VStack>
  );
};

export default Login;
