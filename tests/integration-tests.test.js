import { constructTestServer } from './utils/test_server';
import { EResearchProjectAPI } from '../datasources/eresearch-project-api';
import { GrouperAPI } from '../datasources/grouper-api';
import {
  GET_USER,
  GET_PERSON,
  GET_PROJECT,
  GET_DROPBOX_PROJECTS,
  GET_VIS_PROJECTS,
  GET_VM_PROJECTS,
  GET_STORAGE_PROJECTS,
  GET_NECTAR_PROJECTS,
  GET_ALL_INFO_OF_A_PERSON,
  GET_ALL_INFO_OF_A_PROJECT,
  QUERY_DEPTH_OVER_5,
  GET_ALL_PROJECTS,
  GET_ALL_PEOPLE,
  GET_VM,
  GET_STORAGE,
  GET_NECTAR,
  GET_VIS,
  GET_DROPBOX,
  GET_GROUPMEMBERS,
} from './utils/test_queries';


// create a test server using the real typeDefs, resolvers and datasources
// any of these can alternatively be mocked.
// See https://www.apollographql.com/docs/apollo-server/testing/mocking/
// See also mock-integrations.test.js
const eresAPI = new EResearchProjectAPI();
const grouperAPI = new GrouperAPI();
const { query } = constructTestServer(() => ({eresAPI, grouperAPI}));

