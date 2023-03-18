import { hash } from "bcryptjs";
import { sign } from "jsonwebtoken";

const APP_SECRET = "Graphql";

async function signUp(parent, args, context) {
  const password = hash(args.password, 10);

  const user = await context.prisma.user.create({
    ...args,
    password,
  });

  const token = sign({
    userId: user.id,
    APP_SECRET,
  });

  return { token, user };
}

async function login(parent, args, context) {
  const user = await context.prisma.user.findUnique({
    where: { email: args.email },
  });

  if (!user) {
    throw new Error("ユーザーが存在しません");
  }

  const valid = await bcrypt.compare(args.password, user.password);

  if (!valid) {
    throw new Error("無効なパスワードです");
  }

  const token = sign({
    userId: user.id,
    APP_SECRET,
  });

  return { token, user };
}
