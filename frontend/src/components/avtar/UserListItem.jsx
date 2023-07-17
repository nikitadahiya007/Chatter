import { Avatar } from "@chakra-ui/avatar";
import { Box, Text } from "@chakra-ui/react";

const UserListItem = ({ user, handleFunction }) => {
  return (
    <Box
      onClick={handleFunction}
      cursor={"pointer"}
      bg={"#FFFFFF"}
      width={"100%"}
      display={"flex"}
      alignItems={"center"}
      color={"#111B21"}
      paddingX={3}
      paddingY={2}
      marginBottom={2}
      border
      borderRadius={"lg"}
      _hover={{
        bg: "#F0F2F5",
        color: "#018069",
      }}
    >
      <Avatar
        mr={2}
        size="sm"
        cursor="pointer"
        name={user.name}
        src={user.pic}
      />
      <Box>
        <Text>{user.name}</Text>
        <Text fontSize="xs">
          <b>Email : </b>
          {user.email}
        </Text>
      </Box>
    </Box>
  );
};

export default UserListItem;
