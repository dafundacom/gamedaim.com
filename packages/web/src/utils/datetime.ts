import { formatDistance } from "date-fns"

function formatDate(date: any) {
  return formatDistance(new Date(date), new Date(), {
    addSuffix: true,
  })
}

function sortObjectsByDate(array: any[], { key = "date" } = {}) {
  return array.sort((a, b) => +new Date(b[key]) - +new Date(a[key]))
}
function cleanDate(date: string) {
  let formattedDate: string
  let formattedDate2
  formattedDate = formatDate(date)
  if (formattedDate.includes("about") === true) {
    formattedDate2 = formattedDate.replace("about", "")
    return formattedDate2
  }
  return formattedDate
}
export { formatDate, sortObjectsByDate, cleanDate }
