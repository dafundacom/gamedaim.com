export const QUERY_WP_ALL_TAGS = `
  {
    tags(first: 10) {
      edges {
        node {
          tagId
          description
          id
          name
          slug
        }
      }
    }
  }
`

export const QUERY_WP_ALL_TAGS_SITEMAP = `
 {
    tags(first: 10) {
      edges {
        node {
          tagId
          description
          id
          name
          slug
        }
      }
    }
  }
  `

export const QUERY_WP_TAG_BY_SLUG = `
  query TagBySlug($slug: [String]) {
    tags(where: { slug: $slug }, first: 1000) {
      edges {
        node {
          tagId
          description
          id
          name
          uri
          slug
        }
      }
    }
  }
`
