export const removeEmojis = (str: string) => {
  return str.replace(/[\u{1F600}-\u{1F64F}]/gu, '')
}
