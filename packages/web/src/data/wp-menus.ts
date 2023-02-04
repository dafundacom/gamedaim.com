import env from "@/env"

export const Wp_PrimaryMenus = `query PrimaryMenus {
  menu(id: "${env.MENU_PRIMARY}", idType: NAME) {
    menuItems {
      edges {
        node {
          url
          label
        }
      }
    }
  }
}`

export const WP_GetMenusByName = `query WP_GetMenusByName($id: ID!) {
  menu(id: $id, idType: NAME) {
    menuItems {
      edges {
        node {
          url
          label
        }
      }
    }
  }
}`
