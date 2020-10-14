// Adapted from https://learnitmyway.com/apollo-server-testing/
import { EResearchProjectAPI } from '../datasources/eresearch-project-api';
import { GrouperAPI } from '../datasources/grouper-api';
import { constructTestServer } from './utils/test_server';
import {
  GET_USER,
  GET_PERSON,
  GET_PROJECT,
  GET_DROPBOX,
  GET_VIS,
  GET_VM,
  GET_STORAGE,
  GET_NECTAR,
  GET_GROUPMEMBERS,
} from './utils/test_queries';
import {
  mockPersonFindByIdentityResponse,
  mockGetPersonResponse,
  mockGetProjectResponse,
  mockGetVmResponse,
  mockGetResearchDriveResponse,
  mockGetNectarResponse,
  mockGetDropboxResponse,
  mockGetVisResponse,
  mockGetGroupmembersResponse,
} from './utils/test_mock_data';


const eresAPI = new EResearchProjectAPI();
const grouperAPI = new GrouperAPI();

// mock the dataSource's underlying fetch methods
eresAPI.personFindByIdentity = jest.fn(
  () => mockPersonFindByIdentityResponse
);
eresAPI.getPerson = jest.fn(
  () => mockGetPersonResponse
);
eresAPI.getProject = jest.fn(
  () => mockGetProjectResponse
);
eresAPI.getVM = jest.fn(
  () => mockGetVmResponse
);
eresAPI.getResearchDrive = jest.fn(
  () => mockGetResearchDriveResponse
);
eresAPI.getNectar = jest.fn(
  () => mockGetNectarResponse
);
eresAPI.getDropbox = jest.fn(
  () => mockGetDropboxResponse
);
eresAPI.getVis = jest.fn(
  () => mockGetVisResponse
);
grouperAPI.getGroupMembers = jest.fn(
  () => mockGetGroupmembersResponse
);

// create the test server to create a query function
const { query } = constructTestServer(() => ({eresAPI, grouperAPI}));

describe('Mock integration tests for EResearchProjectAPI', () => {
  /* Test suite for mocked tests where we are testing a query against
    the actual schema, resolvers, but we are using datasources with mocked
    fetch methods i.e. we are not calling any external services

    These tests could break if:
    - someone accidentally deletes anything from our resolver,
      data source method or associated type definitions
    - someone adds a required field to the associated type definitions
    - someone accidentally renames the endpoint
    - GraphQL throws an error
    - Changes are made to schema permissions
  */

  test('fetches single person by username', async() => {
    // run query against the test server and test the output
    const res = await query(
      { query: GET_USER, variables: { username: 'rmcc872' } }
    );

    // Ensure that the errors are undefined
    expect(res.errors).toBe(undefined);

    // Check to see if the mocked endpoint was called with the correct args
    expect(
      eresAPI.personFindByIdentity).toHaveBeenCalledWith('rmcc872');

    // Check that we got back the data we expected
    expect(res?.data?.user).toEqual(mockPersonFindByIdentityResponse);
  });

  test('fetches single person by id', async() => {
    const res = await query(
      { query: GET_PERSON, variables: { id: 1 } }
    );

    expect(res.errors).toBe(undefined);

    expect(eresAPI.getPerson).toHaveBeenCalledWith(1);

    expect(res?.data?.person).toEqual(mockGetPersonResponse);
  });

  test('fetches single project by id', async() => {
    const { query } = constructTestServer(
      () => ({eresAPI}),
      () => (
        {
          user: {
            roles: ['ADMIN'],
          },
        }
      )
    );
    const res = await query(
      { query: GET_PROJECT, variables: { id: 1 } }
    );

    expect(res.errors).toBe(undefined);

    expect(eresAPI.getProject).toHaveBeenCalledWith(1);

    expect(res?.data?.project).toEqual(mockGetProjectResponse);
  });

  test('fetches single vm by id', async() => {
    const { query } = constructTestServer(
      () => ({eresAPI}),
      () => (
        {
          user: {
            roles: ['ADMIN'],
          },
        }
      )
    );
    const res = await query(
      { query: GET_VM, variables: { id: 1 } }
    );

    expect(res.errors).toBe(undefined);

    expect(eresAPI.getVM).toHaveBeenCalledWith(1);

    expect(res?.data?.researchvm).toEqual(mockGetVmResponse);
  });

  test('fetches single research drive by id', async() => {
    const { query } = constructTestServer(
      () => ({eresAPI}),
      () => (
        {
          user: {
            roles: ['ADMIN'],
          },
        }
      )
    );
    const res = await query(
      { query: GET_STORAGE, variables: { id: 1 } }
    );

    expect(res.errors).toBe(undefined);

    expect(eresAPI.getResearchDrive).toHaveBeenCalledWith(1);

    expect(res?.data?.researchstorage).toEqual(mockGetResearchDriveResponse);
  });

  test('fetches single Nectar by id', async() => {
    const { query } = constructTestServer(
      () => ({eresAPI}),
      () => (
        {
          user: {
            roles: ['ADMIN'],
          },
        }
      )
    );
    const res = await query(
      { query: GET_NECTAR, variables: { id: 1 } }
    );

    expect(res.errors).toBe(undefined);

    expect(eresAPI.getNectar).toHaveBeenCalledWith(1);

    expect(res?.data?.nectar).toEqual(mockGetNectarResponse);
  });

  test('fetches single Dropbox by id', async() => {
    const { query } = constructTestServer(
      () => ({eresAPI}),
      () => (
        {
          user: {
            roles: ['ADMIN'],
          },
        }
      )
    );
    const res = await query(
      { query: GET_DROPBOX, variables: { id: 1 } }
    );

    expect(res.errors).toBe(undefined);

    expect(eresAPI.getDropbox).toHaveBeenCalledWith(1);

    expect(res?.data?.dropbox).toEqual(mockGetDropboxResponse);
  });

  test('fetches single Vis by id', async() => {
    const { query } = constructTestServer(
      () => ({eresAPI}),
      () => (
        {
          user: {
            roles: ['ADMIN'],
          },
        }
      )
    );
    const res = await query(
      { query: GET_VIS, variables: { id: 1 } }
    );

    expect(res.errors).toBe(undefined);

    expect(eresAPI.getVis).toHaveBeenCalledWith(1);

    expect(res?.data?.visualisation).toEqual(mockGetVisResponse);
  });

  test('fetches a list of groupmembers', async() => {
    const groupNames = ['test'];
    const res = await query(
      {
        query: GET_GROUPMEMBERS,
        variables: { groupnames: groupNames },
      }
    );

    expect(res?.errors).toBe(undefined);

    expect(grouperAPI.getGroupMembers).toHaveBeenCalledWith(groupNames);

    expect(res?.data.groupmembers).toEqual(mockGetGroupmembersResponse);
  });

});
