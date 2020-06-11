import { ApolloServer } from 'apollo-server-lambda';
import depthLimit from 'graphql-depth-limit';
import { createTestClient } from 'apollo-server-testing';
import { typeDefs } from '../schema';
import { resolvers } from '../resolvers';
import { EResearchProjectAPI } from '../datasources/eresearch-project-api';
import {
  GET_USER,
  GET_PERSON,
  GET_PROJECT,
  GET_DROPBOX,
  GET_VIS,
  GET_VM,
  GET_STORAGE,
  GET_NECTAR,
  GET_ALL_INFO_OF_A_PERSON,
  GET_ALL_INFO_OF_A_PROJECT,
  QUERY_DEPTH_OVER_5 } from './queries';


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
  validationRules: [
    depthLimit(5),
  ],
});

// testClient can also return mutation for mutation tests
const { query } = createTestClient(server);

// Test suite for integration tests where we are testing a query against
// the actual schema, resolvers and ensuring the datasource returns the
// result we expect, and that it has the correct format and types.
describe('Basic query -> resolver -> REST API -> schema tests', () => {
  test('Check the person Id of username gsou008', async() => {
    const res = await query(
      {
        query: GET_USER,
        variables: { username: 'gsou008' },
      }
    );
    expect(res.data.user.id).toBe(1);
  });

  test('Check the name of person 1', async() => {
    const res = await query(
      {
        query: GET_PERSON,
        variables: { id: 1 },
      }
    );
    expect(res.data.person.full_name).toBe('Gene Soudlenkov');
  });

  test('Check the title of project 1', async() => {
    const res = await query(
      {
        query: GET_PROJECT,
        variables: { id: 1 },
      }
    );
    expect(res.data.project.title).toBe(
      'Movement Disorders and Rehabilitation');
  });

  test('Check the name of dropbox service 1', async() => {
    const res = await query(
      {
        query: GET_DROPBOX,
        variables: { id: 1 },
      }
    );
    expect(res.data.dropbox.name).toBe('Rob_Testing');
  });

  test('Check the name of visualisation service 1', async() => {
    const res = await query(
      {
        query: GET_VIS,
        variables: { id: 1 },
      }
    );
    expect(res.data.visualisation.name).toBe('legacy');
  });

  test('Check the name of researchvm service 1', async() => {
    const res = await query(
      {
        query: GET_VM,
        variables: { id: 1 },
      }
    );
    expect(res.data.researchvm.name).toBe('ceratriprd01');
  });

  test('Check the name of researchstorage service 1', async() => {
    const res = await query(
      {
        query: GET_STORAGE,
        variables: { id: 1 },
      }
    );
    expect(res.data.researchstorage.name).toBe('reseng201800030-ssc');
  });

  test('Check the name of nectar service 1', async() => {
    const res = await query(
      {
        query: GET_NECTAR,
        variables: { id: 1 },
      }
    );
    expect(res.data.nectar.name).toBe('active_learning');
  });

  test('Get all the info of person 1', async() => {
    const res = await query(
      {
        query: GET_ALL_INFO_OF_A_PERSON,
        variables: { id: 1 },
      }
    );
    expect(
      res.data.person.divisions[0].divisional_role.name
    ).toBe('Staff or Post Doc');
  });

  test('Get all the info of project 1', async() => {
    const res = await query(
      {
        query: GET_ALL_INFO_OF_A_PROJECT,
        variables: { id: 1 },
      }
    );
    expect(res.data.project.id).toBe(1);
  });

  test('Error on query depth greater than 5', async() => {
    const res = await query(
      {
        query: QUERY_DEPTH_OVER_5,
        variables: { id: 1 },
      }
    );
    expect(res.errors[0].message).toContain(
      'exceeds maximum operation depth of 5');
  });

});
