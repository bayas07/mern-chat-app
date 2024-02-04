export const getSender = (users, loggedInUser) => {
  return users[0]._id === loggedInUser.id ? users[1].name : users[0].name;
};

export const getSenderInfo = (users, loggedInUser) => {
  return users[0]._id === loggedInUser.id ? users[1] : users[0];
};

export const hasPrevMsgFromSender = (curMessage, index, messageArray, user) => {
  return (
    curMessage.sender._id !== user.id &&
    messageArray[index - 1]?.sender?._id !== curMessage.sender._id
  );
};
export const verifySameUser = (curMessage, index, messageArray, user) => {
  return (
    curMessage.sender._id !== user.id &&
    messageArray[index - 1]?.sender?._id === curMessage.sender._id
  );
};
