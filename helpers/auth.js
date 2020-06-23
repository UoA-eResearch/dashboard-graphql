import { AuthenticationError } from 'apollo-server-lambda';

const utils = require('@uoa/utilities');

export async function getUserInfo(event) {
  // Get user from token
  try {
    let data = await utils.getUserInfo(
      event,
      process.env.COGNITO_DOMAIN + '.auth.' +
      process.env.COGNITO_REGION + '.amazoncognito.com'
    );
    if (data.error) {
      throw new AuthenticationError(data.error);
    } else {
      console.log('*************************');
      console.log(`user's groups = ${data['custom:Groups']}`);
      console.log('*************************');
      return data;
    }
  } catch (e) {
    throw new AuthenticationError(`Error getting user info: ${e}`);
  }
};
