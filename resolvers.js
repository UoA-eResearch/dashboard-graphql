import fetch from 'node-fetch';

const baseUrl = process.env.PROJECT_DB_BASE_URL;
const apiKey = process.env.PROJECT_DB_API_KEY;
const headers = {
  apikey: apiKey,
};

const getData = async(url) => {
  try {
    const response = await fetch(url, {headers: headers});
    return response.json();
  } catch (error) {
    console.log(error);
  }
};

export const resolvers = {
  Query: {
    user: (parent, args) => getData(
      baseUrl + 'person/findByIdentity/' + args.username),
    person: (parent, args) => getData(baseUrl + '/person/' + args.id),
    project: (parent, args) => getData(baseUrl + '/project/' + args.id),
    researchvm: (parent, args) => getData(baseUrl + '/vm/' + args.id),
    researchstorage: (parent, args) => getData(
      baseUrl + '/researchdrive/' + args.id),
    dropbox: (parent, args) => getData(baseUrl + '/dropbox/' + args.id),
    visualisation: (parent, args) => getData(baseUrl + '/vis/' + args.id),
    nectar: (parent, args) => getData(baseUrl + '/nectar/' + args.id),
  },
  Person: {
    divisions: (parent) => getData(baseUrl + parent.divisions.href),
    identities: (parent) => getData(baseUrl + parent.identities.href),
    projects: (parent) => getData(
      baseUrl + parent.projects.href + '?expand=role'),
    properties: (parent) => getData(baseUrl + parent.properties.href),
    status: (parent) => getData(baseUrl + parent.status.href),
  },
  Division: {
    divisional_role: (parent) => getData(baseUrl + parent.divisional_role.href),
  },
  ProjectOfPerson: {
    project: (parent) => getData(baseUrl + parent.project.href),
    // role: (parent) => getData(baseUrl + parent.role.href), *use expand*
  },
  Project: {
    external_references: (parent, args) => getData(
      baseUrl + parent.external_references.href),
    actions: (parent, args) => getData(baseUrl + parent.actions.href),
    codes: (parent) => getData(baseUrl + parent.codes.href),
    members: (parent) => getData(
      baseUrl + parent.members.href + '?expand=role'),
    properties: (parent) => getData(baseUrl + parent.properties.href),
    research_outputs: (parent) => getData(
      baseUrl + parent.research_outputs.href),
    services: (parent) => getData(baseUrl + parent.services.href),
    status: (parent) => getData(baseUrl + parent.status.href),
  },
  Action: {
    action_type: (parent) => getData(baseUrl + parent.action_type.href),
  },
  ProjectMember: {
    person: (parent) => getData(baseUrl + parent.person.href),
    // role: (parent) => getData(baseUrl + parent.role.href), *use expand*
  },
  ResearchOutput: {
    researchoutput: (parent) => getData(baseUrl + parent.researchoutput.href),
  },
  ResearchOutputInfo: {
    type: (parent) => getData(baseUrl + parent.type.href),
  },
};
