export interface WpAvatarProps {
  url: string
  width: number
  height: number
}

export interface WpAuthorsProps {
  // eslint-disable-next-line no-unused-vars
  find: (args: any) => any
  name?: string
  description?: string
  slug?: string
  bio?: string
  avatar?: WpAvatarProps
  og?: WpOgProps
  title?: string
}

export interface WpFeaturedImageProps {
  id: string
  sourceUrl: string
  altText: string
  caption?: string
  srcSet?: string
  sizes?: string
}

export interface WpCategoriesProps {
  id: string
  name: string
  slug: string
  description?: string
  og?: WpOgProps
}

export interface WpTagsProps {
  id: string
  name: string
  slug: string
  description?: string
  og?: WpOgProps
}

export interface WpSinglePostProps {
  id: string
  article: string
  title: string
  metaTitle?: string
  description?: string
  slug: string
  excerpt: string
  date: string
  published: string
  modified: string
  content: string
  featuredImage: WpFeaturedImageProps
  categories: WpCategoriesProps[]
  tags: WpTagsProps[]
  author: WpAuthorsProps
  og?: WpOgProps
  uri: string
}

export interface WpPopularPosts {
  slug: string
  views: number
  date: string
  post: WpSinglePostProps
}

export interface WpArticleProps {
  publishedTime?: string
  modifiedTime?: string
}

export interface WpPostsProps {
  slug?: string
  post: WpSinglePostProps
  // eslint-disable-next-line no-unused-vars
  map?(arg0: any): import("react").ReactNode
}

export interface WpSiteProps {
  description: string
  language: string
  title: string
}

export interface WpOgProps {
  title?: string
  description: string
  imageUrl?: string
  imageSecureUrl?: string
  imageWidth?: string
  imageHeight?: string
  url?: string
  type?: string
}

export interface WpTwitterProps {
  title: string
  ImageUrl?: string
  altText?: string
}
