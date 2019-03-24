import gql from "graphql-tag"

export const register = gql`
  mutation register(
    $email: String!
    $password1: String!
    $password2: String!
    $firstName: String!
    $lastName: String!
  ) {
    register(
      email: $email
      password1: $password1
      password2: $password2
      firstName: $firstName
      lastName: $lastName
    ) {
      error {
        __typename
        ... on ValidationErrors {
          validationErrors {
            field
            messages
          }
        }
      }
      success
      token
      user {
        id
        email
        firstName
        lastName
      }
    }
  }
`

export const login = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      error {
        __typename
        ... on ValidationErrors {
          validationErrors {
            field
            messages
          }
        }
      }
      token
      user {
        id
        email
        firstName
      }
    }
  }
`

export const editUser = gql`
  mutation editUser($firstName: String, $email: String!, $avatar: String) {
    editUser(firstName: $firstName, email: $email, avatar: $avatar) {
      error {
        __typename
        ... on ValidationErrors {
          validationErrors {
            field
            messages
          }
        }
      }
      user {
        id
        firstName
        email
        avatar
      }
    }
  }
`

export const verifyToken = gql`
  mutation verifyToken($token: String!) {
    verifyToken(token: $token) {
      payload
    }
  }
`

export const getUsers = gql`
  query getUsers($role: String, $skip: Boolean!) {
    users(role: $role) @skip(if: $skip) {
      id
      firstName
      email
      phone
      role
      color
    }
  }
`
export const createProject = gql`
  mutation createProject(
    $name: String!
    $value: Float!
    $number: String!
    $superintendentId: Int
    $managerId: Int!
    $projectId: Int!
    $startDate: DateTime!
    $endDate: DateTime!
    $unassigned: Boolean!
  ) {
    createProject(
      name: $name
      value: $value
      number: $number
      superintendentId: $superintendentId
      managerId: $managerId
      projectId: $projectId
      startDate: $startDate
      endDate: $endDate
      unassigned: $unassigned
    ) {
      project {
        id
        name
        superintendent {
          id
        }
        company {
          id
        }
        value
        number
        contact {
          id
        }
        architect {
          id
        }
        constructionManager {
          id
        }
        mep {
          id
        }
        manager {
          id
        }
        assistantManager {
          id
        }
      }
      superintendentHasProject
    }
  }
`

export const getProject = gql`
  query getProject($projectId: Int, $skip: Boolean!) {
    getProject(projectId: $projectId) @skip(if: $skip) {
      id
      name
      startDate
      endDate
      phase
      address {
        id
        line1
      }
      superintendent {
        id
        firstName
        lastName
        email
        phone
        company {
          id
          name
        }
      }
      manager {
        id
        firstName
        lastName
        email
        phone
        color
      }
      company {
        id
        name
      }
      value
      number
      contact {
        id
        firstName
        lastName
      }
      architect {
        id
        firstName
        lastName
      }
      constructionManager {
        id
        firstName
        lastName
      }
      mep {
        id
        firstName
        lastName
      }
      assistantManager {
        id
        firstName
        lastName
      }
      changesList
      history
    }
  }
`

export const confirmEmail = gql`
  mutation confirmEmail($email: String!) {
    confirmEmail(email: $email) {
      success
      error {
        __typename
        ... on ValidationErrors {
          validationErrors {
            field
            messages
          }
        }
      }
    }
  }
`

export const resetPassword = gql`
  mutation resetPassword(
    $newPassword1: String!
    $newPassword2: String!
    $confirmToken: String!
    $userId: Int!
  ) {
    resetPassword(
      newPassword1: $newPassword1
      newPassword2: $newPassword2
      confirmToken: $confirmToken
      userId: $userId
    ) {
      success
      error {
        __typename
        ... on ValidationErrors {
          validationErrors {
            field
            messages
          }
        }
      }
    }
  }
`

export const addresses = gql`
  query addresses {
    addresses {
      id
      line1
      line2
      city
      state
    }
  }
`

export const companies = gql`
  query companies {
    companies {
      id
      name
      address {
        id
        line1
        line2
        city
        state
      }
      phone
    }
  }
`

export const projects = gql`
  query projects {
    projects {
      id
      name
      startDate
      endDate
      phase
      superintendent {
        id
        firstName
        lastName
      }
      manager {
        id
        firstName
        lastName
        color
      }
    }
  }
`

export const updateProject = gql`
  mutation updateProject(
    $projectId: Int!
    $managerId: Int!
    $superintendentId: Int
    $startDate: DateTime
    $endDate: DateTime
  ) {
    updateProject(
      projectId: $projectId
      managerId: $managerId
      superintendentId: $superintendentId
      startDate: $startDate
      endDate: $endDate
    ) {
      project {
        id
        name
        superintendent {
          id
          firstName
          lastName
        }
        manager {
          id
          firstName
        }
      }
      superintendentHasProject
    }
  }
`

export const getPersons = gql`
  query persons($role: String, $skip: Boolean!) {
    persons(role: $role) @skip(if: $skip) {
      id
      firstName
      lastName
      role
      cell
      phone
      company {
        id
        name
        phone
      }
      title
      projects {
        id
        name
        superintendent {
          id
          firstName
          lastName
        }
        manager {
          id
          firstName
          lastName
          color
        }
        startDate
        endDate
        phase
      }
    }
  }
`

export const undoLastProjectChange = gql`
  mutation undoLastProjectChange($projectId: ID!, $skip: Boolean!) {
    undoLastProjectChange(projectId: $projectId) @skip(if: $skip) {
      errors
      success
    }
  }
`

export const pendingChangesProjects = gql`
  query pendingChangesProjects {
    pendingChangesProjects {
      id
      name
      manager {
        id
        firstName
        lastName
      }
      superintendent {
        id
        firstName
        lastName
      }
      startDate
      endDate
    }
  }
`

export const approveProjectChanges = gql`
  mutation approveProjectChanges($projectId: ID!, $approve: Boolean!) {
    approveProjectChanges(projectId: $projectId, approve: $approve) {
      errors
      success
    }
  }
`
export const me = gql`
  query me {
    me {
      id
      firstName
      lastName
      email
      avatar
      role
    }
  }
`

export const pendingCreationProjects = gql`
  query pendingCreationProjects {
    pendingCreationProjects {
      id
      name
      manager {
        id
        firstName
        lastName
      }
      superintendent {
        id
        firstName
        lastName
      }
      startDate
      endDate
    }
  }
`

export const approveProjectCreation = gql`
mutation approveProjectCreation($approve: Boolean!, $projectId: ID!) {
  approveProjectCreation(approve: $approve, projectId: $projectId) {
    success
    errors
  }
}
`
