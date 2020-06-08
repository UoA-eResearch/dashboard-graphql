import { gql } from 'apollo-server-lambda';
import { query } from './test-utils';

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
  expect(res.data.project.title).toBe('Movement Disorders and Rehabilitation');
});
