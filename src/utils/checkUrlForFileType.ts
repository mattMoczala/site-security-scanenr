/**
 * Asynchronously checks the provided URL to determine if the associated file type matches the specified type.
 *
 * @param url - The URL to be checked.
 * @param fileType - The expected file type, e.g., "text/html".
 * @returns A Promise that resolves to a boolean indicating whether the file type matches the expected type.
 */
export const checkUrlForFileType = async (
  url: string,
  fileType: "text/html"
): Promise<boolean> => {
  return new Promise(async (resolve) => {
    try {
      /**
       * Fetches the URL using the HEAD method to retrieve only the headers.
       */
      const response = await fetch(url, { method: "HEAD" });

      if (response.ok) {
        /**
         * Retrieves the "content-type" header from the response.
         */
        const contentType = response.headers.get("content-type");

        /**
         * Resolves to true if the content type includes the expected file type; otherwise, resolves to false.
         */
        resolve(contentType?.toLowerCase().includes(fileType) || false);
      } else {
        /**
         * Handles non-OK responses by logging an error and resolving to false.
         */
        console.error(`Error fetching ${url}: ${response.statusText}`);
        resolve(false);
      }
    } catch (error) {
      /**
       * Handles fetch errors by logging an error and resolving to false.
       */
      console.error(`Error fetching ${url}: ${error}`);
      resolve(false);
    }
  });
};
