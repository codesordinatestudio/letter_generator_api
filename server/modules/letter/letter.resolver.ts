import axios from "axios";
import { config } from "dotenv";
import { GraphQLError } from "graphql";

config();

const letterContext = ({ tone, relationship, scenario }: any) => {
  const context = [
    {
      role: "system",
      content:
        "You are a witty and creative letter generator specializing in short letters generation. Generate a unique, humorous letter based on the given parameters.",
    },
    {
      role: "user",
      content: `Generate a ${tone} letter for a ${relationship} scenario about ${scenario}. The letter should be concise and humorous while maintaining  the user's preferred tone, relationship, and scenario.witty, dramatic, and memorable. Make it between 30-50 words. it should 1 paragraph`,
    },
  ];
  return context;
};

const letterRequest = ({
  messages,
  max_tokens,
  temperature,
}: {
  messages: any;
  max_tokens: number;
  temperature: number;
}) => {
  const response = axios.post(
    process.env.GROQ_API_URL,
    {
      model: "llama3-8b-8192",
      messages,
      max_tokens,
      temperature,
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response;
};

const Letter = async (_: any, args: { input: any }) => {
  try {
    console.log(args.input);
    const { tone, relationship, scenario } = args.input;
    const messages = letterContext({ tone, relationship, scenario });
    const max_tokens = 100;
    const temperature = 0.8;

    const response = await letterRequest({ messages, max_tokens, temperature });
    return { message: response?.data?.choices[0]?.message?.content };
  } catch (error) {
    throw new GraphQLError("Unable to generate letter at this time.Please try again later.");
  }
};

export const LetterResolvers = {
  Query: { Letter },
};
