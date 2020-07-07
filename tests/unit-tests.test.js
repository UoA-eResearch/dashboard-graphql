import { graphqlHandler } from '../handler';
import { getUserInfo } from '../helpers/auth';
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

});
