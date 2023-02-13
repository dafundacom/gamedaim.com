export const trimText = (text: string, maxLength: number): string => {
  const strippedText = text.replace(/(<([^>]+)>)/gi, "")

  if (strippedText.length <= maxLength) {
    return strippedText
  }

  return strippedText.substring(0, maxLength)
}
