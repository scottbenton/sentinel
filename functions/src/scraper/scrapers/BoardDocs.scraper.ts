import { Locator, Page } from "playwright";
import { BaseScraper } from "./BaseScraper";
import { delaySeconds } from "./scrapeHelpers";

export class BoardDocsScraper extends BaseScraper {
  static async checkWillScrape(page: Page): Promise<boolean> {
    const pageTitle = await page.title();
    return pageTitle.includes("BoardDocs");
  }

  async scrape(page: Page): Promise<void> {
    this.logger.log("Scraping BoardDocs...");
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
        this.logger.warn(`No section found for year ${year}`);
        continue;
      }

      const isYearSectionAlreadyExpanded = await yearSection.getAttribute(
        "aria-expanded",
      );
      if (isYearSectionAlreadyExpanded === "false") {
        this.logger.log("Expanding year section");
        await yearSection.locator("a").click();
      } else {
        this.logger.log("Year section already expanded");
      }

      const idOfYearPanel = await yearSection.getAttribute("aria-controls");
      const yearPanel = page.locator(`#${idOfYearPanel}`);
      await yearPanel.waitFor({ state: "visible" });

      const meetings = await yearPanel.locator("a").all();
      for (const meeting of meetings) {
        const meetingDateNode = meeting.locator("strong");
        const isMeetingDateVisible = await meetingDateNode.isVisible();
        if (!isMeetingDateVisible) {
          this.logger.warn(`No date found for meeting`);
          continue;
        }

        const meetingDateText = await meetingDateNode.innerText();
        const meetingDate = new Date(`${meetingDateText} UTC`);

        if (meetingDate < this.meetingCutoffDate) {
          this.logger.log(
            `Skipping meeting from ${meetingDate.getDate()}: it is in the past`,
          );
          continue;
        }

        const meetingType = await meeting.locator("div:last-child").innerText();
        this.logger.log("Meeting info", { meetingDate, meetingType });

        const meetingKey = this.addMeetingToMap(meetingType, meetingDate);

        this.logger.log("Meeting key", { meetingKey });

        await meeting.click();
        await delaySeconds(2); // Wait for page to switch, so we don't download the wrong agenda
        const agendaDownloadButton = page.locator("a#btn-download-agenda-pdf");
        await agendaDownloadButton.waitFor({ state: "visible" });

        const downloadPromise = page.waitForEvent("download");
        await agendaDownloadButton.click();
        const download = await downloadPromise;
        const filenames = await this.downloadFileToTempFolder(
          meetingKey,
          download,
        );
        this.logger.log("Downloaded file", { filenames });
        this.addFilenameToMeeting(meetingKey, filenames);

        // Click the button to view the agenda
        const viewAgendaButton = page.locator("a#btn-view-agenda");
        await viewAgendaButton.click();

        const agendaPane = page.locator("#agenda");
        await agendaPane.waitFor({ state: "visible" });

        this.logger.log("Found agenda pane");

        // Grab all li with a child that has the class "fa-file-text-o"
        const agendaItems = await agendaPane.locator("li").all();
        this.logger.log(`Found ${agendaItems.length} agenda items`);
        for (const agendaItem of agendaItems) {
          const hasFileIcon = await agendaItem
            .locator(".fa-file-text-o")
            .isVisible();
          if (!hasFileIcon) {
            this.logger.warn(`No file icon found for agenda item`);
            continue;
          }

          // Get the id of the agenda item
          const agendaItemId = await agendaItem.getAttribute("id");
          this.logger.log("Agenda item", {
            agendaItemId,
          });
          if (!agendaItemId) {
            this.logger.warn("No id found for agenda item");
            continue;
          }

          await agendaItem.click();
          this.logger.log("Clicked agenda item");

          // Wait for the input to have the correct value
          const currentAgendaInput = page.locator(
            'input[name="agenda-item-unique"]',
          );
          await delaySeconds(1);
          const currentAgendaInputValue = await currentAgendaInput.inputValue();
          if (currentAgendaInputValue !== agendaItemId) {
            this.logger.warn(
              `Agenda item id ${agendaItemId} does not match input value ${currentAgendaInputValue}`,
            );
            continue;
          }

          this.logger.log("Agenda item input value matches");
          // Agenda item buttons
          const agendaItemSection = page.locator("#view-agenda-item");
          await agendaItemSection.waitFor({ state: "visible" });
          const agendaItemDownloadButtons = await agendaItemSection
            .locator("a.public-file")
            .all();
          this.logger.log(
            `Found ${agendaItemDownloadButtons.length} agenda item download buttons`,
          );
          for (const agendaItemDownloadButton of agendaItemDownloadButtons) {
            const downloadPromise = page.waitForEvent("download");

            // Add the download attribute to the button
            await agendaItemDownloadButton.evaluate((el) =>
              el.setAttribute("download", "")
            );

            // Adding modifiers to the click to force download rather than open in new tab
            await agendaItemDownloadButton.click();
            const download = await downloadPromise;
            const filenames = await this.downloadFileToTempFolder(
              meetingKey,
              download,
            );
            this.logger.log("Downloaded file", { filenames });
            this.addFilenameToMeeting(meetingKey, filenames);
          }
        }

        const meetingsTab = page.locator("#mainMeetings");
        await meetingsTab.click();

        const meetingsPane = page.locator("#meeting-accordion");
        await meetingsPane.waitFor({ state: "visible" });
      }
    }

    let libraryEventsButton: Locator | null = null;
    try {
      const libraryMoreButton = page.locator("#library-menu-arrow");
      await libraryMoreButton.waitFor({ state: "visible", timeout: 2000 });
      await libraryMoreButton.click();
      libraryEventsButton = page.locator("#library-events");
      await libraryEventsButton.waitFor({ state: "visible", timeout: 2000 });
    } catch {
      this.logger.log("Library events button not found");
      return;
    }

    this.logger.log("Checking Library Events Tab");
    await libraryEventsButton.click();

    await delaySeconds(2);
    const accordionTabs = await page.locator(
      'section[aria-level="2"][aria-expanded]',
      { hasNotText: "Featured" },
    ).all();

    for (const accordionTab of accordionTabs) {
      const isTabVisible = await accordionTab.isVisible();
      if (!isTabVisible) {
        continue;
      }
      const textContent = await accordionTab.textContent();
      this.logger.log("Found visible tab with text content", textContent);

      const isPanelAlreadyExpanded = await accordionTab.getAttribute(
        "aria-expanded",
      );
      if (isPanelAlreadyExpanded === "false") {
        this.logger.log("Expanding section");
        await accordionTab.locator("a").click();
      } else {
        this.logger.log("Section already expanded");
      }

      const idOfPanel = await accordionTab.getAttribute("aria-controls");
      const accordionPanel = page.locator(`#${idOfPanel}`);
      await accordionPanel.waitFor({ state: "visible" });

      const libraryEvents = await accordionPanel.locator("a").all();
      this.logger.log(`Found ${accordionTabs.length} library events tabs`);

      for (const meeting of libraryEvents) {
        const meetingDateNode = meeting.locator("div:last-child");
        const isMeetingDateVisible = await meetingDateNode.isVisible();
        if (!isMeetingDateVisible) {
          this.logger.warn(`No date found for meeting`);
          continue;
        }

        const meetingDateText = await meetingDateNode.innerText();
        const meetingDate = new Date(`${meetingDateText} UTC`);

        if (meetingDate < this.meetingCutoffDate) {
          this.logger.log(
            `Skipping meeting from ${meetingDate.getDate()}: it is in the past`,
          );
          continue;
        }

        const meetingType = await meeting.locator("div:first-child")
          .innerText();
        this.logger.log("Meeting info", { meetingDate, meetingType });

        await meeting.click();
        await delaySeconds(2); // Wait for page to switch, so we don't download the wrong agenda

        this.logger.log("Agenda item input value matches");
        // Agenda item buttons
        let agendaItemDownloadButtons: Locator[] = [];

        try {
          const agendaItemSection = page.locator('div[filetype="public"]');
          await agendaItemSection.waitFor({ state: "visible", timeout: 2000 });
          agendaItemDownloadButtons = await agendaItemSection
            .locator("a.public-file")
            .all();
        } catch {
          this.logger.warn("No agenda item section found");
        }

        if (agendaItemDownloadButtons.length === 0) {
          this.logger.log(
            `Skipping meeting ${meetingType}: no agenda item download buttons found`,
          );
          continue;
        }

        const meetingKey = this.addMeetingToMap(meetingType, meetingDate);
        this.logger.log("Meeting key", { meetingKey });

        this.logger.log(
          `Found ${agendaItemDownloadButtons.length} agenda item download buttons`,
        );
        for (const agendaItemDownloadButton of agendaItemDownloadButtons) {
          const downloadPromise = page.waitForEvent("download");

          const filename = await agendaItemDownloadButton.textContent();
          this.logger.log(`Downloading file ${filename}`);

          // Add the download attribute to the button
          await agendaItemDownloadButton.evaluate((el) =>
            el.setAttribute("download", "")
          );

          // Adding modifiers to the click to force download rather than open in new tab
          await agendaItemDownloadButton.click();
          const download = await downloadPromise;
          const filenames = await this.downloadFileToTempFolder(
            meetingKey,
            download,
          );
          this.logger.log("Downloaded file", { filenames });
          this.addFilenameToMeeting(meetingKey, filenames);
          await delaySeconds(.25);
        }
      }
    }
  }
}
