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

/**
 * Asks the user if a pre-scan is necessary.
 * @returns A Promise boolean if the pre-scan should be triggered..
 */
const askUserForPreScan = (): Promise <boolean> => {
  return new Promise<boolean>(async (resolve) => {
    const userInput = await getUserInput("Should pre-scan data be pulled from Shodan? (y/n): ")
    if (userInput.toLowerCase() === 'y' || userInput.toLowerCase() === 'yes') {
      resolve(true);
    } else if (userInput.toLowerCase() === 'n' || userInput.toLowerCase() === 'no')  {
      resolve(false);
    } else {
      resolve(await askUserForPreScan())
    }
  })
}

askUserForPreScan().then(async (doPreScan) => {
 if (doPreScan) {
  let shodanApiKey = process.env.SHODAN_KEY;
  if (!shodanApiKey) {
    shodanApiKey = await getUserInput("Shodan API key: ");
  }
  const targetIP = await getUserInput("Target IP: ");
  const shodanReqURL = `https://api.shodan.io/shodan/host/${targetIP}?key=${shodanApiKey}`;
  const res = await fetch(shodanReqURL);
  console.log(res.status)
  const shodanData = await res.json();
  console.clear();

  if (!res.ok) {
    console.log(`\n An error occured while fetching shodan API, server responded with code ${res.status}, response body: \n`, shodanData );

    console.log('\nExitting...')
    process.exit(1);
  }

  shodanData.domains ? console.log(chalk.yellow.bold("Domains: "), shodanData.domains) : null;
  shodanData.country_name ? console.log(chalk.yellow.bold("Country: "), shodanData.country_name) : null;
  shodanData.isp ? console.log(chalk.yellow.bold("Service provider: "), shodanData.isp) : null;
  shodanData.vulns ? console.log(chalk.yellow.bold("Vulnerabilities: "), shodanData.vulns) : null;
  shodanData.ports ? console.log(chalk.yellow.bold("Open ports: "), shodanData.ports) : null;

  const userProceedInput = await getUserInput(`\nDo you want to proceed with a scan for the issued IP? (type 'confirm' to continue): `);
  if (userProceedInput.toLowerCase() === 'confirm') {
    const userInputCrawl = await getUserInput("Crawl sites for sublinks? (y/n): ");

    if (userInputCrawl.toLowerCase() === 'y' || userInputCrawl.toLowerCase() === 'yes') {
      const userInputCrawlAmount = await getUserInput("Crawl depth (number): ");
      if (typeof(userInputCrawlAmount) === "string") {
        const parsedCrawlAmount = parseInt(userInputCrawlAmount);
        if (!isNaN(parsedCrawlAmount)) {
          const crawler = new Crawler('https://'+targetIP, true);
            const crawledLinks = await crawler.crawlForSameOriginLinks(parsedCrawlAmount);
            console.log('Unique Crawled Links:', crawledLinks);
            console.log('Running vulnerability scan in 5 seconds...');
            await setTimeout(async () => {
              console.clear();
              for (const link of crawledLinks) {
                await scanSiteVulnerabilities(link);
              }
              console.log("\n\n"+chalk.bold('Security scan completed.'))
              process.exit(0)
            }, 5000);
        }
      }
    } else {
        ConsoleMessages.printWebsiteScanIntro('https://'+targetIP);
        await scanSiteVulnerabilities('https://'+targetIP);
        console.log("\n\n"+chalk.bold('Security scan completed.'))
        process.exit(0)
    }
  } else {
    console.log('\nExitting...')
    process.exit(0)
  }
 } else {
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
              process.exit(0)
            }, 5000);
          }
        }
      } else {
        ConsoleMessages.printWebsiteScanIntro(userInputUrl);
        await scanSiteVulnerabilities(userInputUrl);
        console.log("\n\n"+chalk.bold('Security scan completed.'))
        process.exit(0)
      }
    } else {
      ConsoleMessages.printWebsiteScanIntro(userInputUrl);
      await scanSiteVulnerabilities(userInputUrl);
      console.log("\n\n"+chalk.bold('Security scan completed.'))
      process.exit(0)
    }
  });
 }
})



