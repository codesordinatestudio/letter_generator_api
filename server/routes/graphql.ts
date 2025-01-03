import context from "~/utils/context";
import { createSchema, createYoga } from "graphql-yoga";
import { useCookies } from "@whatwg-node/server-plugin-cookies";
import { mergeResolvers, mergeTypeDefs } from "@graphql-tools/merge";
import { LetterResolvers } from "~/modules/letter/letter.resolver";
import { LetterGql } from "~/modules/letter/letter.gql";

const schema = createSchema({
  typeDefs: mergeTypeDefs([LetterGql]),
  resolvers: mergeResolvers([LetterResolvers]),
});

const yoga = createYoga({
  schema,
  context,
  graphiql: true,
  graphqlEndpoint: "/graphql",
  plugins: [useCookies()],
});

export default defineEventHandler(async (event) => {
  event._handled = true;
  const { req, res } = event?.node;
  return await yoga(req, res);
});
