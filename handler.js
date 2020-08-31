import { ApolloServer, makeExecutableSchema } from 'apollo-server-lambda';
import depthLimit from 'graphql-depth-limit';
import { typeDefs } from './graphql/schema';
import { resolvers } from './graphql/resolvers';
import { EResearchProjectAPI } from './datasources/eresearch-project-api';
import { getUserInfo } from './helpers/auth';
import { applyMiddleware } from 'graphql-middleware';
import { permissions } from './graphql/permissions';


// make schema, and apply permissions middleware
const schema = applyMiddleware(
  makeExecutableSchema({
    typeDefs,
    resolvers,
  }),
  permissions
);


// construct the graphql server with schema, context, etc
const server = new ApolloServer({
  schema,
  // apply lambda event and context, & user info to the graphql context
  context: async({ event, context }) => ({
    headers: event.headers,
    functionName: context.functionName,
    event,
    context,
    user: await getUserInfo(event),
  }),
  dataSources: () => {
    return {
      eresAPI: new EResearchProjectAPI(),
    };
  },
  // apply query validation rules
  validationRules: [
    depthLimit(
      5,
      { ignore: [] },
      depths => console.log('Query depths: ' + JSON.stringify(depths))
    ),
  ],
  // log errors so they appear in cloudwatch
  formatError: error => {
    console.log(error);
    return error;
  },
  // log responses so they appear in cloudwatch
  formatResponse: response => {
    console.log(JSON.parse(JSON.stringify(response)));
    return response;
  },
  playground: {
    endpoint: process.env.PLAYGROUND_ENDPOINT,
    settings: {
      'schema.polling.interval': 60000,
    },
  },
});


// create the graphqlHandler, with cors options
exports.graphqlHandler = server.createHandler({
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});
