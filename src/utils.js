import { sign } from "jsonwebtoken";
require("dotenv").config();

function getTokenPayload(token) {
  return sign.verify(token, process.env.APP_SECRET);
}

function getUserId(req, authToken) {
  if (req) {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const token = authHeader.replace("Bearer", "");

      if (!token) {
        throw new Error("トークンが見つかりませんでした");
      }

      const { userId } = getTokenPayload(token);
      return userId;
    }
  } else if (authToken) {
    const { userId } = getTokenPayload(token);
    return userId;
  } else {
    throw new Error("認証権限がありません");
  }
}

module.exports = {
  getUserId,
};
