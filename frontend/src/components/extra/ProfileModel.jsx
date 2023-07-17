import { ViewIcon } from "@chakra-ui/icons";
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
  IconButton,
  Text,
  Image,
} from "@chakra-ui/react";

const ProfileModel = ({ user, children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <IconButton
          display={{ base: "flex" }}
          icon={<ViewIcon />}
          onClick={onOpen}
        />
      )}
      <Modal size={"lg"} isCentered isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent height={"410px"}>
          <ModalHeader
            fontSize={"40px"}
            display={"flex"}
            justifyContent={"center"}
          >
            {user.name}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            justifyContent={"space-between"}
            alignItems={"center"}
            display={"flex"}
            flexDirection={"column"}
          >
            <Image src={user.dp} boxSize={"150px"} borderRadius={"full"} />
            <Text fontSize={{ base: "28px", md: "30px" }}>
              Email: {user.email}
            </Text>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="green" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProfileModel;
