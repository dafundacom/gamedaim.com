export const QUERY_WP_ALL_CATEGORIES = `
  {
    categories(first: 25) {
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
          seo {
            breadcrumbTitle
            canonicalUrl
            description
            title
            jsonLd {
              raw
            }
          }
          name
          slug
          children {
          nodes {
          uri
          taxonomyName
          name
          slug
               }
           }
        }
      }
    }
  }
`
