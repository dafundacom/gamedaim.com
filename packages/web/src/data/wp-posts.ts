export const QUERY_WP_ALL_POSTS = `
  query AllPosts {
    posts(first: 10) {
      pageInfo {
        hasNextPage
        endCursor
      }
      edges {
        node {
          author {
            node {
              avatar {
                height
                url
                width
              }
              id
              name
              slug
              uri
            }
          }
          id
          categories {
            edges {
              node {
                categoryId
                id
                name
                slug
                parent {
                  node {
                    id
                  }
                }
              }
            }
          }
          date
          excerpt
          featuredImage {
            node {
              altText
              caption
              sourceUrl
              srcSet
              sizes
              id
            }
          }
          modified
          postId
          title
          slug
          uri
        }
      }
    }
  }
`

export const QUERY_WP_ALL_SLUG = `
query AllSlug($after: String) {
  posts(after: $after, first: 100) {
    pageInfo {
      endCursor
      hasNextPage
    }
    edges {
      node {
        slug
        categories {
          edges {
            node {
              slug
              parent {
                node {
                  id
                }
              }
            }
          }
        }
      }
    }
  }
}
`

export const QUERY_WP_ALL_POSTS_LOAD_MORE = `
  query AllPosts($after : String) {
    posts(first: 10, after: $after) {
      pageInfo {
        hasNextPage
        endCursor
      }
      edges {
        node {
          author {
            node {
              avatar {
                height
                url
                width
              }
              id
              name
              slug
              uri
            }
          }
          id
          categories {
            edges {
              node {
                categoryId
                id
                name
                slug
                parent {
                  node {
                    id
                  }
                }
              }
            }
          }
          date
          excerpt
          featuredImage {
            node {
              altText
              caption
              sourceUrl
              srcSet
              sizes
              id
            }
          }
          modified
          postId
          title
          slug
          uri
        }
      }
    }
  }
`

export const QUERY_WP_POST_BY_SLUG = `
  query PostBySlug($slug: ID!) {
    post(id: $slug, idType: SLUG) {
      author {
        node {
          avatar {
            height
            url
            width
          }
          id
          name
          slug
        }
      }
      id
      categories {
        edges {
          node {
            categoryId
            id
            name
            slug
            children {
                nodes {
                  id
                  slug
                  name
                }
              }
            parent {
                  node {
                    id
                  }
                }
          }
        }
      }
      tags {
        edges {
          node {
            tagId
            id
            name
            slug
          }
        }
      }
      content
      date
      excerpt
      featuredImage {
        node {
          altText
          caption
          sourceUrl
          srcSet
          sizes
          id
        }
      }
      modified
      postId
      title
      slug
      uri
    }
  }
`

export const QUERY_WP_POSTS_BY_CATEGORY_SLUG = `
  query PostsByCategoryId($categoryId: String, $after: String) {
    posts(where: { categoryName: $categoryId }, after: $after, first: 12) {
      pageInfo {
        hasNextPage
        endCursor
      }
      edges {
        node {
          author {
            node {
              avatar {
                height
                url
                width
              }
              id
              name
              slug
              uri
            }
          }
          id
          categories {
            edges {
              node {
                categoryId
                id
                name
                slug
                parent {
                  node {
                    id
                  }
                }
              }
            }
          }
          tags {
            edges {
              node {
                tagId
                id
                name
                slug
                
              }
            }
          }
          content
          date
          excerpt
          featuredImage {
            node {
              altText
              caption
              id
              sizes
              sourceUrl
              srcSet
            }
          }
          modified
          postId
          title
          slug
          uri
        }
      }
    }
  }
`

export const QUERY_WP_POSTS_BY_TAG_SLUG = `
  query PostsByTagSlug($id: ID!, $after: String ) {
  tag(id:$id,idType: SLUG) {
     posts(after: $after, first: 10) {
       pageInfo {
         endCursor
         hasNextPage
       }
      edges {
        node {
          author {
            node {
              avatar {
                height
                url
                width
              }
              id
              name
              slug
              uri
            }
          }
          id
          categories {
            edges {
              node {
                categoryId
                id
                name
                slug
                parent {
                  node {
                    id
                  }
                }
              }
            }
          }
          content
          date
          excerpt
          featuredImage {
            node {
              altText
              caption
              id
              sizes
              sourceUrl
              srcSet
            }
          }
          modified
          postId
          title
          slug
          uri
        }
      }
    }
  }
}
`

export const QUERY_WP_POSTS_BY_AUTHOR_SLUG = `
  query PostByAuthorSlug($slug: String, $after: String) {
    posts(where: { authorName: $slug }, first: 10, after: $after) {
      pageInfo {
        endCursor
        hasNextPage
      }
      edges {
        node {
          categories {
            edges {
              node {
                categoryId
                id
                name
                slug
                parent {
                  node {
                    id
                  }
                }
              }
            }
          }
          date
          author {
            node {
              avatar {
                height
                url
                width
              }
              id
              name
              slug
              uri
            }
          }
          excerpt
          featuredImage {
            node {
              altText
              caption
              id
              sizes
              sourceUrl
              srcSet
            }
          }
          id
          modified
          postId
          slug
          uri
          title
        }
      }
    }
  }
`

export const QUERY_WP_POST_PER_PAGE = `
  query PostPerPage {
    allSettings {
      readingSettingsPostsPerPage
    }
  }
`

export const QUERY_WP_SEARCH_POSTS = `
  query SearchPosts($search: String!) {
    posts(first: 10, where: {search: $search}) {
      edges {
        node {
          author {
            node {
              avatar {
                height
                url
                width
              }
              id
              name
              slug
              uri
            }
          }
          id
          categories {
            edges {
              node {
                categoryId
                id
                name
                slug
                parent {
                  node {
                    id
                  }
                }
              }
            }
          }
          content
          date
          excerpt
          featuredImage {
            node {
              altText
              caption
              sourceUrl
              srcSet
              sizes
              id
            }
          }
          modified
          postId
          title
          slug
          uri
        }
      }
    }
  }
`
