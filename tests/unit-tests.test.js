import { graphqlHandler } from '../handler';
import { getUserInfo, getUserGroups, getUserRoles } from '../helpers/auth';
import { AuthenticationError } from 'apollo-server-lambda';

describe('Unit Tests', () => {
  test('The lambda handler exists and is a function', async() => {
    expect(graphqlHandler).toBeTruthy();
    expect(typeof graphqlHandler).toBe('function');
  });

  test('getUserInfo throws AuthenticationError', async() => {
    /* tests that an auth error is thrown when no
      Authorization token is present (we do not pass in
      an event object)
    */
    await expect(getUserInfo()).rejects.toThrow(AuthenticationError);
  });

  test('getUserInfo throws error when token is expired', async() => {
    /* tests that an auth error is thrown when an
      Authorization token is present but is expired
    */
    const event = {
      headers: {
        // eslint-disable-next-line max-len
        Authorization: 'Bearer eyJraWQiOiJPQUxFMlozMEl4ekNudCsxU0VqTmRYdmIwdElNdm03WUhIZzdWWlNpQUxrPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiJjMjQ2ZmFmNy0xMjdkLTQyMGMtOTIwNC0wMDBkN2UwMjk3OTMiLCJjb2duaXRvOmdyb3VwcyI6WyJhcC1zb3V0aGVhc3QtMl9wZ0VyanlMNE9fVW9BVGVzdElEUCJdLCJ0b2tlbl91c2UiOiJhY2Nlc3MiLCJzY29wZSI6Imh0dHBzOlwvXC9teS1kb21haW4uYXVja2xhbmQuYWMubnpcL2FuZ3VsYXItdGVzdCBvcGVuaWQgcHJvZmlsZSIsImF1dGhfdGltZSI6MTU5NDAxMjA5OSwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLmFwLXNvdXRoZWFzdC0yLmFtYXpvbmF3cy5jb21cL2FwLXNvdXRoZWFzdC0yX3BnRXJqeUw0TyIsImV4cCI6MTU5NDAxNTY5OSwiaWF0IjoxNTk0MDEyMDk5LCJ2ZXJzaW9uIjoyLCJqdGkiOiJhNDcyNDJiNS0yNTNlLTQ0MDgtOTZjZi0zMmU1YzliNjM2MzkiLCJjbGllbnRfaWQiOiJscmp1NnY4MHZzZTRiYmFlc2p2bnIyZmYwIiwidXNlcm5hbWUiOiJ1b2F0ZXN0aWRwX3JtY2M4NzIifQ.wPByin-FMX-yZp7xKNL5JmlkiAkfK2Bb3DLNChHhDiQysgnu46Cfeb4kRgKsxluSb8TvRRc2NPWOabVRETHZHsKd-JWDQYV2kIKwKHP-4fYdX43au7RHv2HjIuEuZOa3BrDdEOMVggwQnV59v5WIxKP3Ev5i9-VU1IWRGR-s9hYzpHukyYbiDqbaVZw1dxa6Jia8NJnXxoWoHjndVFeRT0JW88TfeMKpwuM09CJw9wgSOwrGSoOR-U4fRKyNMShg4KmJ3wYhmiNX5SS0AIDUm0gtv3ATzVTKLiDGSIpvvzx7ZicGks5MC4iz3erQqAm8i9NWBgJM1FztACp0onH1zw',
      },
    };

    await expect(getUserInfo(event)).rejects.toThrow('invalid_token');
  });

  test('getUserInfo throws error when request is invalid', async() => {
    /* tests that an auth error is thrown when an
      Authorization header is present but there is no actual token
    */
    const event = {
      headers: {
        Authorization: 'Bearer ',
      },
    };

    await expect(getUserInfo(event)).rejects.toThrow('invalid_request');
  });

  test('getUserGroups correctly retrieves a users groups', async() => {
    /* tests that the getUserGroups function retrieves an array of groups for a
       valid user upi
    */
    const upi = 'rmcc872';
    const res = await getUserGroups(upi);
    expect(res.memberships).toBeTruthy();
  });

  test('getUserGroups throws an error', async() => {
    /* tests that the getUserGroups function throws an error for an
       invalid or undefined upi
    */
    const upi = '123';
    await expect(getUserGroups(upi)).rejects.toThrow(AuthenticationError);
    await expect(getUserGroups()).rejects.toThrow(AuthenticationError);
  });

  test('getUserRoles correctly assigns an admin role', async() => {
    /* tests that the getUserRoles function correctly assigns an admin role
       for a user who is a cerapps group member
    */
    const groups = {
      total: 1,
      memberships: [{
        memberid: 'eresearch.auckland.ac.nz:cerapps',
        type: 'Direct',
      }],
    };
    const expected = ['ADMIN'];
    const res = await getUserRoles(groups);
    expect(res).toEqual(expect.arrayContaining(expected));
  });

  test('getUserRoles does not assign an admin role', async() => {
    /* tests that the getUserRoles function correctly does not assign
       an admin role to a user who is not a cerapps group member
    */
    const groups = {
      total: 1,
      memberships: [{
        memberid: 'testgroup',
        type: 'Direct',
      }],
    };
    const expected = ['ADMIN'];
    const res = await getUserRoles(groups);
    expect(res).toEqual(expect.not.arrayContaining(expected));
  });

  test('getUserRoles throws an error', async() => {
    /* tests that the getUserRoles function throws an error for
       invalid or undefined groups
    */
    const groups = {};
    await expect(getUserRoles(groups)).rejects.toThrow(AuthenticationError);
    await expect(getUserRoles()).rejects.toThrow(AuthenticationError);
  });

});
