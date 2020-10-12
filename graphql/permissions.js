import { rule, shield, race } from 'graphql-shield';
import { performance } from 'perf_hooks';

const serviceTypeLookup = {
  DropBoxService: 'dropbox',
  VisualisationService: 'vis',
  ResearchVMService: 'vm',
  ResearchStorageService: 'researchdrive',
  NectarService: 'nectar',
};

const isAdmin = rule({ cache: 'contextual' })(
  async(parent, args, context, info) => {
    console.log('Performing isAdmin check...');
    const t0 = performance.now();
    if (
      !context.user.hasOwnProperty('roles') ||
      !context.user.roles.includes('ADMIN')
    ) {
      return false;
    }
    const t1 = performance.now();
    console.log(`Call to isAdmin took ${t1 - t0} milliseconds.`);
    return true;
  }
);

const isProjectMember = rule({ cache: 'strict' })(
  async(parent, args, { user, dataSources }, info) => {
    console.log('Performing isProjectMember check...');
    const t0 = performance.now();
    const projectId = parent ? parent.id : args.id;
    const currentUser = await dataSources.eresAPI.personFindByIdentity(
      user.preferred_username
    );
    const members = await dataSources.eresAPI.get(
      `/project/${projectId}/member`
    );
    for (const member of members) {
      // const person = await dataSources.eresAPI.get(member.person.href);
      const personId = parseInt(member.person.href.slice(8), 10);
      if (personId === currentUser.id) {
        console.log('Match found! User may view the requested project.');
        const t1 = performance.now();
        console.log(`Call to isProjectMember took ${t1 - t0} milliseconds.`);
        return true;
      }
    }
    return false;
  }
);

const isServiceMember = rule({ cache: 'strict' })(
  async(parent, args, context, info) => {
    console.log('Performing isServiceMember check...');
    const t0 = performance.now();

    let serviceType;
    if (info.parentType.name === 'Query') { // it's a top-level query
      serviceType = serviceTypeLookup[info.returnType.name];
      console.log(
        'parent type: ' + JSON.stringify(info.parentType) +
         ' return type: ' + JSON.stringify(info.returnType)
      );
    } else { // it's a nested query so use the parentType
      serviceType = serviceTypeLookup[info.parentType.name];
      console.log(
        'parent type: ' + JSON.stringify(info.parentType) +
         ' return type: ' + JSON.stringify(info.returnType)
      );
    }

    const serviceId = parent ? parent.id : args.id;

    const currentUser = await context.dataSources.eresAPI.personFindByIdentity(
      context.user.preferred_username
    );

    console.log(
      'personId: ' + currentUser.id +
      ' serviceId: ' + serviceId +
      ' serviceType: ' + serviceType);

    // get service projects:
    // user can view the service if they are a member of any of the
    // services' related projects, OR for vms and research drives,
    // if they are a member of any of the services' groups.
    const serviceProjects = await context.dataSources.eresAPI.get(
      `${serviceType}/${serviceId}/project`
    );

    // check if current user is a member of any service projects
    for (const project of serviceProjects) {
      const members = await context.dataSources.eresAPI.get(
        `${project.project.href}/member`
      );
      for (const member of members) {
        // extract the person id from member.person.href (e.g. '/person/1373')
        const personId = parseInt(member.person.href.slice(8), 10);
        if (personId === currentUser.id) {
          // found a match so current user is allowed to view the service
          console.log('Match found! User may view the requested service.');
          const t1 = performance.now();
          console.log(`Call to isServiceMember took ${t1 - t0} milliseconds.`);
          return true;
        }
      }
    }

    // if service is a vm or drive, check the group members
    if (serviceType === 'vm' || serviceType === 'researchdrive') {
      // get group names
      const serviceGroups = await context.dataSources.eresAPI.get(
        `${serviceType}/${serviceId}/group`
      );

      // group names are different for vms vs researchdrives
      let groups;
      if (serviceType === 'vm') {
        groups = ['admin_group', 'rw_group', 'user_group'];
      }
      if (serviceType === 'researchdrive') {
        groups = ['adm_group', 'ro_group', 'rw_group', 't_group'];
      }

      // check groups one at a time and return if member match found
      for (const group of groups) {
        // clean up group name
        const groupName = serviceGroups[group].replace(
          '.eresearch', ''
        );
        const members = await context.dataSources.grouperAPI.getGroupMembers(
          groupName
        );

        if (members) {
          // getGroupMembers returns an array but we will only ever have one
          // entry because we're checking one group at a time:
          for (const member of members[0].users) {
            if (member.username === context.user.preferred_username) {
              // found a match so current user is allowed to view the service
              console.log('Match found! User may view the requested service.');
              const t1 = performance.now();
              console.log(
                `Call to isServiceMember took ${t1 - t0} milliseconds.`);
              return true;
            }
          }
        }
      }
    }
    console.log('No match found! user can not view the requested service.');
    const t1 = performance.now();
    console.log(`Call to isServiceMember took ${t1 - t0} milliseconds.`);
    return false;
  }
);

export const permissions = shield(
  {
    Query: {
      people: isAdmin,
      projects: isAdmin,
      project: race(isAdmin, isProjectMember),
      dropbox: race(isAdmin, isServiceMember),
      visualisation: race(isAdmin, isServiceMember),
      researchvm: race(isAdmin, isServiceMember),
      researchstorage: race(isAdmin, isServiceMember),
      nectar: race(isAdmin, isServiceMember),
    },
    Project: race(isAdmin, isProjectMember),
    DropBoxService: race(isAdmin, isServiceMember),
    VisualisationService: race(isAdmin, isServiceMember),
    ResearchVMService: race(isAdmin, isServiceMember),
    ResearchStorageService: race(isAdmin, isServiceMember),
    NectarService: race(isAdmin, isServiceMember),
  },
  {
    allowExternalErrors: true,
  }
);
