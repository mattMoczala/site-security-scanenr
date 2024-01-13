/**
 * Validates whether the provided string is a valid URL.
 *
 * @param urlString - The string to be checked for URL validity.
 * @returns A boolean indicating whether the provided string is a valid URL.
 */
export default (urlString: string) => {
  if (urlString.indexOf("localhost") !== -1) {
    return true
  }
  var urlPattern = new RegExp(
    "^(https?:\\/\\/)?" + // validate protocol
      "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // validate domain name
      "((\\d{1,3}\\.){3}\\d{1,3}))" + // validate OR ip (v4) address
      "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // validate port and path
      "(\\?[;&a-z\\d%_.~+=-]*)?" + // validate query string
      "(\\#[-a-z\\d_]*)?$",
    "i"
  ); // validate fragment locator
  return !!urlPattern.test(urlString);
};
