// Example user data from Cognito:
// {
// 	"custom:EmpID":"8778386",
// 	"sub":"c246faf7-127d-420c-9204-000d7e029793",
// 	"email_verified":"false",
//   "custom:Groups":
//     "[ManagedPrintUsers.its, Employee.psrwi, staffIntranetUser.ec]",
// 	"name":"Rose McColl",
// 	"preferred_username":"rmcc872",
// 	"given_name":"Rose",
// 	"family_name":"McColl",
// 	"email":"Rose.McColl@auckland.ac.nz",
// 	"username":"uoatestidp_rmcc872"
// }

import { AuthenticationError } from 'apollo-server-lambda';
import fetch from 'node-fetch';

const utils = require('@uoa/utilities');

export async function getUserInfo(event) {
  // Get user from token
  try {
    let data = await utils.getUserInfo(
      event,
      process.env.COGNITO_DOMAIN + '.auth.' +
      process.env.REGION + '.amazoncognito.com'
    );
    if (data.error) {
      throw new AuthenticationError(data.error);
    } else {
      const groups = await getUserGroups(data.preferred_username);
      data['groups'] = groups;
      data['roles'] = await getUserRoles(groups);
      return data;
    }
  } catch (e) {
    throw new AuthenticationError(`Error getting user info: ${e}`);
  }
};


export async function getUserGroups(upi) {
  try {
    if (upi === undefined) {
      throw new Error('No upi given.');
    }
    const baseURL = process.env.REGROUP_V2_API_BASE_URL;
    const apiKey = process.env.REGROUP_V2_API_KEY;
    const headers = {
      'Content-Type': 'application/json',
      apikey: apiKey,
    };
    const response = await fetch(
      `${baseURL}/user/${upi}/membership`, {headers: headers}
    );
    const groups = await response.json();
    if (groups.total === 0) {
      throw new Error('User has no groups. Check if UPI is valid.');
    }
    // filter groups to only CeR-related groups (eresearch.auckland.ac.nz)
    const cerGroups = groups.memberships.filter((membership) => {
      return membership.memberid.includes('eresearch.auckland.ac.nz');
    });
    return cerGroups;
  } catch (e) {
    throw new AuthenticationError(`Error getting user groups: ${e}`);
  }
};


export async function getUserRoles(groups) {
  try {
    let roles = [];

    if (groups.length > 0) {
      let isAdmin = groups.some(
        item => item.memberid === 'eresearch.auckland.ac.nz:cerapps'
      );

      if (isAdmin) {
        roles.push('ADMIN');
      }
    }

    return roles;

  } catch (e) {
    throw new AuthenticationError(`Error checking user roles: ${e}`);
  }
}
