import {
  Box,
  Button,
  FormControl,
  IconButton,
  Input,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Spinner,
} from "@chakra-ui/react";
import { ChatState } from "../../context/ChatProvider";
import UserListItem from "../avtar/UserListItem";
import { ViewIcon } from "@chakra-ui/icons";
import UserBadge from "../avtar/UserBadge";
import axios from "axios";

const UpdateGroupChatModel = ({ fetchAgain, setFetchAgain, fetchMessages }) => {
  let timeoutId;
  let timeoutId2;
  const { user, setSelectedChat, selectedChat } = ChatState();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState();
  const [search, setSearch] = useState();
  const [searchResult, setSearchResult] = useState();
  const [loading, setLoading] = useState(false);
  const [renameLoading, setRenameLoading] = useState(false);
  const toast = useToast();
  const handleRemove = async (user1) => {
    if (selectedChat.groupAdmin._id !== user._id) {
      toast({
        title: "only admin can add users",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        "/api/chat/groupremove",
        {
          groupId: selectedChat._id,
          userId: user1._id,
        },
        config
      );
      user1._id === user._id ? setSelectedChat() : setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      fetchMessages();
      setLoading(false);
    } catch (error) {
      toast({
        title: "error occured while removing from group ",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };
  const handleRename = async () => {
    if (!groupChatName) return;
    try {
      setRenameLoading(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        "/api/chat/rename",
        {
          chatId: selectedChat._id,
          chatName: groupChatName,
        },
        config
      );
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setRenameLoading(false);
      toast({
        title: "Group Chat updated",
        status: "sucess",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    } catch (error) {
      toast({
        title: "failed to update chat",
        description: `${error.response.data}`,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
      setRenameLoading(false);
      setGroupChatName("");
    }
  };
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
  const handleAddUser = async (uuser) => {
    if (selectedChat.users.find((u) => u._id === uuser._id)) {
      toast({
        title: "user already in the group",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    if (selectedChat.groupAdmin._id !== user._id) {
      toast({
        title: "only admin can add users",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        "/api/chat/groupadd",
        {
          groupId: selectedChat._id,
          userId: uuser._id,
        },
        config
      );
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setLoading(false);
    } catch (error) {
      toast({
        title: "error occured while adding to group ",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };
  return (
    <>
      <IconButton
        display={{ base: "flex" }}
        icon={<ViewIcon />}
        onClick={onOpen}
      />
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{selectedChat.chatName}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box>
              {selectedChat.users.map((user1) => (
                <UserBadge
                  key={user1._id}
                  userr={user1}
                  handleFunction={() => handleRemove(user1)}
                />
              ))}
            </Box>
            <FormControl display={"flex"}>
              <Input
                placeholder="Chat Name"
                marginBottom={3}
                value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
              <Button isLoading={renameLoading} onClick={handleRename}>
                Update{" "}
              </Button>
            </FormControl>
            <FormControl>
              <Input
                placeholder="add users "
                marginBottom={1}
                onChange={(e) => handleSearch(e.target.value)}
              ></Input>
            </FormControl>
            {loading ? (
              <Spinner size={"lg"} />
            ) : (
              searchResult?.map((uuser) => (
                <UserListItem
                  key={uuser._id}
                  user={uuser}
                  handleFunction={() => handleAddUser(uuser)}
                />
              ))
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="red" mr={3} onClick={() => handleRemove(user)}>
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdateGroupChatModel;
