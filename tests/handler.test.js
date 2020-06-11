import { graphqlHandler } from '../handler';

test('The lambda handler exists', async() => {
  expect(graphqlHandler).toBeTruthy();
});
