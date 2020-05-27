import { gql } from 'apollo-server-lambda';

const typeDefs = gql`
    type Query {
        hello: String
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
        projects: [Project]
        properties: [PersonProperty]
        start_date: String
        status: PersonStatus
    }

    type Project {
        id: Int!
        description: String
        division: String
        end_date: String
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
        services: [Service]
    }

    type Service {
        type: String
        info: String
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
    }

    type ResearchVM {
        id: Int!
    }

    type ResearchStorage {
        id: Int!
    }

    type DropBox {
        id: Int!
    }

    type Visualisation {
        id: Int!
    }

    type Nectar {
        id: Int!
    }

    type MyTardis {
        id: Int!
    }
`;

export { typeDefs };
