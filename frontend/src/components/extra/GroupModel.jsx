import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  FormControl,
  Input,
} from "@chakra-ui/react";
import { Box } from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
import { ChatState } from "../../context/ChatProvider";
import axios from "axios";
import UserListItem from "../avtar/UserListItem";
import UserBadge from "../avtar/UserBadge";

const GroupModel = ({ children }) => {
  let timeoutId;
  let timeoutId2;
  const [groupChatName, setGroupChatName] = useState();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState();
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const { user, selectedChat, setSelectedChat, chats, setChats } = ChatState();

  const handleSearch = (query) => {
    setSearch(query);
    if (!query) {
      return;
    }
    setLoading(true);
    clearTimeout(timeoutId); // Clear the previous timeout

    timeoutId = setTimeout(async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
        const { data } = await axios.get(`/api/user?search=${query}`, config);
        setLoading(false);
        setSearchResult(data);
      } catch (error) {
        toast({
          title: "Error Occurred!",
          description: `${error}`,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom-left",
        });
      }
    }, 500); // Delay execution for 500 milliseconds (adjust as needed)
  };

  const handleSubmit = async () => {
    if (!groupChatName || !selectedUsers) {
      toast({
        title: "Please fill all the fields",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
    clearTimeout(timeoutId2);
    timeoutId2 = setTimeout(async () => {
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        const { data } = await axios.post(
          `/api/chat/group`,
          {
            name: groupChatName,
            users: JSON.stringify(selectedUsers.map((u) => u._id)),
          },
          config
        );
        setChats([data, ...chats]);
        onClose();
        toast({
          title: "Group Chat created",
          status: "sucess",
          duration: 5000,
          isClosable: true,
          position: "bottom-left",
        });
      } catch (error) {
        toast({
          title: "failed to create chat",
          description: `${error.response.data}`,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom-left",
        });
      }
    }, 500);
  };
  const handleDelete = (usertodel) => {
    setSelectedUsers(selectedUsers.filter((sel) => sel._id != usertodel._id));
  };
  const handleGroup = (userToAdd) => {
    if (selectedUsers.includes(userToAdd)) {
      toast({
        title: "User already added!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    setSelectedUsers([...selectedUsers, userToAdd]); // Spread the current array and add the new user
  };

  return (
    <>
      <span onClick={onOpen}>{children}</span>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontFamily={"35px"}
            display={"flex"}
            justifyContent={"center"}
          >
            Create Group Chat
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            display={"flex "}
            flexDirection={"column"}
            alignItems={"center"}
          >
            <FormControl>
              <Input
                placeholder="Chat Name"
                marginBottom={3}
                onChange={(e) => setGroupChatName(e.target.value)}
              ></Input>
            </FormControl>
            <FormControl>
              <Input
                placeholder="add users "
                marginBottom={1}
                onChange={(e) => handleSearch(e.target.value)}
              ></Input>
            </FormControl>
            <Box display={"flex"} width={"100%"} flexWrap={"wrap"}>
              {selectedUsers?.map((userr) => (
                <UserBadge
                  key={userr._id}
                  userr={userr}
                  handleFunction={() => handleDelete(userr)}
                />
              ))}
            </Box>
            {loading ? (
              <div>loading</div>
            ) : (
              searchResult
                ?.slice(0, 4)
                .map((uuser) => (
                  <UserListItem
                    key={uuser._id}
                    user={uuser}
                    handleFunction={() => handleGroup(uuser)}
                  />
                ))
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="green" onClick={handleSubmit}>
              Create Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GroupModel;
