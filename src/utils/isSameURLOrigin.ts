import isValidURL from "./isValidURL";

/**
 * Checks if two URLs share the same origin.
 *
 * @param a - The first URL to be compared.
 * @param b - The second URL to be compared.
 * @throws {Error} Throws an error if one or both of the provided URLs are not valid.
 * @returns A boolean indicating whether the origins of the two URLs are the same.
 */
export const isSameURLOrigin = (a: string, b: string) => {
  if (!isValidURL(a) && !isValidURL(b)) {
    throw new Error("One or more passed arguments is not a valid URL.");
  }

  const urlA = new URL(a);
  const urlB = new URL(b);
  
  return urlA.origin === urlB.origin;
};
