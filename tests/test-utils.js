import { ApolloServer } from 'apollo-server-lambda';
import { createTestClient } from 'apollo-server-testing';
import { typeDefs } from '../schema';
import { resolvers } from '../resolvers';
import { EResearchProjectAPI } from '../datasources/eresearch-project-api';


// create a test server using the real typeDefs, resolvers and datasources
// any of these can alternatively be mocked.
// See https://www.apollographql.com/docs/apollo-server/testing/mocking/
const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources: () => {
    return {
      eresAPI: new EResearchProjectAPI(),
    };
  },
  context: () => ({ }), // pass any context required, e.g. username
});

// can also return mutation, for mutation tests
export const { query } = createTestClient(server);
