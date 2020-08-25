import { constructTestServer } from './utils/test_server';
import { EResearchProjectAPI } from '../datasources/eresearch-project-api';
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
} from './utils/test_queries';


// create a test server using the real typeDefs, resolvers and datasources
// any of these can alternatively be mocked.
// See https://www.apollographql.com/docs/apollo-server/testing/mocking/
// See also mock-integrations.test.js
const eresAPI = new EResearchProjectAPI();
const { query } = constructTestServer(() => ({eresAPI}));

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
     - (Anything else?)
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
    const res = await query(
      {
        query: GET_ALL_PROJECTS,
      }
    );
    console.log(res.errors[0].message);
    expect(res.errors[0].message).toContain(
      'User not authorized. Admin only.');
  });

  test('Check non-admin user cannot query all people', async() => {
    const res = await query(
      {
        query: GET_ALL_PEOPLE,
      }
    );
    console.log(res.errors[0].message);
    expect(res.errors[0].message).toContain(
      'User not authorized. Admin only.');
  });

});
