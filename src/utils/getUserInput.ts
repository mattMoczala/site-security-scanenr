import readline from "readline";

/**
 * Prompts the user with a query and captures their input from the command line.
 *
 * @param query - The question or prompt presented to the user.
 * @returns A Promise that resolves to the user's input as a string.
 */
export const getUserInput = (query: string): Promise<string> => {

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) =>
    rl.question(query, (ans) => {
      rl.close();
      resolve(ans);
    })
  );
};
