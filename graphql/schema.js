import { gql } from 'apollo-server-lambda';

const typeDefs = gql`
  
  "Custom Directive for authorization. Role defaults to admin."
  directive @authorization(
    requires: AccessRole = ADMIN,
  ) on OBJECT | FIELD_DEFINITION

  "Possible access levels over a normal user"
  enum AccessRole {
    ADMIN
  }

  "Root Query type"
  type Query {
    """
    Fetches a person given their UPI.
    #### Arguments:
    username: username (UPI) of the person.    
    """
    user(username: String!): Person
    """
    Fetches all people.
    """
    people: [Person] @authorization(requires: ADMIN)
    """
    Fetches a person given their ID.
    #### Arguments:
    id: ID (from the eRes Project DB) of the person.
    """
    person(id: Int!): Person
    """
    Fetches all projects.
    """
    projects: [Project] @authorization(requires: ADMIN)
    """
    Fetches a project given its ID.
    #### Arguments:
    id: ID (from the eRes Project DB) of the project.
    """
    project(id: Int!): Project
    """
    Fetches a dropbox team folder given its ID.
    #### Arguments:
    id: ID (from the eRes Project DB) of the dropbox team folder.
    """
    dropbox(id: Int!): DropBoxService
    """
    Fetches a visualisation service given its ID.
    #### Arguments:
    id: ID (from the eRes Project DB) of the visualisation service.
    """
    visualisation(id: Int!): VisualisationService
    """
    Fetches a research vm given its ID.
    #### Arguments:
    id: ID (from the eRes Project DB) of the research vm.
    """
    researchvm(id: Int!): ResearchVMService
    """
    Fetches a research storage drive given its ID.
    #### Arguments:
    id: ID (from the eRes Project DB) of the research storage drive.
    """
    researchstorage(id: Int!): ResearchStorageService
    """
    Fetches a Nectar allocation given its ID.
    #### Arguments:
    id: ID (from the eRes Project DB) of the Nectar allocation.
    """
    nectar(id: Int!): NectarService
  }

  "Details about a person's identity and projects"
  type Person {
    id: Int!
    divisions: [Division]
    email: String
    end_date: String
    full_name: String
    "A list of identities (usernames) of the person"
    identities: [Identity]
    last_modified: String
    notes: String
    phone: String
    preferred_name: String
    "A list of projects of the person"
    projects: [ProjectOfPerson]
    "A list of properties of the person"
    properties: [PersonProperty]
    start_date: String
    "The current status of the person"
    status: PersonStatus
  }

  "Details about a project that relates to a person"
  type ProjectOfPerson {
    id: Int!
    notes: String
    "Details about the project"
    project: Project
    "The persons' role on the project"
    role: Role
  }

  "Details about a project"
  type Project {
    id: Int!
    creation_date: String
    description: String
    division: String
    end_date: String
    "A list of external references related to the project"
    external_references: [ExternalReference]
    last_modified: String
    next_review_date: String,
    notes: String
    requirements: String
    start_date: String
    title: String
    todo: String
    "A list of actions (notes) related to the project"
    actions: [Action]
    "A list of the project codes"
    codes: [Code]
    "A list of the project members"
    members: [ProjectMember]
    "A list of properties of the project"
    properties: [ProjectProperty]
    "A list of research outputs from this project"
    research_outputs: [ResearchOutput]
    "The current status of the project"
    status: ProjectStatus
    "A list of the services (VMs etc) associated with the project"
    services: ProjectServices
  }

  "The services associated with a project"
  type ProjectServices {
    "A list of the dropbox services of the project"
    dropbox: [DropBoxProject]
    "A list of the nectar services of the project"
    nectar: [NectarProject]
    "A list of the research drive services of the project"
    research_drive: [ResearchStorageProject]
    "A list of the visualisation services of the project"
    vis: [VisualisationProject]
    "A list of the VM services of the project"
    vm: [ResearchVMProject]
  }

  "Details of a project member"
  type ProjectMember {
    id: Int!
    notes: String
    "The person details"
    person: Person
    "The role of the project member on this project"
    role: Role
  }

  "Properties of a project (e.g. research domain)"
  type ProjectProperty {
    id: Int!
    propname: String
    propvalue: String
    timestamp: String
  }

  "Properties of a person"
  type PersonProperty {
    id: Int!
    propname: String
    propvalue: String
    timestamp: String
  }

  "An external reference related to a project"
  type ExternalReference {
    id: Int!
    date: String
    project_id: Int
    reference: String
    description: String
  }

  "Description of an action taken on the project"
  type Action {
    id: Int!
    "The type of action that was taken (e.g. 'Follow Up')"
    action_type: ActionType
    date: String
    notes: String
    "Details of the person who was involved in the action"
    person: Person
  }

  "An action type that can be taken on a project"
  type ActionType {
    id: Int!
    name: String
  }

  "A code which is used for project identification"
  type Code {
    id: Int!
    code: String
  }

  "Describes the current status of a project"
  type ProjectStatus {
    id: Int!
    name: String
  }

  "Describes the current status of a person"
  type PersonStatus {
    id: Int!
    name: String
  }

  "Describes the role of a project member"
  type Role {
    id: Int!
    name: String
  }

  "Identity information of a person"
  type Identity {
    id: Int!
    username: String
  }

  "An organisational division that a person belongs to"
  type Division {
    id: Int!
    division: String
    "The role of a person within the division"
    divisional_role: DivisionalRole
    external: String
  }

  "Describes a divisional role"
  type DivisionalRole {
    id: Int!
    name: String
  }

  "A research output from a project"
  type ResearchOutput {
    id: Int!
    "Details of the research output"
    researchoutput: ResearchOutputInfo
  }

  "Details of a research output"
  type ResearchOutputInfo {
    id: Int!
    date_reported: String
    description: String
    doi: String
    "The type of research output"
    type: ResearchOutputType
    uri: String
  }

  "A research output type"
  type ResearchOutputType {
    id: Int!
    name: String
  }

  "Details of a Research VM related to a project"
  type ResearchVMProject {
    id: Int!
    name: String
    cpus: Int
    date: String
    deleted: Int
    host: String
    memory_gb: Float
    os: String
    state: String
    total_disk_gb: Float
    uuid: String
		first_day: String
    last_day: String
    project_code: String
  }

  "Details of a Research Storage Drive related to a project"
  type ResearchStorageProject {
    id: Int!
    name: String
    allocated_gb: Int
    date: String
    deleted: Int
    division: String
    free_gb: Float
    num_files: Int
    percentage_used: Float
    used_gb: Float
		first_day: String
    last_day: String
    project_code: String
  }

  "Details of a Dropbox team folder related to a project"
  type DropBoxProject {
    id: Int!
    name: String
    deleted: Int
    editor_group: String,
    team_folder_id_dbx: String
    viewer_group: String
		first_day: String
    last_day: String
    project_code: String
  }
  
  "Details of a Visualisation service related to a project"
  type VisualisationProject {
    id: Int!
    name: String
    deleted: Int
		gear_vr: Int
		holo_lens: Int
		video_based_vis: Int
		vive: Int
		web_based_vis: Int
		first_day: String
    last_day: String
    project_code: String
  }

  "Details of a Nectar allocation related to a project"
  type NectarProject {
    id: Int!
    name: String
    allocation_id_ntr: Int
    core: Int
    cpu_optimised: Int
    database_server: Int
    database_storage: Int
    date: String
    deleted: Int
    division: String
    floating_ip: Int
    instance: Int
    load_balancer: Int
    network: Int
    object_store: Int
    project_id_ntr: String
    ram: Int
    ram_optimised: Int
    router: Int
    shared_fs: Int
    status: String
    volume: Int
		first_day: String
    last_day: String
    project_code: String
  }

  "Details of a Dropbox Service"
  type DropBoxService {
    id: Int!
    name: String
    deleted: Int
    editor_group: String,
    team_folder_id_dbx: String
    viewer_group: String
    "A list of projects related to this dropbox service"
    projects: [ServiceProject]
  }

  "Details of a Visualisation Service"
  type VisualisationService {
    id: Int!
    name: String
    deleted: Int
		gear_vr: Int
		holo_lens: Int
		video_based_vis: Int
		vive: Int
		web_based_vis: Int
    "A list of projects related to this visualisation service"
    projects: [ServiceProject]
  }

  "Details of a Research VM Service"
  type ResearchVMService {
    id: Int!
    name: String
    cpus: Int
    date: String
    deleted: Int
    host: String
    memory_gb: Float
    os: String
    state: String
    total_disk_gb: Float
    uuid: String
    "A list of projects related to this research vm service"
    projects: [ServiceProject]
  }

  "Details of a Research Storage Service"
  type ResearchStorageService {
    id: Int!
    name: String
    allocated_gb: Int
    date: String
    deleted: Int
    division: String
    free_gb: Float
    num_files: Int
    percentage_used: Float
    used_gb: Float
    "A list of projects related to this research storage service"
    projects: [ServiceProject]
  }

  "Details of a Nectar Service"
  type NectarService {
    id: Int!
    name: String
    allocation_id_ntr: Int
    core: Int
    cpu_optimised: Int
    database_server: Int
    database_storage: Int
    date: String
    deleted: Int
    division: String
    floating_ip: Int
    instance: Int
    load_balancer: Int
    network: Int
    object_store: Int
    project_id_ntr: String
    ram: Int
    ram_optimised: Int
    router: Int
    shared_fs: Int
    status: String
    volume: Int
    "A list of projects related to this nectar service"
    projects: [ServiceProject]
  }

  "Details about a project which is associated with a service"
  type ServiceProject {
    id: Int!
    code: String
    first_day: String
    last_day: String
    "Details about the project"
    project: Project
  }
`;

export { typeDefs };
