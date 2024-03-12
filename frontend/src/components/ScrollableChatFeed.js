import { Avatar, Box, Text } from "@chakra-ui/react";
import React from "react";
import ScrollableFeed from "react-scrollable-feed";
import { verifySameUser, isNewMsgFromSender } from "../utils/chatUtils";
import TypingIndicator from "./TypingIndicator";

const ScrollableChatFeed = ({ messages, user, isTyping }) => {
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
            key={message._id}
          >
            {isNewMsgFromSender(message, index, arr, user) && (
              <Avatar
                name={message.sender.name}
                size="sm"
                src={message.sender.picture}
              />
            )}
            <>
              <Box
                style={{
                  backgroundColor:
                    message.sender._id === user.id ? "#BEECF8" : "#B9F5D0",
                  borderRadius:
                    message.sender._id === user.id
                      ? "15px 0px 15px 15px"
                      : "0px 15px 15px 15px",
                  padding: "5px 15px",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {isNewMsgFromSender(message, index, arr, user) &&
                message.chat.isGroupChat &&
                message.sender._id !== user.id ? (
                  <Text as="span" fontSize="10px" color="darkred">
                    {message.sender.name}
                  </Text>
                ) : null}
                <Text as="span" fontSize="14px">
                  {message?.content}
                </Text>
              </Box>
            </>
          </Box>
        );
      })}
      {isTyping && <TypingIndicator />}
    </ScrollableFeed>
  );
};

export default ScrollableChatFeed;
