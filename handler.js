import { ApolloServer } from 'apollo-server-lambda';
// deals with the problem of circular references
import depthLimit from 'graphql-depth-limit';
// import queryComplexity from 'graphql-query-complexity';
import { typeDefs } from './schema';
import { resolvers } from './resolvers';

const server = new ApolloServer({
  typeDefs,
  resolvers,
  // enables the request and function context to be passed to schema resolvers
  context: ({ event, context }) => ({
    headers: event.headers,
    functionName: context.functionName,
    event,
    context,
  }),
  validationRules: [
    // kind of arbitrary depth limit.. should think more about this
    // you can also specify fields to ignore
    // and get a map of the depths for each operation
    depthLimit(
      5,
      { ignore: [] },
      depths => console.log('Query depths: ' + depths)
    ),
    // queryComplexity({
    //   maximumComplexity: 2000,
    //   variables: {},
    //   onComplete: (complexity) => {
    //  info(`Determined query complexity: ${complexity}`)
    //  },
    //   createError: (max, actual) =>
    //     new GqlError(
    //      `Query is too complex: ${actual}. Max allowed complexity: ${max}`
    //     )
    // })
  ],
  formatError: error => {
    console.log(error);
    return error;
  },
  formatResponse: response => {
    console.log(response);
    return response;
  },
  playground: {
    endpoint: 'http://localhost:4000/dev/graphql',
    settings: {
      'schema.polling.interval': 60000,
    },
  },
});

exports.graphqlHandler = server.createHandler({
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});
