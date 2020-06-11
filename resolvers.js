export const resolvers = {
  Query: {
    user: (parent, args, { dataSources }) => {
      return dataSources.eresAPI.personFindByIdentity(
        args.username);
    },
    person: (parent, args, { dataSources }) => {
      return dataSources.eresAPI.getPerson(args.id);
    },
    project: (parent, args, { dataSources }) => {
      return dataSources.eresAPI.getProject(args.id);
    },
    researchvm: async(parent, args, { dataSources }) => {
      return dataSources.eresAPI.getVM(args.id);
    },
    researchstorage: async(parent, args, { dataSources }) => {
      return dataSources.eresAPI.getResearchDrive(args.id);
    },
    nectar: async(parent, args, { dataSources }) => {
      return dataSources.eresAPI.getNectar(args.id);
    },
    dropbox: (parent, args, { dataSources }) => {
      return dataSources.eresAPI.getDropbox(args.id);
    },
    visualisation: (parent, args, { dataSources }) => {
      return dataSources.eresAPI.getVis(args.id);
    },
  },
  Person: {
    divisions: (parent, args, { dataSources }) => {
      return dataSources.eresAPI.get(parent.divisions.href);
    },
    identities: (parent, args, { dataSources }) => {
      return dataSources.eresAPI.get(parent.identities.href);
    },
    projects: (parent, args, { dataSources }) => {
      return dataSources.eresAPI.get(
        `${parent.projects.href}?expand=role`);
    },
    properties: (parent, args, { dataSources }) => {
      return dataSources.eresAPI.get(parent.properties.href);
    },
    status: (parent, args, { dataSources }) => {
      return dataSources.eresAPI.get(parent.status.href);
    },
  },
  Division: {
    divisional_role: (parent, args, { dataSources }) => {
      return dataSources.eresAPI.get(parent.divisional_role.href);
    },
  },
  ProjectOfPerson: {
    project: (parent, args, { dataSources }) => {
      return dataSources.eresAPI.get(parent.project.href);
    },
  },
  Project: {
    external_references: (parent, args, { dataSources }) => {
      return dataSources.eresAPI.get(parent.external_references.href);
    },
    actions: (parent, args, { dataSources }) => {
      return dataSources.eresAPI.get(parent.actions.href);
    },
    codes: (parent, args, { dataSources }) => {
      return dataSources.eresAPI.get(parent.codes.href);
    },
    members: (parent, args, { dataSources }) => {
      return dataSources.eresAPI.get(
        `${parent.members.href}?expand=role`);
    },
    properties: (parent, args, { dataSources }) => {
      return dataSources.eresAPI.get(parent.properties.href);
    },
    research_outputs: (parent, args, { dataSources }) => {
      return dataSources.eresAPI.get(parent.research_outputs.href);
    },
    services: (parent, args, { dataSources }) => {
      return dataSources.eresAPI.get(parent.services.href);
    },
    status: (parent, args, { dataSources }) => {
      return dataSources.eresAPI.get(parent.status.href);
    },
  },
  Action: {
    action_type: (parent, args, { dataSources }) => {
      return dataSources.eresAPI.get(parent.action_type.href);
    },
    person: (parent, args, { dataSources }) => {
      return dataSources.eresAPI.get(parent.person.href);
    },
  },
  ProjectMember: {
    person: (parent, args, { dataSources }) => {
      return dataSources.eresAPI.get(parent.person.href);
    },
  },
  ResearchOutput: {
    researchoutput: (parent, args, { dataSources }) => {
      return dataSources.eresAPI.get(parent.researchoutput.href);
    },
  },
  ResearchOutputInfo: {
    type: (parent, args, { dataSources }) => {
      return dataSources.eresAPI.get(parent.type.href);
    },
  },
  ResearchVMService: {
    projects: (parent, args, { dataSources }) => {
      return dataSources.eresAPI.get(`vm/${parent.id}/project`);
    },
  },
  ResearchStorageService: {
    projects: (parent, args, { dataSources }) => {
      return dataSources.eresAPI.get(`researchdrive/${parent.id}/project`);
    },
  },
  NectarService: {
    projects: (parent, args, { dataSources }) => {
      return dataSources.eresAPI.get(`nectar/${parent.id}/project`);
    },
  },
  DropBoxService: {
    projects: (parent, args, { dataSources }) => {
      return dataSources.eresAPI.get(`${parent.href}/project`);
    },
  },
  VisualisationService: {
    projects: (parent, args, { dataSources }) => {
      return dataSources.eresAPI.get(`${parent.href}/project`);
    },
  },
  ServiceProject: {
    project: (parent, args, { dataSources }) => {
      return dataSources.eresAPI.get(parent.project.href);
    },
  },
};
