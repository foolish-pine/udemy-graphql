const { ApolloServer, gql } = require("apollo-server");
const fs = require("fs");
const path = require("path");

const { PrismaClient } = require("@prisma/client");
const { getUserId } = require("./utils");

const prisma = new PrismaClient();

// リゾルバ関数
const resolvers = {
  Query: {
    info: () => "HackerNewsクローン",
    feed: async (parent, args, context) => {
      return context.prisma.link.findMany();
    },
  },
  Mutation: {
    post: (parent, args, context) => {
      const newLink = context.prisma.link.create({
        data: {
          description: args.description,
          url: args.url,
        },
      });

      return newLink;
    },
  },
};

const server = new ApolloServer({
  typeDefs: fs.readFileSync(path.join(__dirname, "schema.graphql"), "utf-8"),
  resolvers,
  context: ({ req }) => {
    return {
      ...req,
      prisma,
      userId: req && req.headers.authorization ? getUserId(req) : null,
    };
  },
  csrfPrevention: true,
});

server.listen().then(({ url }) => console.log(`sever is ready at url: ${url}`));
