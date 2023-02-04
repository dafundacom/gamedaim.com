declare global {
  export interface Window {
    adsbygoogle: any
    gtag: any
  }

  export interface Env {
    [key: string]: string | undefined
  }

  /* eslint-disable no-unused-vars */
  declare module NodeJS {
    interface Process extends NodeJS.Process {
      browser?: string
    }
  }
}
