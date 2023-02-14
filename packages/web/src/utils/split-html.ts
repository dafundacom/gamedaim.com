const parseHTMLString = (htmlString: string) => {
  return htmlString
    .split("</p>")
    .map((htmlString) => htmlString + "</p>")
    .filter((html) => html !== "</p>")
    .filter((html) => html !== "<p></p>")
}

const splitHTMLArrayToHalf = (htmlList: string[]) => {
  const half = Math.ceil(htmlList.length / 2)
  const firstHalfMarkupList = htmlList.slice(0, half)
  const secondHalfMarkupList = htmlList.slice(-half)
  let firstHalfHTMLString = ""
  let secondHalfHTMLString = ""

  /**
   * If the last value of firstHalfList equal to first value of secondHalfList
   * remove the first value of secondHalfList
   */
  if (
    firstHalfMarkupList[firstHalfMarkupList.length - 1] ===
    secondHalfMarkupList[0]
  ) {
    secondHalfMarkupList.shift()
  }

  firstHalfHTMLString = firstHalfMarkupList.join("")
  secondHalfHTMLString = secondHalfMarkupList.join("")

  return {
    firstHalfHTMLString,
    secondHalfHTMLString,
  }
}

type FunctionReturn = {
  firstHalf: string
  secondHalf: string
}

export const parseAndSplitHTMLString = (markup: string): FunctionReturn => {
  //   const sanitizedMarkup = sanitizeHTMLString(markup)
  const markupList = parseHTMLString(markup)

  const { firstHalfHTMLString, secondHalfHTMLString } =
    splitHTMLArrayToHalf(markupList)

  return {
    firstHalf: firstHalfHTMLString,
    secondHalf: secondHalfHTMLString,
  }
}
