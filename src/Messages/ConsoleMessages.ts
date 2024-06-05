import chalk from "chalk";
import { VulnerabilityMessages } from "./VulnerabilityMessages";

/**
 * Class containing static methods for printing various console messages related to security scans and URL processing.
 */
export class ConsoleMessages {
  /**
   * Static property containing vulnerability-related messages.
   */
  public static vulnerabilityMessages = VulnerabilityMessages;

  /**
   * Prints a message indicating that the provided input is not a valid URL.
   */
  public static printInvalidUrl() {
    console.log(chalk.red("Provided input is not a valid URL, try again..."));
  }

  /**
   * Prints a message indicating that the program is checking if a found href is a valid site URL.
   *
   * @param url - The URL being checked.
   */
  public static printCheckingUrlForValid(url: string) {
    console.log(chalk.yellow(`Checking if found href `) + chalk.yellow.underline(`${url}`) + chalk.yellow(` is a valid site URL`));
  }

  /**
   * Prints a message indicating that the URL points to a valid site.
   */
  public static printValidUrl() {
    console.log(chalk.green("URL points to a valid site."));
  }

  /**
   * Prints information during the crawling process, including the current URL, root URL, and the number of crawled URLs.
   *
   * @param url - The current URL being crawled.
   * @param rootUrl - The root URL of the website.
   * @param crawledAmount - The number of crawled URLs.
   */
  public static printCrawlingSubUrlScreen(url: string, rootUrl: string, crawledAmount: number) {
    console.clear();
    console.log(chalk.yellow("################################################################################"));
    console.log(chalk.yellow("\t\tCrawling ") + chalk.underline.yellow(url) + chalk.yellow("\n\t\tfor same origin URLs.\n"));
    console.log(chalk.yellow("\t\tCrawled URLs: ") + chalk.yellow.bold(crawledAmount));
    console.log(chalk.yellow("################################################################################"));
    console.log(chalk.yellow("\n"));
  }

  /**
   * Prints an introductory message for the website security scan.
   *
   * @param url - The URL of the website being scanned.
   */
  public static printWebsiteScanNoIntro(url: string) {
    console.log(chalk.green("\tChecking site for known vulnerabilities, running security scan at:"));
    console.log("\t" + chalk.green.bold.underline(`${url}\n\n`));
  }

  /**
   * Prints an introductory message for the website security scan with a clear console.
   *
   * @param url - The URL of the website being scanned.
   */
  public static printWebsiteScanIntro(url: string) {
    console.clear();
    console.log(chalk.green("################################################################################\n"));
    console.log(chalk.green("\tChecking website for known vulnerabilities, running security scan at:"));
    console.log("\t" + chalk.green.bold.underline(`${url}`));
    console.log(chalk.green("\n################################################################################\n"));
  }

  /**
   * Prints information about the libraries used on the website based on the provided library detection object.
   *
   * @param usedLibraries - An object indicating the presence of various libraries.
   * @param url - The URL of the website.
   */
  public static printUsedLibrariesInfo(usedLibraries: any, url: string) {
    const libraries: Array<string> = [];

    if (usedLibraries.usesReact) {
      libraries.push(chalk.bold('React'));
    }
    if (usedLibraries.usesJQuery) {
      libraries.push(chalk.bold('jQuery') + ' ' + chalk.bold(usedLibraries.jQueryVersion));
    }
    if (usedLibraries.usesAngular) {
      libraries.push(chalk.bold('angular'));
    }
    if (usedLibraries.usesJQueryConfirm) {
      libraries.push(chalk.bold('jQuery-confirm'));
    }
    if (usedLibraries.usesEmber) {
      libraries.push(chalk.bold('ember.js'));
    }

    const librariesText = libraries.join(', ');

    console.log(chalk.inverse(`Script detected libraries implemented on site: "${chalk.underline(url)}" `) + chalk.inverse(`${librariesText}`));

    if (usedLibraries.usesJQuery && usedLibraries.jQueryVersion) {

      if (usedLibraries.jQueryVersion >= '1.2' && usedLibraries.jQueryVersion < '3.5.0') {
        console.log(`jQuery version ${usedLibraries.jQueryVersion} is known for vulnerability: CVE-2020-11023`)
        console.log(`jQuery version ${usedLibraries.jQueryVersion} is known for vulnerability: CVE-2020-11022`)
      }
      if (usedLibraries.jQueryVersion <= `1.8.3` && usedLibraries.jQueryVersion >= `1.0` ) {
        console.log(`jQuery version ${usedLibraries.jQueryVersion} is known for vulnerability: CVE-2020-7656`)
      }
      if (usedLibraries.jQueryVersion <= `3.3.1` && usedLibraries.jQueryVersion >= `1.0` ) {
        console.log(`jQuery version ${usedLibraries.jQueryVersion} is known for vulnerability: CVE-2019-11358`)
      }
      if (usedLibraries.jQueryVersion <= `1.8.3` && usedLibraries.jQueryVersion >= `1.7.1` ) {
        console.log(`jQuery version ${usedLibraries.jQueryVersion} is known for vulnerability: CVE-2012-6708`)
      }
      if (usedLibraries.jQueryVersion <= `2.2.1` && usedLibraries.jQueryVersion >= `1.0` ) {
        console.log(`jQuery version ${usedLibraries.jQueryVersion} is known for vulnerability: CVE-2015-9251`)
      }
    }
  }
}
