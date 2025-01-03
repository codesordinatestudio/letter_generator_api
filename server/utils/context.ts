import dotenv from "dotenv";
import pkg from "@prisma/client";
import { createPubSub, YogaInitialContext } from "graphql-yoga";
//import { decryptData, verifyJWT } from "./validation";
//import { Employee } from "@helpers/graphql-types";
import { GraphQLError } from "graphql";

dotenv.config();
const { PrismaClient } = pkg;
const prisma = new PrismaClient();
const pubSub = createPubSub();
const allowedDomains = process.env.ALLOWED_DOMAINS?.split(",") || [];

const context = async (ctx: YogaInitialContext) => {
  const headers = ctx?.request?.headers;

  //check if the request  domain is allowed
  const origin = headers.get("origin");
  if (!allowedDomains.includes(origin)) throw new GraphQLError("Origin not allowed");

  //check if the request has  https header
  const isHttps = headers.get("x-forwarded-proto");
  //if (isHttps && isHttps !== 'https') throw new GraphQLError('Only HTTPS is allowed');

  let user = null;

  const cookie = await ctx?.request?.cookieStore?.get("agusto-services");
  const authorization = headers.get("authorization");

  if (cookie) {
    const token = decryptData(cookie.value);
    const { payload } = await verifyJWT(token);
    user = payload as any;
  }

  return { ...ctx, pubSub, prisma, user };
};

export type Context = Awaited<ReturnType<typeof context>>;
export default context;
