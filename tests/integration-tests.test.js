import { ApolloServer, gql } from 'apollo-server-lambda';
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

// testClient can also return mutation for mutation tests
const { query } = createTestClient(server);

const GET_USER = gql`
  query Person($username: String!) {
    user(username: $username) {
      id
    }
  }`;

const GET_PERSON = gql`
  query Person($id: Int!) {
    person(id: $id) {
      full_name
    }
  }`;

const GET_PROJECT = gql`
  query Project($id: Int!) {
    project(id: $id) {
      title
    }
  }`;

const GET_DROPBOX = gql`
query DropBoxService($id: Int!) {
  dropbox(id: $id) {
    name
  }
}`;

const GET_VIS = gql`
query VisualisationService($id: Int!) {
  visualisation(id: $id) {
    name
  }
}`;

const GET_VM = gql`
query ResearchVMService($id: Int!) {
  researchvm(id: $id) {
    name
  }
}`;

const GET_STORAGE = gql`
query ResearchStorageService($id: Int!) {
  researchstorage(id: $id) {
    name
  }
}`;

const GET_NECTAR = gql`
query NectarService($id: Int!) {
  nectar(id: $id) {
    name
  }
}`;

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

});
