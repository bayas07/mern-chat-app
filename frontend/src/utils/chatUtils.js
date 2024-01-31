export const getSender = (users, loggedInUser) => {
  return users[0]._id === loggedInUser.id ? users[1].name : users[0].name;
};

export const getSenderInfo = (users, loggedInUser) => {
  return users[0]._id === loggedInUser.id ? users[1] : users[0];
};
