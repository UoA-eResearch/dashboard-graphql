import { gql } from 'apollo-server-lambda';

const typeDefs = gql`
  type Query {
    user(username: String!): Person
    person(id: Int!): Person
    project(id: Int!): Project
    dropbox(id: Int!): DropBox
    visualisation(id: Int!): Visualisation
    researchvm(id: Int!): [ResearchVMHistory]
    researchstorage(id: Int!): [ResearchStorageHistory]
    nectar(id: Int!): [NectarHistory]
  }

  type Person {
    id: Int!
    divisions: [Division]
    email: String
    end_date: String
    full_name: String
    identities: [Identity]
    last_modified: String
    notes: String
    phone: String
    preferred_name: String
    projects: [ProjectOfPerson]
    properties: [PersonProperty]
    start_date: String
    status: PersonStatus
  }

  type ProjectOfPerson {
    id: Int!
    notes: String
    project: Project
    role: Role
  }

  type Project {
    id: Int!
    creation_date: String
    # keep this out until more fine-grained auth is implemented:
    # description: String
    division: String
    end_date: String
    external_references: [ExternalReference]
    last_modified: String
    next_review_date: String,
    notes: String
    requirements: String
    start_date: String
    title: String
    todo: String
    actions: [Action]
    codes: [Code]
    members: [ProjectMember]
    properties: [ProjectProperty]
    research_outputs: [ResearchOutput]
    status: ProjectStatus
    services: ProjectServices
  }

  type ProjectServices {
    dropbox: [DropBox]
    nectar: [Nectar]
    research_drive: [ResearchStorage]
    vis: [Visualisation]
    vm: [ResearchVM]
  }

  type ProjectMember {
    id: Int!
    notes: String
    person: Person
    role: Role
  }

  type ProjectProperty {
    id: Int!
    propname: String
    propvalue: String
    timestamp: String
  }

  type PersonProperty {
    id: Int!
    propname: String
    propvalue: String
    timestamp: String
  }

  type ExternalReference {
    id: Int!
    date: String
    project_id: Int
    reference: String
    description: String
  }

  type Action {
    id: Int!
    action_type: ActionType
    date: String
    notes: String
    person: Person
  }

  type ActionType {
    id: Int!
    name: String
  }

  type Code {
    id: Int!
    code: String
  }

  type ProjectStatus {
    id: Int!
    name: String
  }

  type PersonStatus {
    id: Int!
    name: String
  }

  type Role {
    id: Int!
    name: String
  }

  type Identity {
    id: Int!
    username: String
  }

  type Division {
    id: Int!
    division: String
    divisional_role: DivisionalRole
    external: String
  }

  type DivisionalRole {
    id: Int!
    name: String
  }

  type ResearchOutput {
    id: Int!
    researchoutput: ResearchOutputInfo
  }

  type ResearchOutputInfo {
    id: Int!
    date_reported: String
    description: String
    doi: String
    type: ResearchOutputType
    uri: String
  }

  type ResearchOutputType {
    id: Int!
    name: String
  }

  type ResearchVM {
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

  type ResearchStorage {
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

  type DropBox {
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

  type Visualisation {
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

  type Nectar {
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

  type ResearchVMHistory {
    vm_id: Int!
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
  }

  type ResearchStorageHistory {
    drive_id: Int!
    name: String
    allocated_gb: Int
    date: String
    deleted: Int
    division: String
    free_gb: Float
    num_files: Int
    percentage_used: Float
    used_gb: Float
  }

  type NectarHistory {
    service_id: Int!
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
  }
`;

export { typeDefs };
