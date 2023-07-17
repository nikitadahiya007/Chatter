export const getSender = (loggedUser, chat) => {
  if (!loggedUser || !chat) {
    return null; // Handle the case when loggedUser or chat is undefined
  }

  if (!chat.users || chat.users.length < 2) {
    return chat.ChatName;
  }

  const firstUser = chat.users[0];
  const secondUser = chat.users[1];

  if (!firstUser || !secondUser) {
    return null; // Handle the case when firstUser or secondUser is undefined
  }

  return firstUser._id === loggedUser._id ? secondUser.name : firstUser.name;
};

export const getSenderFull = (loggedUser, chat) => {
  const data = chat;

  // console.log(data);
  if (!chat.users || chat.users.length < 2) {
    return;
  }

  return chat.users[0]._id === loggedUser._id ? chat.users[1] : chat.users[0];
};

export const isSameSender = (messages, m, i, userId) => {
  return (
    i < messages.length - 1 &&
    (messages[i + 1].sender._id !== m.sender._id ||
      messages[i + 1].sender._id === undefined) &&
    messages[i].sender._id !== userId
  );
};

export const lastMessage = (messages, i, userId) => {
  return (
    i === messages.length - 1 &&
    messages[messages.length - 1].sender._id !== userId &&
    messages[messages.length - 1].sender._id
  );
};

export const isSameSenderMargin = (messages, m, i, userId) => {
  // console.log(i === messages.length - 1);

  if (
    i < messages.length - 1 &&
    messages[i + 1].sender._id === m.sender._id &&
    messages[i].sender._id !== userId
  )
    return 33;
  else if (
    (i < messages.length - 1 &&
      messages[i + 1].sender._id !== m.sender._id &&
      messages[i].sender._id !== userId) ||
    (i === messages.length - 1 && messages[i].sender._id !== userId)
  )
    return 0;
  else return "auto";
};
export const isSameUser = (messages, m, i) => {
  return i > 0 && messages[i - 1].sender._id === m.sender._id;
};
