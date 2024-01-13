import puppeteer from "puppeteer";
import { isSameURLOrigin } from "./utils/isSameURLOrigin";
import isValidURL from "./utils/isValidURL";
import { checkUrlForFileType } from "./utils/checkUrlForFileType";
import { filterDistinctValues } from "./utils/filterDistinctValues";
import { ConsoleMessages } from "./Messages/ConsoleMessages";

/**
 * The main class for crawling web pages and extracting links.
 */
export class Crawler {
  private crawledLinks: Set<string> = new Set();

  /**
   * Constructor for the Crawler class.
   * @param rootUrl - The root URL to start crawling from.
   * @param printMessages - Whether to print messages during crawling.
   * @throws Will throw an error if the rootUrl is not a valid URL.
   */
  constructor(
    private readonly rootUrl: string,
    private readonly printMessages: boolean
  ) {
    this.printMessages = printMessages;
    if (isValidURL(rootUrl)) this.rootUrl = rootUrl;
    else
      throw new Error(
        `Crawler: Value of rootUrl parameter "${rootUrl}" isn't a valid URL.`
      );
  }

  /**
   * Crawls for links with the same origin up to a specified depth.
   * @param crawlDepth - The depth to crawl to.
   * @returns A Promise resolving to an array of distinct links with the same origin.
   */
  public async crawlForSameOriginLinks(
    crawlDepth: number
  ): Promise<Array<string>> {
    return new Promise(async (resolve) => {
      try {
        const result: string[] = [];
        await this.crawlRecursive(this.rootUrl, crawlDepth, result);
        if (this.printMessages) console.clear();
        result.push(this.rootUrl);
        resolve(filterDistinctValues(result));
      } catch (error) {
        console.error(error)
        resolve([]);
      }
    });
  }

  private async crawlRecursive(url: string, depth: number, result: string[]) {
    if (depth === 0 || this.crawledLinks.has(url.toLowerCase())) return;

    const normalizedUrl = this.normalizeUrl(url);
    if (!normalizedUrl || this.crawledLinks.has(normalizedUrl.toLowerCase()))
      return;

    const links = await this.getLinksSameOrigin(url);
    this.crawledLinks.add(normalizedUrl.toLowerCase());

    for (const link of links) {
      result.push(link);
      await this.crawlRecursive(link, depth - 1, result);
    }
  }

  private normalizeUrl(url: string): string | null {
    try {
      const normalized = new URL(url).toString();
      return normalized;
    } catch (error) {
      console.error(`Invalid URL: ${url}`);
      return null;
    }
  }

  private async getLinksSameOrigin(url: string): Promise<Array<string>> {
    if (this.printMessages)
      ConsoleMessages.printCrawlingSubUrlScreen(
        url,
        this.rootUrl,
        this.crawledLinks.size
      );

    return new Promise(async (resolve) => {
      try {
        const browser = await puppeteer.launch({ headless: "new" });
        const page = await browser.newPage();
        await page.goto(url, { waitUntil: "networkidle2" });

        const links = await page.$$eval("a", (anchors) => {
          return anchors.map((anchor) => anchor.getAttribute("href"));
        });

        await browser.close();

        const linksFromSameOrigin: Set<string> = new Set();
        for (let link of links) {
          if (this.printMessages && typeof link === "string")
            ConsoleMessages.printCheckingUrlForValid(link);

          if (typeof link === "string") {
            if (isValidURL(link)) {
              if (isSameURLOrigin(url, link)) {
                if (link.startsWith("http")) {
                  if (await checkUrlForFileType(link, "text/html"))
                    linksFromSameOrigin.add(link);
                } else {
                  if (
                    await checkUrlForFileType("https://" + link, "text/html")
                  )
                    linksFromSameOrigin.add("https://" + link);
                }
              }
            } else {
              // Relative link
              if (link.startsWith("/")) {
                const origin = new URL(url).origin;
                const absoluteLink = origin + link;
                if (isValidURL(absoluteLink)) {
                  if (await checkUrlForFileType(absoluteLink, "text/html"))
                    linksFromSameOrigin.add(absoluteLink);
                }
              }
              if (link.startsWith("./")) {
                const origin = new URL(url).origin;
                const absoluteLink = origin + link.substring(1);
                if (isValidURL(absoluteLink))
                  if (await checkUrlForFileType(absoluteLink, "text/html"))
                    linksFromSameOrigin.add(absoluteLink);
              }
            }
          }
        }
        resolve(Array.from(linksFromSameOrigin));
      } catch (error) {
        console.error(error);
        resolve([])
      }
    });
  }
}
