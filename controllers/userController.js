const FriendService = require("../services/friendService");
exports.getMe = async (req, res) => {
  const user = JSON.parse(JSON.stringify(req.user));
  const friends = await FriendService.findAcceptedFriend(req.user.id);

  user.friends = friends;

  res.json(user);

  // res.json({ user: req.user, friends });
};
