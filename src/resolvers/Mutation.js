const { hash, compare } = require("bcryptjs");
const { sign } = require("jsonwebtoken");
require("dotenv").config();

async function signUp(parent, args, context) {
  const password = await hash(args.password, 10);

  const user = await context.prisma.user.create({
    data: { ...args, password },
  });

  const token = sign(
    {
      userId: user.id,
    },
    process.env.APP_SECRET
  );

  return { token, user };
}

async function login(parent, args, context) {
  const user = await context.prisma.user.findUnique({
    where: { email: args.email },
  });

  if (!user) {
    throw new Error("ユーザーが存在しません");
  }

  const valid = await compare(args.password, user.password);

  if (!valid) {
    throw new Error("無効なパスワードです");
  }

  const token = sign(
    {
      userId: user.id,
    },
    process.env.APP_SECRET
  );

  return { token, user };
}

async function post(parent, args, context) {
  const { userId } = context;

  return await context.prisma.link.create({
    data: {
      url: args.url,
      description: args.description,
      postedBy: {
        connect: {
          id: userId,
        },
      },
    },
  });
}

module.exports = {
  signUp,
  login,
  post,
};
