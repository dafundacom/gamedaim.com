export const QUERY_WP_ALL_USERS = `
  {
    users(first: 100) {
      edges {
        node {
          avatar {
            height
            width
            url
          }
          description
          id
          name
          roles {
            nodes {
              name
            }
          }
          slug
        }
      }
    }
  }
`

export const QUERY_WP_ALL_USERS_SLUG = `
  {
  users(first: 10) {
    edges {
      node {
        id
        slug
      }     
    }
  }
}
`

export const QUERY_WP_USERS_BY_ID = `
  query AuthorId($id: String){
    user(id: $id) {
          avatar {
            height
            width
            url
          }
          description
          id
          name
          roles {
            nodes {
              name
            }
          }
          slug
        
    }
  }
`
