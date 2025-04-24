import { Page } from "playwright";
import { BaseScraper } from "./BaseScraper";

export class GarnetValleyScraper extends BaseScraper {
    public static async checkWillScrape(page: Page): Promise<boolean> {
        const title = await page.title();
        return title.includes("Garnet Valley School Board");
    }
    public async scrape(page: Page) {
        const meetingDocLinks = await page.locator(
            'li>p[role="presentation"]>a',
        ).all();

        const meetingDocNames = await page.locator('li>p[role="presentation"]')
            .allTextContents();

        const meetingsToDownload: {
            index: number;
            name: string;
            date: Date;
        }[] = [];

        meetingDocNames.forEach((name, index) => {
            const spaceIndex = name.indexOf(" ");
            const date = new Date(`${name.substring(0, spaceIndex)} UTC`);
            const meetingName = name.substring(spaceIndex + 1);
            // This one specific date is wrong
            if (
                date >= this.meetingCutoffDate &&
                name !== "01.26.26 Board Meeting Agenda"
            ) {
                meetingsToDownload.push({
                    index,
                    date,
                    name: meetingName,
                });
                this.logger.log(
                    `Will parse meeting name: ${name}, Date: ${date.toDateString()}`,
                );
            }
        });

        for (const { index, name, date } of meetingsToDownload) {
            const meetingKey = this.addMeetingToMap(
                name,
                date,
            );

            const link = meetingDocLinks[index];

            const context = page.context();
            const filePagePromise = context.waitForEvent("page");

            this.logger.log("Opening file page");
            await link.click();

            this.logger.log("Waiting for file page to open");
            const drivePage = await filePagePromise;

            // Open new tab
            await drivePage.bringToFront();

            this.logger.log(`New tab URL: ${drivePage.url()}`);

            // wait for the new page to load
            await drivePage.waitForLoadState("networkidle");

            this.logger.log("Tab loaded, clicking download button");
            const downloadButton = drivePage.locator(
                'div[role="button"][data-tooltip="Download"]',
            );
            const downloadPromise = drivePage.waitForEvent("download");
            await downloadButton.click();
            // NOTE - this only works in headless mode. Download functions differently in headful mode
            this.logger.log("Waiting for download to start");
            const download = await downloadPromise;
            this.logger.log(
                "Download event fired, waiting for download to finish",
            );
            const filenames = await this.downloadFileToTempFolder(
                meetingKey,
                download,
            );
            this.logger.log("Downloaded file: ", filenames);
            this.addFilenameToMeeting(meetingKey, filenames);

            await drivePage.close();
        }
    }
}
