const { verify } = require("jsonwebtoken");
require("dotenv").config();

function getTokenPayload(token) {
  return verify(token, process.env.APP_SECRET);
}

function getUserId(req, authToken) {
  if (req) {
    const token = req.headers.authorization;

    if (!token) {
      throw new Error("トークンが見つかりませんでした");
    }

    const { userId } = getTokenPayload(token);
    return userId;
  } else if (authToken) {
    const { userId } = getTokenPayload(authToken);
    return userId;
  }

  throw new Error("認証権限がありません");
}

module.exports = {
  getUserId,
};
