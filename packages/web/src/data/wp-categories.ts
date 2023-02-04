export const QUERY_WP_ALL_CATEGORIES = `
  {
    categories(first: 100) {
      edges {
        node {
          categoryId
          description
          id
          name
          slug
        }
      }
    }
  }
`

export const QUERY_WP_ALL_CATEGORIES_SITEMAP = `
  {
    categories(first: 1000) {
      edges {
        node {
          categoryId
          description
          id
          name
          slug
        }
      }
    }
  }
`

export const QUERY_WP_CATEGORY_BY_SLUG = `
  query CategoryBySlug($slug: [String]) {
    categories(where: { slug: $slug }, first: 1000) {
      edges {
        node {
          categoryId
          description
          id
          name
          slug
          children {
          nodes {
          uri
          name
          slug
               }
           }
        }
      }
    }
  }
`
