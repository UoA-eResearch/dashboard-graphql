import { ApolloServer } from 'apollo-server-lambda';
import depthLimit from 'graphql-depth-limit';
import { createTestClient } from 'apollo-server-testing';
import { typeDefs } from './../../graphql/schema';
import { resolvers } from './../../graphql/resolvers';
import { AuthorizationDirective } from './../../graphql/directives';


export const constructTestServer = (dataSources, context) => {
  const validationRules = [depthLimit(5)];

  // returns a query object and a mutation object i.e. { query, mutation }
  // which can be used to perform queries or mutations against the test server
  return createTestClient(
    new ApolloServer({
      typeDefs,
      schemaDirectives: {
        authorization: AuthorizationDirective,
      },
      resolvers,
      dataSources,
      context,
      validationRules,
    })
  );
};
