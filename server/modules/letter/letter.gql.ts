import { gql } from "graphql-request";

export const LetterGql = gql`
  type Letter {
    message: String!
  }

  input LetterInput {
    tone: String
    relationship: String!
    scenario: String!
  }

  type Query {
    Letter(input: LetterInput!): Letter
  }
`;
