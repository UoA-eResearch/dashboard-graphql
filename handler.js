import { ApolloServer } from 'apollo-server-lambda';
import depthLimit from 'graphql-depth-limit'; // deals with the problem of circular references
import * as fs from 'fs';
import { resolvers } from './resolvers';


const typeDefs = fs.readFileSync("./schema.gql").toString('utf-8');

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
    )
  ],
  formatError: error => {
    console.log(error);
    return error;
  },
  formatResponse: response => {
    console.log(response);
    return response;
  }
});

module.exports.graphqlHandler = server.createHandler({
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  },
});