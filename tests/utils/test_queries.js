import { gql } from 'apollo-server-lambda';

export const GET_USER = gql`
query Person($username: String!) {
  user(username: $username) {
    id
    full_name
  }
}`;

export const GET_PERSON = gql`
query Person($id: Int!) {
  person(id: $id) {
    full_name
  }
}`;

export const GET_PROJECT = gql`
query Project($id: Int!) {
  project(id: $id) {
    title
  }
}`;

export const GET_DROPBOX = gql`
query DropBoxService($id: Int!) {
  dropbox(id: $id) {
    name
  }
}`;

export const GET_VIS = gql`
query VisualisationService($id: Int!) {
  visualisation(id: $id) {
    name
  }
}`;

export const GET_VM = gql`
query ResearchVMService($id: Int!) {
  researchvm(id: $id) {
    name
  }
}`;

export const GET_STORAGE = gql`
query ResearchStorageService($id: Int!) {
  researchstorage(id: $id) {
    name
  }
}`;

export const GET_NECTAR = gql`
query NectarService($id: Int!) {
  nectar(id: $id) {
    name
  }
}`;

export const GET_ALL_INFO_OF_A_PERSON = gql`
query Person($id: Int!) {
  person(id: $id) {
    id
    divisions {
      id
      division
      divisional_role {
        id
        name
      }
      external
    }
    email
    end_date
    full_name
    identities {
      id
      username
    }
    last_modified
    notes
    phone
    preferred_name
    projects {
      id
      notes
      project {
        id
      }
      role {
        id
        name
      }
    }
    properties {
      id
      propname
      propvalue
      timestamp
    }
    start_date
    status {
      id
      name
    }
  }
}`;

export const GET_ALL_INFO_OF_A_PROJECT = gql`
query Project($id: Int!) {
  project(id: $id) {
    id
    creation_date
    division
    end_date
    external_references {
      id
      date
      project_id
      reference
      description
    }
    last_modified
    next_review_date
    notes
    requirements
    start_date
    title
    todo
    actions {
      id
      action_type {
        id
        name
      }
      date
      notes
      person {
        id
      }
    }
    codes {
      id
      code
    }
    members {
      id
      notes
      person {
        id
      }
      role {
        id
        name
      }
    }
    properties {
      id
      propname
      propvalue
      timestamp
    }
    research_outputs {
      id
      researchoutput {
        id
        date_reported
        description
        doi
        type {
          id
          name
        }
        uri
      }
    }
    status {
      id
      name
    }
    services {
      dropbox {
        id
      }
      nectar {
        id
      }
      research_drive {
        id
      }
      vis {
        id
      }
      vm {
        id
      }
    }
  }
}`;

export const QUERY_DEPTH_OVER_5 = gql`
query Project($id: Int!) {
  project(id: $id) {
    id
    members {
      id
      person {
        id
        projects {
          project {
            id
            members {
              id
              person {
                id
              }
            }
          }
        }
      }
    }
  }
}`;

export const GET_VM_PROJECTS = gql`
query ResearchVMService($id: Int!) {
  researchvm(id: $id) {
    name
    projects {
      id
      project {
        id
      }
    }
  }
}`;

export const GET_STORAGE_PROJECTS = gql`
query ResearchStorageService($id: Int!) {
  researchstorage(id: $id) {
    name
    projects {
      id
      project {
        id
      }
    }
  }
}`;

export const GET_NECTAR_PROJECTS = gql`
query NectarService($id: Int!) {
  nectar(id: $id) {
    name
    projects {
      id
      project {
        id
      }
    }
  }
}`;

export const GET_DROPBOX_PROJECTS = gql`
query DropBoxService($id: Int!) {
  dropbox(id: $id) {
    name
    projects {
      id
      project {
        id
      }
    }
  }
}`;

export const GET_VIS_PROJECTS = gql`
query VisualisationService($id: Int!) {
  visualisation(id: $id) {
    name
    projects {
      id
      project {
        id
      }
    }
  }
}`;

export const GET_ALL_PROJECTS = gql`
query Projects {
  projects {
    id
  }
}`;

export const GET_ALL_PEOPLE = gql`
query People {
  people {
    id
  }
}`;
