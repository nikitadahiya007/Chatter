import ScrollableFeed from "react-scrollable-feed";
import {
  isSameSender,
  isSameSenderMargin,
  isSameUser,
  lastMessage,
} from "./config/chatlogics";
import { ChatState } from "../context/ChatProvider";
import { Avatar } from "@chakra-ui/avatar";
import { Tooltip } from "@chakra-ui/react";
const ScrollableChat = ({ messages }) => {
  const { user, setSelectedChat, selectedChat } = ChatState();

  return (
    <ScrollableFeed>
      {messages &&
        messages.map((m, i) => (
          <div style={{ display: "flex" }} key={m._id}>
            {(isSameSender(messages, m, i, user._id) ||
              lastMessage(messages, i, user._id)) && (
              <Tooltip label={m.sender.name} placment="bottom-start" hasArrow>
                <Avatar
                  marginTop={"7px"}
                  marginRight={1}
                  cursor={"pointer"}
                  size={"sm"}
                  name={m.sender.name}
                  src={m.sender.dp}
                />
              </Tooltip>
            )}
            <span
              style={{
                backgroundColor: `${
                  m.sender._id === user._id ? "#D1F4CC" : "#FFFFFF"
                }`,
                borderRadius: "20px",
                padding: "5px 15px",
                maxWidth: "75%",
                marginLeft: isSameSenderMargin(messages, m, i, user._id),
                marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
              }}
            >
              {m.content}
            </span>
          </div>
        ))}
    </ScrollableFeed>
  );
};

export default ScrollableChat;
