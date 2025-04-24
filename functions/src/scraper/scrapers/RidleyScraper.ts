import { Page } from "playwright";
import { BaseScraper } from "./BaseScraper";

export class RidleyScraper extends BaseScraper {
    public static async checkWillScrape(page: Page): Promise<boolean> {
        const title = await page.title();
        return title.includes("Ridley School District");
    }

    public async scrape(page: Page): Promise<void> {
        const meetingSection = page.locator(
            "div.row.ts-one-column-row",
            {
                has: page.locator(
                    "h2",
                    { hasText: "Meeting Dates" },
                ),
            },
        );

        this.logger.log("Waiting for meeting section to be visible");

        // Wait for the meeting section to be visible
        await meetingSection.waitFor({
            state: "visible",
            timeout: 4000,
        });

        const meetingTableRows = await meetingSection.locator(
            "table tbody tr",
        ).all();

        const possibleMeetingDates: Record<string, boolean> = {};

        this.logger.log("Looking for meeting dates in table rows");
        for (const row of meetingTableRows) {
            const dateText = await row.locator("td").nth(1).textContent();
            if (!dateText) {
                this.logger.log("No date text found in row");
                continue;
            }
            const date = new Date(`${dateText} UTC`);
            if (date >= this.meetingCutoffDate) {
                this.logger.log(
                    `Will look for meeting docs for meeting date: ${date.toDateString()}`,
                );
                possibleMeetingDates[date.toISOString()] = true;
            }
        }

        const agendaButton = page.locator("a.button", { hasText: "Agenda" });
        this.logger.log("Clicking agenda button");
        await agendaButton.click();

        const documentsSection = page.locator("#documents");
        this.logger.log("Waiting for documents section to be visible");
        await documentsSection.waitFor({
            state: "visible",
            timeout: 4000,
        });

        // Let documents load
        await page.waitForLoadState("networkidle");

        this.logger.log("Looking for documents in documents section");

        const documentLinks = await documentsSection.locator(
            "div.col.first-col>a",
        ).all();

        this.logger.log(
            `Found ${documentLinks.length} document links in documents section`,
        );

        for (const link of documentLinks) {
            const documentName = await link.textContent();
            if (!documentName) {
                this.logger.log("No document name found");
                continue;
            }
            const date = this.getDateFromText(documentName);
            if (!date) {
                this.logger.log(
                    `No date found in document name: ${documentName}`,
                );
                continue;
            }
            if (possibleMeetingDates[date.toISOString()]) {
                this.logger.log(
                    `Will parse document name: ${documentName}, Date: ${date.toDateString()}`,
                );
                const meetingKey = this.addMeetingToMap(
                    "School Board Meeting",
                    date,
                );

                await link.evaluate((el) => {
                    el.setAttribute("download", "");
                });

                const fileDownloadPromise = page.waitForEvent("download");
                await link.click();
                const download = await fileDownloadPromise;
                const filenames = await this.downloadFileToTempFolder(
                    meetingKey,
                    download,
                );
                this.logger.log("Downloaded file: ", filenames);
                this.addFilenameToMeeting(meetingKey, filenames);
            } else {
                this.logger.log(
                    `Skipping document name: ${documentName}, Date: ${date.toDateString()}`,
                );
            }
        }
    }

    private getDateFromText(
        text: string,
    ): Date | null {
        const dateRegex =
            /^(\d{1,2})\s(January|February|March|April|May|June|July|August|September|October|November|December)(?:\s(\d{4}))?/;

        const match = text.match(dateRegex);
        if (match) {
            const day = parseInt(match[1]);
            const month = match[2];
            const year = parseInt(match[3]) || new Date().getUTCFullYear(); // Default to "Unknown" if the year is missing

            this.logger.log(`Parsed date: ${day} ${month} ${year}`);

            if (isNaN(day) || isNaN(year)) {
                this.logger.log(
                    `Invalid date found in text: ${text}`,
                );
                return null; // Return null if any part of the date is invalid
            }

            return new Date(`${month} ${day}, ${year} UTC`);
        }
        return null; // Return null if no match is found
    }
}
