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
  GET_NECTAR } from './queries';
import {
  mockPersonFindByIdentityResponse,
  mockGetPersonResponse,
  mockGetProjectResponse,
  mockGetVmResponse,
  mockGetResearchDriveResponse,
  mockGetNectarResponse,
  mockGetDropboxResponse,
  mockGetVisResponse } from '../datasources/test_mock_data';


const constructTestServer = () => {
  const eResearchProjectAPI = new EResearchProjectAPI();

  // create a test server to test against, using our production typeDefs,
  // resolvers, and dataSources.
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    dataSources: () => ({ eResearchProjectAPI }),
    context: () => ({}),
    validationRules: [
      depthLimit(5),
    ],
  });

  return { server, eResearchProjectAPI };
};

describe('Mock integration tests', () => {
  test('fetches single person by username', async() => {
    // This function returns the server instance as well as our dataSource
    // instances, so we can overwrite the underlying fetchers
    const {server, eResearchProjectAPI} = constructTestServer();

    // mock the dataSource's underlying fetch methods
    eResearchProjectAPI.personFindByIdentity = jest.fn(
      () => [mockPersonFindByIdentityResponse]
    );

    // use the test server to create a query function
    const { query } = createTestClient(server);

    // run query against the server and snapshot the output
    const res = await query(
      { query: GET_USER, variables: { username: 'rmcc872' } }
    );
    expect(res).toMatchSnapshot();
  });

  test('fetches single person by id', async() => {
    const {server, eResearchProjectAPI} = constructTestServer({
      context: () => ({}),
    });

    eResearchProjectAPI.getPerson = jest.fn(
      () => [mockGetPersonResponse]
    );

    const { query } = createTestClient(server);

    const res = await query(
      { query: GET_PERSON, variables: { id: 1 } }
    );
    expect(res).toMatchSnapshot();
  });

  test('fetches single project by id', async() => {
    const {server, eResearchProjectAPI} = constructTestServer({
      context: () => ({}),
    });

    eResearchProjectAPI.getProject = jest.fn(
      () => [mockGetProjectResponse]
    );

    const { query } = createTestClient(server);

    const res = await query(
      { query: GET_PROJECT, variables: { id: 1 } }
    );
    expect(res).toMatchSnapshot();
  });

  test('fetches single vm by id', async() => {
    const {server, eResearchProjectAPI} = constructTestServer({
      context: () => ({}),
    });

    eResearchProjectAPI.getVM = jest.fn(
      () => [mockGetVmResponse]
    );

    const { query } = createTestClient(server);

    const res = await query(
      { query: GET_VM, variables: { id: 1 } }
    );
    expect(res).toMatchSnapshot();
  });

  test('fetches single research drive by id', async() => {
    const {server, eResearchProjectAPI} = constructTestServer({
      context: () => ({}),
    });

    eResearchProjectAPI.getResearchDrive = jest.fn(
      () => [mockGetResearchDriveResponse]
    );

    const { query } = createTestClient(server);

    const res = await query(
      { query: GET_STORAGE, variables: { id: 1 } }
    );
    expect(res).toMatchSnapshot();
  });

  test('fetches single Nectar by id', async() => {
    const {server, eResearchProjectAPI} = constructTestServer({
      context: () => ({}),
    });

    eResearchProjectAPI.getNectar = jest.fn(
      () => [mockGetNectarResponse]
    );

    const { query } = createTestClient(server);

    const res = await query(
      { query: GET_NECTAR, variables: { id: 1 } }
    );
    expect(res).toMatchSnapshot();
  });

  test('fetches single Dropbox by id', async() => {
    const {server, eResearchProjectAPI} = constructTestServer({
      context: () => ({}),
    });

    eResearchProjectAPI.getDropbox = jest.fn(
      () => [mockGetDropboxResponse]
    );

    const { query } = createTestClient(server);

    const res = await query(
      { query: GET_DROPBOX, variables: { id: 1 } }
    );
    expect(res).toMatchSnapshot();
  });

  test('fetches single Vis by id', async() => {
    const {server, eResearchProjectAPI} = constructTestServer({
      context: () => ({}),
    });

    eResearchProjectAPI.getVis = jest.fn(
      () => [mockGetVisResponse]
    );

    const { query } = createTestClient(server);

    const res = await query(
      { query: GET_VIS, variables: { id: 1 } }
    );
    expect(res).toMatchSnapshot();
  });

});
