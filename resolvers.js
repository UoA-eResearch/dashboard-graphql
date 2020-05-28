import fetch from 'node-fetch';

const baseUrl = process.env.PROJECT_DB_BASE_URL;
const apiKey = process.env.PROJECT_DB_API_KEY;
const headers = {
  apikey: apiKey,
};

const getData = async(url) => {
  try {
    const response = await fetch(url, {headers: headers});
    const json = await response.json();
    return json;
  } catch (error) {
    console.log(error);
  }
};

// const getPersonInfo = async(args) => {
//   const url = baseUrl + '/person/' + args.id; 
//   const personInfo = await getData(url, headers);
//   console.log(personInfo);
//   try {
//     personInfo.divisions = await getData(baseUrl + personInfo.divisions.href,
//       headers);
//     personInfo.identities = await getData(baseUrl + personInfo.identities.href,
//       headers);
//     personInfo.projects = await getData(baseUrl + personInfo.projects.href,
//       headers);
//     personInfo.properties = await getData(baseUrl + personInfo.properties.href,
//       headers);
//   } catch {
//     console.log('oops');
//   }

//   return personInfo;
// };

export const resolvers = {
  Query: {
    hello: () => 'Hello world!',
    user: (parent, args) => {
      return getData(baseUrl + 'person/findByIdentity/' + args.username);
    },
    person: (parent, args) => {
      return getData(baseUrl + '/person/' + args.id);
    },
  },
  // TODO: chain resolvers here...(divisions, identities, projects, etc....)
  // https://www.apollographql.com/docs/apollo-server/data/resolvers/#resolver-chains
};
