import { AddIcon } from "@chakra-ui/icons";
import { Box, Stack, Text, useToast } from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { getSender } from "./config/chatlogics";
import ChatLoading from "./ChatLoading";
import GroupModel from "./extra/GroupModel";
import { Button } from "@chakra-ui/react";
import { ChatState } from "../context/ChatProvider";

const MyChats = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState();
  const { user, selectedChat, setSelectedChat, chats, setChats } = ChatState();
  const toast = useToast();

  const fetchChats = async () => {
    // console.log(user._id);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get("/api/chat", config);
      setChats(data);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the chats",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };
  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
  }, [fetchAgain]);

  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDirection={"column"}
      alignItems={"center"}
      p={3}
      bg={"#FFFFFF"}
      width={{ base: "100%", md: "31%" }}
      borderRadius={"lg"}
      borderWidth={"1px"}
    >
      <Box
        pb={3}
        pt={1}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        display={"flex"}
        bg={"#F0F2F5"}
        width={"100%"}
        justifyContent={"space-between"}
        alignContent={"center"}
        alignItems={"center"}
        borderRadius={"lg"}
        borderWidth={"1px"}
      >
        My Chats
        <GroupModel>
          <Button
            fontSize={{ base: "17px", md: "10px", lg: "17px" }}
            display={"flex"}
            rightIcon={<AddIcon />}
          >
            New Group Chat
          </Button>
        </GroupModel>
      </Box>

      <Box
        display={"flex"}
        flexDirection={"column"}
        p={3}
        bg={"#FFFFFF"}
        width={"100%"}
        overflowY={"hidden"}
        borderRadius={"lg"}
      >
        {chats ? (
          <Stack overflowY="scroll">
            {chats.map((chat) => (
              <>
                <Box
                  onClick={() => setSelectedChat(chat)}
                  cursor="pointer"
                  bg={selectedChat === chat ? "#F0F2F5" : "#FFFFFF"}
                  color={"#33444C"}
                  px={3}
                  py={2}
                  borderRadius="lg"
                  key={chat._id}
                >
                  <Text>
                    {!chat.isGroupChat
                      ? getSender(loggedUser, chat)
                      : chat.chatName}
                  </Text>
                </Box>
              </>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
};

export default MyChats;
