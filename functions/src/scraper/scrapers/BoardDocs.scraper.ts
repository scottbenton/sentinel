import { Page } from "playwright";
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
            const yearSection = page.locator(
                `//section[.//a[text()="${year}"]]`,
            );
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

            const idOfYearPanel = await yearSection.getAttribute(
                "aria-controls",
            );
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
                        `Skipping meeting from ${meetingDate}: it is in the past`,
                    );
                    continue;
                }

                const meetingType = await meeting.locator("div:last-child")
                    .innerText();
                this.logger.log("Meeting info", { meetingDate, meetingType });

                const meetingKey = this.addMeetingToMap(
                    meetingType,
                    meetingDate,
                );

                await meeting.click();
                await delaySeconds(2); // Wait for page to switch, so we don't download the wrong agenda
                const agendaDownloadButton = page.locator(
                    "a#btn-download-agenda-pdf",
                );
                await agendaDownloadButton.waitFor({ state: "visible" });

                const downloadPromise = page.waitForEvent("download");
                await agendaDownloadButton.click();
                const download = await downloadPromise;
                const filenames = await this.downloadFileToTempFolder(
                    meetingKey,
                    download,
                );
                this.logger.log("Downloaded file", { filenames });
                this.addFilenameToMeeting(
                    meetingKey,
                    filenames,
                );
            }
        }
    }
}
