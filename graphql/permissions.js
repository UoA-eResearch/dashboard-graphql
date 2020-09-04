import { rule, shield, race } from 'graphql-shield';

const isAdmin = rule({ cache: 'contextual' })(
  async(parent, args, context, info) => {
    if (
      !context.user.hasOwnProperty('roles') ||
      !context.user.roles.includes('ADMIN')
    ) {
      return false;
    }
    return true;
  }
);

const isProjectMember = rule({ cache: 'strict' })(
  async(parent, args, { user, dataSources}, info) => {
    const projectId = parent ? parent.id : args.id;
    const person = await dataSources.eresAPI.personFindByIdentity(
      user.preferred_username
    );
    const members = await dataSources.eresAPI.get(
      `/project/${projectId}/member`
    );
    for (const member of members) {
      const person2 = await dataSources.eresAPI.get(member.person.href);
      if (person2.id === person.id) {
        return true;
      }
    }
    return false;
  }
);

export const permissions = shield(
  {
    Query: {
      people: isAdmin,
      projects: isAdmin,
      project: race(isAdmin, isProjectMember),
    },
    Project: race(isAdmin, isProjectMember),
  },
);
