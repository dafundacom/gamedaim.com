export interface WpAvatarDataProps {
  url: string
  width: number
  height: number
}

export interface WpAuthorsDataProps {
  find: (args: any) => any
  name: string
  description?: string
  slug: string
  bio: string
  avatar: WpAvatarDataProps
  og: WpOgDataProps
  title: string
  uri: string
}

export interface WpFeaturedImageDataProps {
  id: string
  sourceUrl: string
  altText: string
  caption: string
  srcSet: string
  sizes: string
}

export interface WpCategoriesDataProps {
  seo: any
  id: string
  name: string
  children: any
  slug: string
  description?: string
  og: WpOgDataProps
}

export interface WpTagsDataProps {
  seo: any
  map(arg0: (tag: import("@/../../ui").TagProps) => string | undefined): string
  id: string
  name: string
  slug: string
  description?: string
  og: WpOgDataProps
}

export interface WpSinglePostDataProps {
  id: string
  article: string
  title: string
  metaTitle: string
  description: string
  slug: string
  excerpt: string
  date: string
  seo: any
  published: string
  modified: string
  content: string
  featuredImage: WpFeaturedImageDataProps
  categories: WpCategoriesDataProps
  tags: WpTagsDataProps
  author: WpAuthorsDataProps
  authorUrl: string
  authorImg: string
  authorName: string
  featuredImageCaption: string
  featuredImageUrl: string
  featuredImageAlt: string
  uri: string
}
export interface WpPopularPosts {
  slug: string
  views: number
  date: string
  post: WpSinglePostDataProps
}

export interface WpArticleDataProps {
  publishedTime: string
  modifiedTime: string
}

export interface WpPostsDataProps {
  [x: string]: any
  slug: string
  post: WpSinglePostDataProps
}

export interface WpSiteDataProps {
  description: string
  language: string
  title: string
}

export interface WpOgDataProps {
  title: string
  description: string
  imageUrl: string
  imageSecureUrl: string
  imageWidth: string
  imageHeight: string
  url: string
  type: string
}

export interface WpTwitterDataProps {
  title: string
  ImageUrl: string
  altText: string
}