describe('Basic query -> resolver -> REST API -> schema tests', () => {
  /* Test suite for full integration tests where we are testing a query against
     the actual schema, resolvers and datasources. Mainly used to check if the
     result we expect is returned from the external service.

     These tests could break if:
     - someone accidentally deletes anything from our resolver,
       data source method or associated type definitions
     - someone adds a required field to the associated type definitions
     - someone accidentally renames the endpoint
     - GraphQL throws an error
     - The external service (e.g. the eResearch Project API)
       has changed or is unavailable
     - Changes are made to schema permissions
  */

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
      {
        query: GET_PROJECT,
        variables: { id: 1 },
      }
    );
    expect(res.data.project.title).toBe(
      'Movement Disorders and Rehabilitation');
  });

  test('Check the name and projects of dropbox service 1', async() => {
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
      {
        query: GET_DROPBOX_PROJECTS,
        variables: { id: 1 },
      }
    );
    expect(res.data.dropbox.name).toBe('Rob_Testing');
    expect(Array.isArray(res.data.dropbox.projects)).toBe(true);
  });

  test('Check the name and projects of visualisation service 1', async() => {
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
      {
        query: GET_VIS_PROJECTS,
        variables: { id: 1 },
      }
    );
    expect(res.data.visualisation.name).toBe('legacy');
    expect(Array.isArray(res.data.visualisation.projects)).toBe(true);
  });

  test('Check the name and projects of researchvm service 1', async() => {
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
      {
        query: GET_VM_PROJECTS,
        variables: { id: 1 },
      }
    );
    expect(res.data.researchvm.name).toBe('ceratriprd01');
    expect(Array.isArray(res.data.researchvm.projects)).toBe(true);
  });

  test('Check the name and projects of researchstorage service 1', async() => {
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
      {
        query: GET_STORAGE_PROJECTS,
        variables: { id: 1 },
      }
    );
    expect(res.data.researchstorage.name).toBe('reseng201800030-ssc');
    expect(Array.isArray(res.data.researchstorage.projects)).toBe(true);
  });

  test('Check the name and projects of nectar service 1', async() => {
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
      {
        query: GET_NECTAR_PROJECTS,
        variables: { id: 1 },
      }
    );
    expect(res.data.nectar.name).toBe('active_learning');
    expect(Array.isArray(res.data.nectar.projects)).toBe(true);
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

  test('Check non-admin user cannot query all projects', async() => {
    // create a new instance of test server, pass in user without admin role
    const { query } = constructTestServer(
      () => ({eresAPI}),
      () => (
        {
          user: {
            roles: [],
          },
        }
      )
    );
    const res = await query(
      {
        query: GET_ALL_PROJECTS,
      }
    );
    expect(res.errors[0].message).toContain(
      'Not Authorised!');
  });

  test('Check non-admin user cannot query all people', async() => {
    // create a new instance of test server, pass in user without admin role
    const { query } = constructTestServer(
      () => ({eresAPI}),
      () => (
        {
          user: {
            roles: [],
          },
        }
      )
    );
    const res = await query(
      {
        query: GET_ALL_PEOPLE,
      }
    );
    expect(res.errors[0].message).toContain(
      'Not Authorised!');
  });

  test('Check admin user can query all projects', async() => {
    // create a new instance of test server, pass in user with admin role
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
    const expected = [{ id: 1 }, { id: 2 }];
    const res = await query(
      {
        query: GET_ALL_PROJECTS,
      }
    );
    // matches even if received contains additional elements:
    expect(res.data.projects).toEqual(expect.arrayContaining(expected));
  });

  test('Check admin user can query all people', async() => {
    // create a new instance of test server, pass in user with admin role
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
    const expected = [{ id: 1 }, { id: 2 }];
    const res = await query(
      {
        query: GET_ALL_PEOPLE,
      }
    );

    // matches even if received contains additional elements:
    expect(res.data.people).toEqual(expect.arrayContaining(expected));
  });

  test('Check non-admin user cannot query a vm', async() => {
    // create a new instance of test server, pass in user without admin role
    const { query } = constructTestServer(
      () => ({eresAPI}),
      () => (
        {
          user: {
            roles: [],
          },
        }
      )
    );
    const res = await query(
      {
        query: GET_VM,
        variables: { id: 1 },
      }
    );
    expect(res.errors[0].message).toContain(
      'Not Authorised!');
  });

  test('Check non-admin user cannot query a research drive', async() => {
    // create a new instance of test server, pass in user without admin role
    const { query } = constructTestServer(
      () => ({eresAPI}),
      () => (
        {
          user: {
            roles: [],
          },
        }
      )
    );
    const res = await query(
      {
        query: GET_STORAGE,
        variables: { id: 1 },
      }
    );
    expect(res.errors[0].message).toContain(
      'Not Authorised!');
  });

  test('Check non-admin user cannot query a nectar', async() => {
    // create a new instance of test server, pass in user without admin role
    const { query } = constructTestServer(
      () => ({eresAPI}),
      () => (
        {
          user: {
            roles: [],
          },
        }
      )
    );
    const res = await query(
      {
        query: GET_NECTAR,
        variables: { id: 1 },
      }
    );
    expect(res.errors[0].message).toContain(
      'Not Authorised!');
  });

  test('Check non-admin user cannot query a vis', async() => {
    // create a new instance of test server, pass in user without admin role
    const { query } = constructTestServer(
      () => ({eresAPI}),
      () => (
        {
          user: {
            roles: [],
          },
        }
      )
    );
    const res = await query(
      {
        query: GET_VIS,
        variables: { id: 1 },
      }
    );
    expect(res.errors[0].message).toContain(
      'Not Authorised!');
  });

  test('Check non-admin user cannot query a dropbox', async() => {
    // create a new instance of test server, pass in user without admin role
    const { query } = constructTestServer(
      () => ({eresAPI}),
      () => (
        {
          user: {
            roles: [],
          },
        }
      )
    );
    const res = await query(
      {
        query: GET_DROPBOX,
        variables: { id: 1 },
      }
    );
    expect(res.errors[0].message).toContain(
      'Not Authorised!');
  });

  test('Get the members of a group', async() => {
    const groupNames = ['rvmf00097_vmadmin'];
    const res = await query(
      {
        query: GET_GROUPMEMBERS,
        variables: { groupnames: groupNames },
      }
    );
    expect(res.data.groupmembers[0].total).toBeGreaterThan(0);
    expect(res.data.groupmembers[0].groupname).toBe('rvmf00097_vmadmin');
    expect(res.data.groupmembers[0].users.length).toBeGreaterThan(0);
  });

  test('Querying an invalid group gives users null', async() => {
    const groupNames = ['abc'];
    const res = await query(
      {
        query: GET_GROUPMEMBERS,
        variables: { groupnames: groupNames },
      }
    );
    expect(res.data.groupmembers[0].total).toBe(0);
    expect(res.data.groupmembers[0].groupname).toBe('abc');
    expect(res.data.groupmembers[0].users).toBeNull();
  });

  test('Non service member cannot get a vm', async() => {
    const { query } = constructTestServer(
      () => ({eresAPI, grouperAPI}),
      () => (
        {
          user: {
            roles: [],
            preferred_username: 'rmcc872',
          },
        }
      )
    );
    const res = await query(
      { query: GET_VM, variables: { id: 1 } }
    );

    expect(res.errors[0].message).toContain(
      'Not Authorised!');
  });

  test('Service member can get a vm', async() => {
    const { query } = constructTestServer(
      () => ({eresAPI, grouperAPI}),
      () => (
        {
          user: {
            roles: [],
            preferred_username: 'atri027',
          },
        }
      )
    );
    const res = await query(
      { query: GET_VM, variables: { id: 1 } }
    );

    expect(res.data.researchvm.name).toBe('ceratriprd01');
  });

  test('Non service member cannot get a dropbox', async() => {
    const { query } = constructTestServer(
      () => ({eresAPI, grouperAPI}),
      () => (
        {
          user: {
            roles: [],
            preferred_username: 'rmcc872',
          },
        }
      )
    );
    const res = await query(
      { query: GET_DROPBOX, variables: { id: 1 } }
    );

    expect(res.errors[0].message).toContain(
      'Not Authorised!');
  });

  test('Service member can get a dropbox', async() => {
    const { query } = constructTestServer(
      () => ({eresAPI, grouperAPI}),
      () => (
        {
          user: {
            roles: [],
            preferred_username: 'rmcc872',
          },
        }
      )
    );
    const res = await query(
      { query: GET_DROPBOX, variables: { id: 343 } }
    );

    expect(res.data.dropbox.name).toBe('complex-contagion');
  });

  test('Non project member cannot get a project', async() => {
    const { query } = constructTestServer(
      () => ({eresAPI, grouperAPI}),
      () => (
        {
          user: {
            roles: [],
            preferred_username: 'rmcc872',
          },
        }
      )
    );
    const res = await query(
      { query: GET_PROJECT, variables: { id: 1 } }
    );

    expect(res.errors[0].message).toContain(
      'Not Authorised!');
  });

  test('Project member can get a project', async() => {
    const { query } = constructTestServer(
      () => ({eresAPI, grouperAPI}),
      () => (
        {
          user: {
            roles: [],
            preferred_username: 'rmcc872',
          },
        }
      )
    );
    const res = await query(
      { query: GET_PROJECT, variables: { id: 1005 } }
    );

    expect(res.data.project.title).toBe(
      'Complex contagion of COVID-19');
  });

});
