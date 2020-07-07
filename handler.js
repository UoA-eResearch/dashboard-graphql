import { ApolloServer } from 'apollo-server-lambda';
import depthLimit from 'graphql-depth-limit';
import { typeDefs } from './schema';
import { resolvers } from './resolvers';
import { EResearchProjectAPI } from './datasources/eresearch-project-api';
import { getUserInfo } from './helpers/auth';

const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources: () => {
    return {
      eresAPI: new EResearchProjectAPI(),
    };
  },
  context: ({ event, context }) => ({
    headers: event.headers,
    functionName: context.functionName,
    event,
    context,
    // optional: get user info from cognito - e.g. group membership
    user: process.env.ENV === 'dev' ? '' : getUserInfo(event),
  }),
  validationRules: [
    depthLimit(
      5,
      { ignore: [] },
      depths => console.log('Query depths: ' + JSON.stringify(depths))
    ),
  ],
  formatError: error => {
    console.log(error);
    return error;
  },
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

exports.graphqlHandler = server.createHandler({
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});
