import { ApolloServer, makeExecutableSchema } from 'apollo-server-lambda';
import depthLimit from 'graphql-depth-limit';
import { createTestClient } from 'apollo-server-testing';
import { typeDefs } from './../../graphql/schema';
import { resolvers } from './../../graphql/resolvers';
import { permissions } from './../../graphql/permissions';
import { applyMiddleware } from 'graphql-middleware';


export const constructTestServer = (dataSources, context) => {
  // make schema, and apply permissions middleware
  const schema = applyMiddleware(
    makeExecutableSchema({
      typeDefs,
      resolvers,
    }),
    permissions
  );

  const validationRules = [depthLimit(5)];

  // returns a query object and a mutation object i.e. { query, mutation }
  // which can be used to perform queries or mutations against the test server
  return createTestClient(
    new ApolloServer({
      schema,
      dataSources,
      context,
      validationRules,
    })
  );
};
