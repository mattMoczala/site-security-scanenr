import { ConsoleMessages } from "./Messages/ConsoleMessages";

/**
 * Checks the provided content for potential vulnerabilities related to specific libraries and prints corresponding messages.
 *
 * @param content - The content to be checked for vulnerabilities.
 * @param srcUrl - The source URL associated with the content.
 * @param libraries - An object indicating the libraries used, with boolean values for each library's presence.
 */
export const checkContentForVulnerabilities = (
  content: string,
  srcUrl: string,
  libraries: any
) => {
  if (content.includes("dangerouslySetInnerHTML:") && libraries.usesReact) {
    ConsoleMessages.vulnerabilityMessages.printReactDangerouslySetInnerHTML(
      srcUrl
    );
  }
  if (content.includes(".load(") && libraries.usesJQuery) {
    ConsoleMessages.vulnerabilityMessages.printJqueryLoad(srcUrl);
  }
  if (content.includes(".setIcon(") && libraries.usesJQueryConfirm) {
    ConsoleMessages.vulnerabilityMessages.printJqueryConfirm(srcUrl);
  }
  if (content.includes("angular.copy(") && libraries.usesAngular) {
    ConsoleMessages.vulnerabilityMessages.printAngularCopy(srcUrl);
  }
  if (content.includes(".setProperties(") && libraries.usesEmber) {
    ConsoleMessages.vulnerabilityMessages.printEmberSetProperties(srcUrl);
  }
  if (content.includes(".set(") && libraries.usesEmber) {
    ConsoleMessages.vulnerabilityMessages.printEmberSet(srcUrl);
  }
};
