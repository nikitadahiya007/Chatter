import { CloseIcon } from "@chakra-ui/icons";
import { Badge } from "@chakra-ui/react";


const UserBadge = ({ userr, handleFunction }) => {
  return (
    <Badge
      paddingX={2}
      py={1}
      borderRadius={"lg"}
      m={1}
      mb={2}
      variant={"solid"}
      fontSize={"12px"}
      cursor={"pointer"}
      bg="#075E54"
      color={"#ffffff"}
      onClick={handleFunction}
    >
      {userr.name}
      <CloseIcon paddingLeft={1} />
    </Badge>
  );
};

export default UserBadge;
