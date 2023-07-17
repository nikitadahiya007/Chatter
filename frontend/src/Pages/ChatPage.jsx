import { Box } from "@chakra-ui/layout";
// import { useState } from "react";
import ChatBox from "../components/ChatBox";
import MyChats from "../components/MyChats";
import SideDrawer from "../components/extra/SideDrawer";
import { ChatState } from "../context/ChatProvider";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";

const ChatPage = () => {
  const history = useHistory();
  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (!userInfo) {
      history.push("/");
    }
    if (userInfo && userInfo.isVerified === true) {
      history.push("/chats");
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

  const { user } = ChatState();

  const [fetchAgain, setFetchAgain] = useState(false);
  return (
    <div style={{ width: "100%" }}>
      {user && <SideDrawer />}
      <Box
        display="flex"
        justifyContent="space-between"
        padding="10px"
        width="100%"
        height="91.5vh"
      >
        {user && <MyChats fetchAgain={fetchAgain} />}
        {user && (
          <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        )}
      </Box>
    </div>
  );
};

export default ChatPage;
