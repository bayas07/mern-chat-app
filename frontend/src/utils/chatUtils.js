export const getSender = (users, loggedInUser) => {
  return users[0]._id === loggedInUser.id ? users[1].name : users[0].name;
};
