import * as logger from "firebase-functions/logger";
import { Page } from "playwright";
import { BaseScraper } from "./BaseScraper.class";
import { delaySeconds } from "./helpers";

export class BoardDocsScrapper extends BaseScraper {
  async checkWillScrape(page: Page): Promise<boolean> {
    const selector = 'a[href*="boarddocs.com"]';

    // Check existance of boardDocs link
    const boardDocsLink = await page.$(selector);
    if (!boardDocsLink) {
      return false;
    }
    return true;
  }

  async scrape(page: Page): Promise<void> {
    const loadingOverlay = page.locator("#loading-boarddocs");
    await loadingOverlay.waitFor({ state: "hidden" });

    const meetingsTab = page.locator("#mainMeetings");
    await meetingsTab.click();

    const meetingsPane = page.locator("#meeting-accordion");
    await meetingsPane.waitFor({ state: "visible" });

    const yearsToCheck = [
      this.meetingCutoffDate.getFullYear(),
      this.meetingCutoffDate.getFullYear() + 1,
    ];

    for (const year of yearsToCheck) {
      const yearSection = page.locator(`//section[.//a[text()="${year}"]]`);
      const yearSectionCount = await yearSection.count();
      if (!yearSectionCount) {
        logger.warn(`No section found for year ${year}`);
        continue;
      }

      const isYearSectionAlreadyExpanded = await yearSection.getAttribute(
        "aria-expanded"
      );
      if (isYearSectionAlreadyExpanded === "false") {
        logger.info("Expanding year section");
        await yearSection.locator("a").click();
      } else {
        logger.info("Year section already expanded");
      }

      const idOfYearPanel = await yearSection.getAttribute("aria-controls");
      const yearPanel = page.locator(`#${idOfYearPanel}`);
      await yearPanel.waitFor({ state: "visible" });

      const meetings = await yearPanel.locator("a").all();
      for (const meeting of meetings) {
        const meetingDateNode = meeting.locator("strong");
        const isMeetingDateVisible = await meetingDateNode.isVisible();
        if (!isMeetingDateVisible) {
          logger.warn(`No date found for meeting`);
          continue;
        }

        const meetingDateText = await meetingDateNode.innerText();
        const meetingDate = new Date(`${meetingDateText} UTC`);

        if (meetingDate < this.meetingCutoffDate) {
          logger.info(
            `Skipping meeting from ${meetingDate}: it is in the past`
          );
          continue;
        }

        const meetingType = await meeting.locator("div:last-child").innerText();
        logger.info("Meeting info", { meetingDate, meetingType });

        const agenda = this.addMeetingToMap(meetingType, meetingDate);

        await meeting.click();
        await delaySeconds(2); // Wait for page to switch, so we don't download the wrong agenda
        const agendaDownloadButton = page.locator("a#btn-download-agenda-pdf");
        await agendaDownloadButton.waitFor({ state: "visible" });

        const downloadPromise = page.waitForEvent("download");
        await agendaDownloadButton.click();
        const download = await downloadPromise;
        await this.downloadFileToTempFolder(download, agenda.filename);
      }
    }
  }
}
