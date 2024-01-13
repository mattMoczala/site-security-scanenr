import puppeteer from "puppeteer";
import { ConsoleMessages } from "./Messages/ConsoleMessages";
import { checkContentForVulnerabilities } from "./checkForVulnerabilities";

/**
 * Conducts a security scan for potential vulnerabilities related to libraries and scripts on a specified website.
 *
 * @param url - The URL of the website to be scanned.
 * @returns A Promise that resolves when the security scan is complete.
 */
export const scanSiteVulnerabilities = (url: string): Promise<void> => {
  return new Promise(async (resolve) => {
    try {
      // Launch Puppeteer browser
      const browser = await puppeteer.launch({
        headless: "new",
        args: ["--ignore-certificate-errors"],
      });
      const page = await browser.newPage();
      await page.goto(url);

      // Check if the page uses React, jQuery, Angular, jQuery Confirm, or Ember
      const libraries = await page.evaluate(() => {
        return {
          usesReact: Array.from(document.querySelectorAll("[id]")).some(
            (e) => (e as any)._reactRootContainer !== undefined
          ),
          usesJQuery: !!(window as any).jQuery,
          usesAngular: !!(window as any).getAllAngularRootElements,
          usesJQueryConfirm: !!(window as any).$
            ? !!(window as any).$.hasOwnProperty("confirm")
            : false,
          usesEmber: !!(window as any).Ember || !!(window as any).EmberENV,
        };
      });
      ConsoleMessages.printUsedLibrariesInfo(libraries, url);

      // Check script tags on the actual page
      const inlineScriptHandles = await page.$$("script:not([src])");
      for (const handle of inlineScriptHandles) {
        const inlineScriptContent = await page.evaluate(
          (el) => el.innerHTML,
          handle
        );
        checkContentForVulnerabilities(inlineScriptContent, url, libraries);
      }

      // Check external JS files
      const scriptHandles = await page.$$("script[src]");
      const scriptUrls = await Promise.all(
        scriptHandles.map((handle) => handle.getProperty("src"))
      );
      const scriptSrcs = await Promise.all(
        scriptUrls.map((handle) => handle.jsonValue())
      );

      for (const scriptSrc of scriptSrcs) {
        if (!scriptSrc.startsWith("http") && !scriptSrc.startsWith("https")) {
          continue;
        }

        // Create a new page to fetch external JS content
        const jsPage = await browser.newPage();
        await jsPage.goto(scriptSrc);
        const jsContent = await jsPage.content();

        checkContentForVulnerabilities(jsContent, scriptSrc, libraries);
      }

      // Close the browser after the scan is complete
      await browser.close();
      resolve();
    } catch (error) {
      console.error(error)
      resolve();
    }
  });
};