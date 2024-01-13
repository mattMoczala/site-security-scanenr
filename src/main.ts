import { getUserInput } from "./utils/getUserInput";
import { scanSiteVulnerabilities } from "./scanSiteVulnerabilities";
import { Crawler } from "./Crawler";
import isValidUrl from "./utils/isValidURL";
import { ConsoleMessages } from "./Messages/ConsoleMessages";
import chalk from "chalk";

/**
 * Asks the user to input a target URL, validates it, and returns a Promise with the validated URL.
 * @returns A Promise resolving to the validated target URL.
 */
const askUserForUrl = (): Promise<string> => {
  return new Promise<string>(async (resolve) => {
    const userInput = await getUserInput("Target URL: ");
    if (typeof userInput === "string") {
      if (isValidUrl(userInput)) {
        if (userInput.startsWith("http")) {
          resolve(userInput);
        } else {
          resolve("https://" + userInput);
        }
      } else {
        ConsoleMessages.printInvalidUrl();
        resolve(await askUserForUrl());
      }
    } else {
      ConsoleMessages.printInvalidUrl();
      resolve(await askUserForUrl());
    }
  });
};

askUserForUrl().then(async (userInputUrl) => {
  const userInputCrawl = await getUserInput("Crawl site for sublinks? (y/n): ");
  if (typeof(userInputCrawl) === "string") {
    if (userInputCrawl.toLowerCase() === 'y' || userInputCrawl.toLowerCase() === 'yes') {
      const userInputCrawlAmount = await getUserInput("Crawl depth (number): ");
      if (typeof(userInputCrawlAmount) === "string") {
        const parsedCrawlAmount = parseInt(userInputCrawlAmount);
        if (!isNaN(parsedCrawlAmount)) {
          const crawler = new Crawler(userInputUrl, true);
          const crawledLinks = await crawler.crawlForSameOriginLinks(parsedCrawlAmount);
          console.log('Unique Crawled Links:', crawledLinks);
          console.log('Running vulnerability scan in 5 seconds...');
          setTimeout(async () => {
            console.clear();
            for (const link of crawledLinks) {
              await scanSiteVulnerabilities(link);
            }
            console.log("\n\n"+chalk.bold('Security scan completed.'))
          }, 5000);
        }
      }
    } else {
      ConsoleMessages.printWebsiteScanIntro(userInputUrl);
      await scanSiteVulnerabilities(userInputUrl);
      console.log("\n\n"+chalk.bold('Security scan completed.'))
    }
  } else {
    ConsoleMessages.printWebsiteScanIntro(userInputUrl);
    await scanSiteVulnerabilities(userInputUrl);
    console.log("\n\n"+chalk.bold('Security scan completed.'))
  }
});

