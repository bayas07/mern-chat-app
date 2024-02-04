import { Avatar, Box } from "@chakra-ui/react";
import React from "react";
import ScrollableFeed from "react-scrollable-feed";
import { verifySameUser, hasPrevMsgFromSender } from "../utils/chatUtils";

const ScrollableChatFeed = ({ messages, user }) => {
  return (
    <ScrollableFeed className="message-feed scrollable-box">
      {messages.map((message, index, arr) => {
        return (
          <Box
            maxWidth="80%"
            alignSelf={
              message.sender._id === user.id ? "flex-end" : "flex-start"
            }
            display="flex"
            columnGap="5px"
            marginLeft={
              verifySameUser(message, index, arr, user) ? "37px" : "0px"
            }
          >
            {hasPrevMsgFromSender(message, index, arr, user) && (
              <Avatar
                name={message.sender.name}
                size="sm"
                src={message.sender.picture}
              />
            )}
            <span
              style={{
                backgroundColor:
                  message.sender._id === user.id ? "#BEECF8" : "#B9F5D0",
                borderRadius:
                  message.sender._id === user.id
                    ? "15px 0px 15px 15px"
                    : "0px 15px 15px 15px",
                fontSize: "14px",
                padding: "5px 15px",
              }}
            >
              {message?.content}
            </span>
          </Box>
        );
      })}
    </ScrollableFeed>
  );
};

export default ScrollableChatFeed;
