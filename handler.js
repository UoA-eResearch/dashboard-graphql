import { ApolloServer } from 'apollo-server-lambda';
import depthLimit from 'graphql-depth-limit'; // deals with the problem of circular references
//import queryComplexity from 'graphql-query-complexity';
import { typeDefs } from './schema';
import { resolvers } from './resolvers';

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ event, context }) => ({   //enables the request and function context etc to be passed to schema resolvers
    headers: event.headers,
    functionName: context.functionName,
    event,
    context,
  }),
  validationRules: [
    depthLimit(
      5,            //kind of arbitrary depth limit.. should think more about this
      { ignore: [] }, //you can specify fields to ignore
      depths => console.log(depths) //get a map of the depths for each operation
    ),
    // queryComplexity({
    //   maximumComplexity: 2000,
    //   variables: {},
    //   onComplete: (complexity) => { info(`Determined query complexity: ${complexity}`) },
    //   createError: (max, actual) =>
    //     new GqlError(`Query is too complex: ${actual}. Maximum allowed complexity: ${max}`)
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
    endpoint: "http://localhost:4000/dev/graphql",
    settings: {
      'schema.polling.interval': 60000
    }
  }
});

exports.graphqlHandler = server.createHandler({
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  },
});