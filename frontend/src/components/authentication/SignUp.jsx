import { Button } from "@chakra-ui/react";
import { FormControl, FormLabel } from "@chakra-ui/react";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/react";
import { VStack } from "@chakra-ui/react";
import React, { useState } from "react";
import { useToast } from "@chakra-ui/react";
import axios from "axios";
import { useHistory } from "react-router-dom";

const SignUp = () => {
  const history = useHistory();
  const [showCP, setshowCP] = useState(false);
  const [showP, setshowP] = useState(false);
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();
  const [dp, setPic] = useState();
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const postDetail = (pics) => {
    setLoading(true);
    if (pics === undefined) {
      toast({
        title: "Please Select an Image!",
        status: "Warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    if (
      pics.type === "image/jpeg" ||
      pics.type === "image/jpg" ||
      pics.type === "image/png"
    ) {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "chat_app_diggle");
      data.append("cloud_name", "karannasa");
      fetch("https://api.cloudinary.com/v1_1/karannasa/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setPic(data.url.toString());
          // console.log(data.url.toString());
          setLoading(false);
        })
        .catch((err) => {
          // console.log(err);
          setLoading(false);
        });
    } else {
      toast({
        title: "Please Select an Image!",
        status: "Warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };
  const HandleSubmit = async () => {
    setLoading(true);
    if (!name || !email || !password || !confirmPassword) {
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
    if (password !== confirmPassword) {
      toast({
        title: "Passwords don't match",
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
        "/api/user",
        { name, email, password, dp },
        config
      );

      toast({
        title: "Registration Successful",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);
      history.push("/verify");
    } catch (error) {
      toast({
        title: "Error",
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
  const handleShowClickCP = () => {
    setshowCP(!showCP);
  };
  return (
    <VStack spacing={4}>
      <FormControl id="Name">
        <FormLabel></FormLabel>
        <Input placeholder=" Name" onChange={(e) => setName(e.target.value)} />
      </FormControl>
      <FormControl id="Email">
        <FormLabel></FormLabel>
        <Input
          placeholder=" Email"
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
          />

          <InputRightElement width="4.5rem" height="100%">
            <Button onClick={handleShowClickp}>
              {showP ? "HIDE" : "SHOW"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl id="ConfirmPassword">
        <FormLabel></FormLabel>
        <InputGroup>
          <Input
            type={showCP ? "text" : "password"}
            placeholder=" ConfirmPassword"
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <InputRightElement width="4.5rem" height="100%">
            <Button onClick={handleShowClickCP}>
              {showCP ? "HIDE" : "SHOW"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl id="Pic">
        <FormLabel></FormLabel>
        <Input
          placeholder="Upload image"
          type="file"
          accept="image/*"
          onChange={(e) => postDetail(e.target.files[0])}
        />
      </FormControl>
      <Button
        onClick={HandleSubmit}
        width="100%"
        colorScheme="green"
        isLoading={loading}
      >
        Sign Up
      </Button>
    </VStack>
  );
};

export default SignUp;
