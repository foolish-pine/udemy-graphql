const { ApolloServer, gql } = require("apollo-server");
const fs = require("fs");
const path = require("path");

// HackerNesの1つ1つの投稿
const links = [
  {
    id: "link-0",
    description: "descriptionテスト",
    url: "google.com",
  },
];

// リゾルバ関数
const resolvers = {
  Query: {
    info: () => "HackerNewsクローン",
    feed: () => links,
  },
  Mutation: {
    post: (parent, args) => {
      const id = links.length + 1;
      const link = {
        id: `link-${id}`,
        description: args.description,
        url: args.url,
      };

      links.push(link);
      return link;
    },
  },
};

const server = new ApolloServer({
  typeDefs: fs.readFileSync(path.join(__dirname, "schema.graphql"), "utf-8"),
  resolvers,
  csrfPrevention: true,
});

server.listen().then(({ url }) => console.log(`sever is ready at url: ${url}`));
