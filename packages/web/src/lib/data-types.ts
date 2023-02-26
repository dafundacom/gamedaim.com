export enum UserDataRole {
  "USER",
  "AUTHOR",
  "ADMIN",
}

export enum PostStatusData {
  "PUBLISHED",
  "DRAFT",
  "REJECTED",
  "IN_REVIEW",
}

export enum DownloadTypeData {
  "App",
  "Game",
}

export enum DownloadSchemaTypeData {
  "DownloadApp",
  "BusinessApp",
  "MultimediaApp ",
  "MobileAp ",
  "WebApp",
  "SocialNetworkingApp",
  "TravelApp",
  "ShoppingApp",
  "SportsApp",
  "LifeStyleApp",
  "DesignApp",
  "DeveloperApp",
  "DriverApp",
  "EducationalApp",
  "HealthApp",
  "FinanceApp",
  "SecurityApp",
  "BrowserApp",
  "CommunicationApp",
  "HomeApp",
  "UtilitiesApp",
  "RefereceApp",
  "GameApp",
}

export enum AdPositionData {
  "ABOVE_POST",
  "INLINE_POST",
  "BELOW_POST",
  "POP_UP",
}

export interface ArticleDataProps {
  [x: string]: any
  id: string
  title: string
  content: string
  excerpt: string
  slug: string
  meta_title: string
  meta_description: string
  author: UserDataProps
  topics: TopicDataProps
  comments?: CommentDataProps
  featuredImage: MediaDataProps
  status: PostStatusData
  createdAt: string
  updatedAt: string
}

export interface ArticlesDataProps {
  [x: string]: any
  articles: {
    [x: string]: any
    article: ArticlesDataProps
  }
}

export interface TopicDataProps {
  id: string
  title: string
  slug: string
  description: string
  meta_title: string
  meta_description: string
  featuredImage?: MediaDataProps
  author: UserDataProps
  articles: ArticleDataProps
  downloads?: DownloadDataProps
  createdAt: string
  _count: {
    articles: number
    downloads: number
  }
  updatedAt: string
}

export interface TopicsDataProps {
  topics: TopicDataProps
}

export interface MediaDataProps {
  id: string
  name: string
  url: string
  type: string
  description: string
  alt: string
  author: MediaDataProps
  downloads?: DownloadDataProps
  topics?: TopicDataProps
  users?: UserDataProps
  createdAt: string
  updatedAt: string
}

export interface UserDataProps {
  id: string
  email: string
  username: string
  name: string
  about: string
  phoneNumber: string
  profilePicture: MediaDataProps
  meta_title: string
  meta_description: string
  role: UserDataRole
  articles?: ArticleDataProps
  topics?: TopicDataProps
  medias?: MediaDataProps
  downloads?: DownloadDataProps
  downlaodFiles?: DownloadFileDataProps
  comments?: CommentDataProps
  wpComments?: WpCommentDataProps
  ads?: AdDataProps
  script?: ScriptDataProps
  createdAt: string
  updatedAt: string
}

export interface CommentDataProps {
  id: string
  content: string
  articles?: ArticleDataProps
  downloads?: DownloadDataProps
  author: UserDataProps
  createdAt: string
  updatedAt: string
}

export interface WpCommentDataProps {
  id: string
  content: string
  wpPostId: string
  author: UserDataProps
  createdAt: string
  updatedAt: string
}

export interface DownloadDataProps {
  [x: string]: any
  id: string
  title: string
  content: string
  excerpt: string
  slug: string
  meta_title: string
  meta_description: string
  topics: TopicDataProps
  commets?: CommentDataProps
  downloadFiles?: DownloadFileDataProps
  featuredImage: MediaDataProps
  author: UserDataProps
  developer: string
  operationSystem: string
  license: string
  officialWeb: string
  schemaType: DownloadSchemaTypeData
  type: DownloadTypeData | string
  status: PostStatusData
  createdAt: string
  updatedAt: string
}

export interface DownloadFileDataProps {
  id: string
  title: string
  slug: string
  meta_title: string
  meta_description: string
  featuredImage: MediaDataProps
  author: UserDataProps
  downloads?: DownloadDataProps
  version: string
  downloadLink: string
  fileSize: string
  currency: string
  price: string
  status: PostStatusData
  createdAt: string
  updatedAt: string
}

export interface AdDataProps {
  id: string
  title: string
  content: string
  position: AdPositionData
  active: boolean
  author: UserDataProps
  createdAt: string
  updatedAt: string
}

export interface ScriptDataProps {
  id: string
  title: string
  content: string
  active: boolean
  author: UserDataProps
  createdAt: string
  updatedAt: string
}

export interface SettingDataProps {
  id: string
  key: string
  value: string
  createdAt: string
  updatedAt: string
}
